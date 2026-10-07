# Living Forge Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild visionforgestudio.app as the "Living Forge". Heat-reactive UI, the playable "Strike While It's Hot" game, lowercase mailto emails, and four generic legal pages with an industry-standard footer.

**Architecture:** Pure TypeScript logic (`lib/heat.ts`, `lib/forge-game.ts`) is unit-tested with `node:test`. React client components consume it. A single page-wide `SparkField` canvas is exposed through context so every section shares one render loop. Sections are server components where possible, with client islands for heat, scroll and game.

**Tech Stack:** Next.js 16.4 (App Router, `cacheComponents: true`), React 19.3, Motion 14 (`motion/react`), Tailwind CSS 4, lucide-react, and `next/font/google`. No new runtime dependencies.

**Spec:** `docs/superpowers/specs/2026-10-06-living-forge-redesign-design.md`

## Global Constraints

- No new runtime dependencies. Allowed: next, react, react-dom, motion, lucide-react.
- Every email anywhere in source is lowercase: `sales@visionforgestudio.app` and `support@visionforgestudio.app`, rendered as `<a href="mailto:…">`.
- Never write "Ltd". The entity is "Vision Forge", a partnership, Business Names Act Cap. 247, Reg. No. 000058528, trading as "Vision Forge Studio".
- Legal copy is generic: no statute names and no fixed numbers. Governing law is Belize.
- No `new Date()`, `Date.now()` or `Math.random()` in server components (Cache Components prerender). Use them in client effects only.
- Fonts: Big Shoulders Display (display), Instrument Sans (body), Martian Mono (mono). Remove Geist.
- Colour tokens exactly as in the spec table. Cyan is removed.
- `prefers-reduced-motion: reduce` shows final states, with no sparks, shake, shimmer, ignition or scrubbed pinning.
- Touch targets are at least 44×44px. Body text is at least 16px on mobile. Text contrast is at least 4.5:1.
- Storage access (`localStorage`, `sessionStorage`) is always wrapped in try/catch.
- Tests run with `npm test` (`node --experimental-strip-types --test`). Test imports use explicit `.ts` paths.

## File Map

| File | Responsibility |
|---|---|
| `lib/heat.ts` | heat → colour / weight, cooling decay |
| `lib/forge-game.ts` | game state machine, scoring, zones, ranks |
| `lib/storage.ts` | safe get/set for local and session storage |
| `lib/site.ts` | all copy, contacts, nav, legal entity |
| `components/forge/SparkField.tsx` | shared canvas + `SparksProvider` / `useSparks()` |
| `components/forge/useHeat.ts` | pointer-proximity heat hook |
| `components/forge/HeatText.tsx` | per-letter heat headline |
| `components/forge/Ignition.tsx` | first-visit intro overlay |
| `components/game/StrikeGame.tsx` | game stage, loop, input |
| `components/game/GameHud.tsx` | score, combo, time, piece slots |
| `components/game/ResultCard.tsx` | end screen + CTAs |
| `components/game/clang.ts` | WebAudio strike sound |
| `components/sections/*.tsx` | Furnace, RawMaterials, Strike, Process, ConnectedSystem, Hallmarks, Quench |
| `components/visuals/ArchitectureDiagram.tsx` | restyled tap-node diagram |
| `components/visuals/Billet.tsx` | 5-stage forging SVG |
| `components/ui/*` | Logo, CtaLink, Label, SectionHeading, EmailLink |
| `components/layout/*` | Navbar, Footer, LegalLayout |
| `app/{terms,privacy,disclaimer,cookies}/page.tsx` | legal pages |

---

### Task 1: Heat maths

**Files:**
- Create: `lib/heat.ts`
- Test: `tests/heat.test.ts`

**Interfaces:**
- Produces: `clamp01(v: number): number`, `heatRgb(h: number): [number, number, number]`, `heatColor(h: number): string` (format `rgb(r g b)`), `heatWeight(h: number): number`, `coolDown(h: number, dtMs: number): number`, `HALF_LIFE_MS = 600`.

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { coolDown, heatColor, heatRgb, heatWeight, HALF_LIFE_MS } from "../lib/heat.ts";

test("heat colour hits each stop", () => {
  assert.deepEqual(heatRgb(0), [230, 228, 223]);
  assert.deepEqual(heatRgb(0.35), [255, 90, 31]);
  assert.deepEqual(heatRgb(0.7), [242, 179, 61]);
  assert.deepEqual(heatRgb(1), [255, 244, 214]);
  assert.equal(heatColor(1), "rgb(255 244 214)");
});

test("heat is clamped", () => {
  assert.deepEqual(heatRgb(-2), heatRgb(0));
  assert.deepEqual(heatRgb(9), heatRgb(1));
});

test("weight runs 400 to 900", () => {
  assert.equal(heatWeight(0), 400);
  assert.equal(heatWeight(1), 900);
  assert.equal(heatWeight(0.5), 650);
});

test("cooling halves every half-life and floors at zero", () => {
  assert.ok(Math.abs(coolDown(1, HALF_LIFE_MS) - 0.5) < 1e-9);
  assert.equal(coolDown(0.015, HALF_LIFE_MS), 0);
});
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL, cannot find `../lib/heat.ts`.
- [ ] **Step 3: Implement**

```ts
export type RGB = [number, number, number];
const STOPS: ReadonlyArray<readonly [number, RGB]> = [
  [0, [230, 228, 223]],
  [0.35, [255, 90, 31]],
  [0.7, [242, 179, 61]],
  [1, [255, 244, 214]],
];
export const HALF_LIFE_MS = 600;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function heatRgb(h: number): RGB {
  const t = clamp01(h);
  for (let i = 1; i < STOPS.length; i += 1) {
    const [p1, c1] = STOPS[i];
    if (t <= p1) {
      const [p0, c0] = STOPS[i - 1];
      const k = (t - p0) / (p1 - p0);
      return [0, 1, 2].map((j) => Math.round(c0[j] + (c1[j] - c0[j]) * k)) as RGB;
    }
  }
  return STOPS[STOPS.length - 1][1];
}
export function heatColor(h: number): string {
  const [r, g, b] = heatRgb(h);
  return `rgb(${r} ${g} ${b})`;
}
export function heatWeight(h: number): number {
  return Math.round(400 + clamp01(h) * 500);
}
export function coolDown(h: number, dtMs: number): number {
  const next = h * Math.pow(0.5, dtMs / HALF_LIFE_MS);
  return next < 0.01 ? 0 : next;
}
```

- [ ] **Step 4:** Run `npm test`. Expected: the heat tests PASS.
- [ ] **Step 5:** Commit with `feat: heat maths`.

### Task 2: Game rules

**Files:**
- Create: `lib/forge-game.ts`
- Test: `tests/forge-game.test.ts`

**Interfaces:**
- Produces: `ROUNDS`, `type Piece`, `type Zone = "perfect" | "good" | "crack"`, `type GameState`, `DURATION_MS = 30000`, `COOLDOWN_MS = 350`, `createGame(): GameState`, `startGame(): GameState`, `advance(s, dtMs): GameState`, `needleAt(s): number`, `zoneAt(p, round): Zone`, `strike(s): GameState`, `rankFor(score): Rank`.
- Game time is internal (`s.clockMs`). The component passes only active-time deltas, which is how pausing works.

- [ ] **Step 1: Write the failing test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  advance, COOLDOWN_MS, createGame, DURATION_MS, needleAt, rankFor, startGame, strike, zoneAt,
} from "../lib/forge-game.ts";

// needle reaches 0.5 at a quarter period: period(r) = 1600 * 0.86^r
const quarter = (r: number) => (1600 * Math.pow(0.86, r)) / 4;

test("zones narrow each round", () => {
  assert.equal(zoneAt(0.5, 0), "perfect");
  assert.equal(zoneAt(0.55, 0), "perfect");
  assert.equal(zoneAt(0.56, 0), "good");
  assert.equal(zoneAt(0.65, 0), "good");
  assert.equal(zoneAt(0.66, 0), "crack");
  assert.equal(zoneAt(0.53, 4), "good");
});

test("needle is a triangle wave starting cold", () => {
  const s = startGame();
  assert.equal(needleAt(s), 0);
  assert.ok(Math.abs(needleAt(advance(s, quarter(0))) - 0.5) < 1e-9);
  assert.ok(Math.abs(needleAt(advance(s, quarter(0) * 2)) - 1) < 1e-9);
});

test("perfect strike forges, scores 300 x combo, and advances", () => {
  let s = advance(startGame(), quarter(0));
  s = strike(s);
  assert.equal(s.lastZone, "perfect");
  assert.deepEqual(s.forged, ["WEB"]);
  assert.equal(s.combo, 1);
  assert.equal(s.score, 300);
  assert.equal(s.round, 1);
});

test("crack resets combo and repeats the round", () => {
  let s = startGame();
  s = strike(s); // needle at 0 → crack
  assert.equal(s.lastZone, "crack");
  assert.equal(s.combo, 0);
  assert.equal(s.round, 0);
  assert.deepEqual(s.forged, []);
});

test("strikes during cooldown are ignored", () => {
  let s = strike(startGame());
  const again = strike(advance(s, COOLDOWN_MS - 1));
  assert.equal(again.strikes, 1);
  s = advance(s, COOLDOWN_MS);
  assert.equal(s.phase, "playing");
});

test("five perfect strikes finish with combo scoring and a time bonus", () => {
  let s = startGame();
  for (let r = 0; r < 5; r += 1) {
    s = advance(s, COOLDOWN_MS * (r === 0 ? 0 : 1));
    s = advance(s, quarter(r));
    s = strike(s);
  }
  assert.equal(s.phase, "finished");
  assert.equal(s.forged.length, 5);
  assert.equal(s.bestCombo, 5);
  const base = 300 * (1 + 2 + 3 + 4 + 5);
  assert.equal(s.timeBonus, Math.floor((DURATION_MS - s.clockMs) / 1000) * 50);
  assert.equal(s.score, base + s.timeBonus);
});

test("timer ends the game without a bonus", () => {
  const s = advance(startGame(), DURATION_MS);
  assert.equal(s.phase, "finished");
  assert.equal(s.timeBonus, 0);
  assert.equal(s.remainingMs, 0);
});

test("idle and finished games ignore input and time", () => {
  const idle = createGame();
  assert.equal(strike(idle), idle);
  assert.equal(advance(idle, 1000), idle);
});

test("ranks", () => {
  assert.equal(rankFor(0), "Apprentice");
  assert.equal(rankFor(1200), "Smith");
  assert.equal(rankFor(2800), "Master Smith");
  assert.equal(rankFor(4500), "Forge Legend");
});
```

- [ ] **Step 2:** Run `npm test`. Expected: FAIL, the module is missing.
- [ ] **Step 3: Implement** (full code)

```ts
export const ROUNDS = ["WEB", "APP", "AUTOMATION", "DATA", "CLOUD"] as const;
export type Piece = (typeof ROUNDS)[number];
export type Zone = "perfect" | "good" | "crack";
export type Phase = "idle" | "playing" | "striking" | "finished";
export type Rank = "Apprentice" | "Smith" | "Master Smith" | "Forge Legend";

export const DURATION_MS = 30_000;
export const COOLDOWN_MS = 350;
const BASE_PERIOD_MS = 1600;
const SPEEDUP = 0.86;
const POINTS: Record<Exclude<Zone, "crack">, number> = { perfect: 300, good: 100 };

export type GameState = {
  phase: Phase; clockMs: number; round: number; roundStartMs: number;
  forged: Piece[]; score: number; combo: number; bestCombo: number;
  strikes: number; lastStrikeMs: number; lastZone: Zone | null;
  remainingMs: number; timeBonus: number;
};

export function createGame(): GameState {
  return { phase: "idle", clockMs: 0, round: 0, roundStartMs: 0, forged: [], score: 0,
    combo: 0, bestCombo: 0, strikes: 0, lastStrikeMs: -Infinity, lastZone: null,
    remainingMs: DURATION_MS, timeBonus: 0 };
}
export function startGame(): GameState {
  return { ...createGame(), phase: "playing" };
}
export function periodFor(round: number): number {
  return BASE_PERIOD_MS * Math.pow(SPEEDUP, round);
}
export function needleAt(s: GameState): number {
  const t = Math.max(0, s.clockMs - s.roundStartMs);
  const x = (t % periodFor(s.round)) / periodFor(s.round);
  return x < 0.5 ? x * 2 : 2 - x * 2;
}
export function zoneAt(p: number, round: number): Zone {
  const d = Math.abs(p - 0.5);
  const hot = 0.05 - 0.006 * round;
  if (d <= hot + 1e-9) return "perfect";
  if (d <= hot + 0.1 + 1e-9) return "good";
  return "crack";
}
export function advance(s: GameState, dtMs: number): GameState {
  if (s.phase === "idle" || s.phase === "finished") return s;
  const clockMs = s.clockMs + dtMs;
  if (clockMs >= DURATION_MS) {
    return { ...s, clockMs: DURATION_MS, remainingMs: 0, phase: "finished" };
  }
  const phase = s.phase === "striking" && clockMs - s.lastStrikeMs >= COOLDOWN_MS ? "playing" : s.phase;
  return { ...s, clockMs, phase, remainingMs: DURATION_MS - clockMs };
}
export function strike(s: GameState): GameState {
  if (s.phase !== "playing") return s;
  const zone = zoneAt(needleAt(s), s.round);
  const base = { ...s, strikes: s.strikes + 1, lastStrikeMs: s.clockMs, lastZone: zone,
    roundStartMs: s.clockMs + COOLDOWN_MS };
  if (zone === "crack") return { ...base, combo: 0, phase: "striking" };
  const combo = s.combo + 1;
  const forged = [...s.forged, ROUNDS[s.round]];
  const score = s.score + POINTS[zone] * combo;
  const next = { ...base, combo, bestCombo: Math.max(s.bestCombo, combo), forged, score, round: s.round + 1 };
  if (forged.length === ROUNDS.length) {
    const timeBonus = Math.floor((DURATION_MS - s.clockMs) / 1000) * 50;
    return { ...next, round: ROUNDS.length - 1, phase: "finished", timeBonus, score: score + timeBonus };
  }
  return { ...next, phase: "striking" };
}
export function rankFor(score: number): Rank {
  if (score >= 4500) return "Forge Legend";
  if (score >= 2800) return "Master Smith";
  if (score >= 1200) return "Smith";
  return "Apprentice";
}
```

- [ ] **Step 4:** Run `npm test`. Expected: all game tests PASS.
- [ ] **Step 5:** Commit with `feat: forge game rules`.

### Task 3: Site data, lowercase contacts and safe storage

**Files:**
- Modify: `lib/site.ts`. Lowercase emails, new nav ids (`services`, `forge`, `process`, `system`, `why`, `contact`), re-worded capabilities, process steps (`name`, `classic`, `copy`) and principles per the spec, and the `legal` block with `copyrightYear: 2026`.
- Create: `lib/storage.ts`, which exports `readStore(kind: "local" | "session", key: string): string | null` and `writeStore(kind, key, value): void`. Both use try/catch and are SSR-safe.
- Test: `tests/contacts.test.ts`

- [ ] **Step 1: Write the failing test.** It recursively reads every `.ts`/`.tsx` under `app/`, `components/` and `lib/`, and asserts that `/[A-Za-z0-9._-]+@visionforgestudio\.app/i` matches are all lowercase and every `mailto:` value is lowercase. It also asserts that `site.sales.href === "mailto:sales@visionforgestudio.app"` and that the source contains no `Ltd`.
- [ ] **Step 2:** Run it. Expected: FAIL on `sales@VisionForgeStudio.app`.
- [ ] **Step 3:** Update `site.ts` and `layout.tsx` JSON-LD (lowercase, `legalName: "Vision Forge"`).
- [ ] **Step 4:** Run it. Expected: PASS.
- [ ] **Step 5:** Commit with `feat: lowercase contacts, legal entity, new copy`.

### Task 4: Tokens, fonts and root layout

**Files:**
- Modify: `app/globals.css` (token table from the spec, `@theme inline` mapping to `--color-forge`, `--color-soot`, `--color-chrome`, `--color-ash`, `--color-ember`, `--color-molten`, `--color-whitehot`, `--font-display`, `--font-sans` and `--font-mono`; grain; focus; reduced-motion rules; legal print styles).
- Modify: `app/layout.tsx` (fonts `Big_Shoulders_Display` with `axes`/variable weight, `Instrument_Sans`, `Martian_Mono`; mount `SparksProvider`, `Ignition`, `Navbar` and `Footer`; `themeColor: "#0B0907"`).

- [ ] **Step 1:** Check the font import names against `node_modules/next/dist/compiled/@next/font/dist/google/index.d.ts`.
- [ ] **Step 2:** Write the CSS and layout.
- [ ] **Step 3:** Run `npx next build`. Expected: compiles.
- [ ] **Step 4:** Commit with `feat: forge tokens and fonts`.

### Task 5: Shared forge systems

**Files:**
- Create: `components/forge/SparkField.tsx`. It exports `SparksProvider` and `useSparks(): { emit(o: { x: number; y: number; count?: number; power?: number; palette?: "hot" | "dust" }): void }`. It uses one fixed canvas with a rAF loop that runs only while particles exist and the document is visible, a 400-particle cap (150 on coarse pointers with ≤ 4 cores), DPR capped at 1.25 for coarse pointers and 1.75 otherwise, and a no-op under reduced motion. `Math.random` runs only inside `emit`.
- Create: `components/forge/useHeat.ts`, which exports `usePointerHeat()`: a shared, rAF-batched pointer position store with `subscribe` (a module singleton).
- Create: `components/forge/HeatText.tsx`. Props: `{ lines: string[]; as?: "h1" | "h2"; className?: string }`. It renders `sr-only` full text plus `aria-hidden` letter spans. A single rAF loop computes per-letter heat from the pointer distance (radius 220px) and applies `coolDown`, then writes `style.color = heatColor(h)` and `fontVariationSettings = 'wght' ${heatWeight(h)}`. It stays static on coarse pointers and under reduced motion.
- Create: `components/forge/Ignition.tsx`. On a first session visit only (via `readStore("session","vf-ignited")`) it shows a 1.2s overlay: ember dot → flash → logo → fade. A tap or key skips it, and it is skipped under reduced motion.

- [ ] **Step 1:** Implement the four files.
- [ ] **Step 2:** Run `npx next build` and `npx eslint`. Expected: clean.
- [ ] **Step 3:** Commit with `feat: spark field, heat text, ignition`.

### Task 6: UI primitives and navigation

**Files:**
- Modify: `components/ui/Logo.tsx` (unchanged API), `components/ui/CtaLink.tsx` (molten/ghost variants, heat glow on hover/focus).
- Create: `components/ui/Label.tsx` (mono kicker), `components/ui/SectionHeading.tsx` (`HeatText` h2 + kicker + optional lede), and `components/ui/EmailLink.tsx` (props `{ address: string; size?: "lg" | "sm" }`. It renders `<a href={"mailto:" + address.toLowerCase()}>` with the steam-puff class).
- Modify: `components/layout/Navbar.tsx`. Keep the focus trap, Escape, scroll lock and `aria-label="Vision Forge Studio, home"`. Use the new ids and links prefixed with `/` (`/#services`), the transparent-to-blur header and a heated active underline.

- [ ] **Step 1:** Implement.
- [ ] **Step 2:** Build and lint.
- [ ] **Step 3:** Commit with `feat: forge ui primitives and nav`.

### Task 7: Game UI

**Files:**
- Create: `components/game/clang.ts`. It exports `createClang(): { play(combo: number): void; close(): void } | null`, which returns null without `AudioContext`.
- Create: `components/game/GameHud.tsx`. Props: `{ score: number; combo: number; remainingMs: number; forged: readonly string[] }`.
- Create: `components/game/ResultCard.tsx`. Props: `{ state: GameState; best: number | null; onReplay(): void }`. It uses the copy from the spec, `rankFor`, `EmailLink` for sales and a WhatsApp link.
- Create: `components/game/StrikeGame.tsx`. It holds a `GameState` in a ref plus a rendered snapshot (throttled). The rAF loop calls `advance(dt)` only while it is intersecting and visible, and draws the anvil, billet (`heatColor(needle)`), hammer arc and heat bar with the needle on a local canvas. Pointer down or Space/Enter calls `strike`, and the outcome triggers `useSparks().emit`, shake, the stamp text and the `aria-live` announcement. The best score is kept via `readStore`/`writeStore("local","vf-best")`. There is a sound toggle, and the needle is quantised to 20 steps under reduced motion.
- Create: `components/sections/Strike.tsx` (`id="forge"`, heading, rules text, `<noscript>` note, `StrikeGame`).

- [ ] **Step 1:** Implement.
- [ ] **Step 2:** Build and lint. Then play-test in Playwright: press Space 5+ times, and expect the finished card.
- [ ] **Step 3:** Commit with `feat: strike while it's hot game`.

### Task 8: Homepage sections

**Files:**
- Create: `components/sections/Furnace.tsx`, `RawMaterials.tsx`, `Process.tsx`, `ConnectedSystem.tsx`, `Hallmarks.tsx`, `Quench.tsx`, and `components/visuals/Billet.tsx` (5 SVG paths keyed by stage, morphed with Motion).
- Modify: `components/visuals/ArchitectureDiagram.tsx` (restyle only: `TAP_PROMPT`, `connectionStatus` and the `aria-live` region keep their current behaviour).
- Modify: `app/page.tsx` (new order).
- Delete: the replaced sections and `ui` files listed in the spec.

- [ ] **Step 1:** Implement each section as the spec describes.
- [ ] **Step 2:** Run `npm test`. The connection-status tests must still pass.
- [ ] **Step 3:** Build and lint.
- [ ] **Step 4:** Commit with `feat: living forge homepage`.

### Task 9: Legal pages, footer and sitemap

**Files:**
- Create: `components/layout/LegalLayout.tsx`. Props: `{ title: string; intro: string; sections: { id: string; heading: string; body: ReactNode }[] }`. It renders the TOC, the last-updated date from `site.legal.lastUpdated` and the not-legal-advice note.
- Create: `app/terms/page.tsx`, `app/privacy/page.tsx`, `app/disclaimer/page.tsx` and `app/cookies/page.tsx`, with generic copy per the spec and per-page `metadata`.
- Modify: `components/layout/Footer.tsx` (4 columns plus a bottom bar with the registration line and back-to-top) and `app/sitemap.ts` (adds 4 routes).
- Test: `tests/legal.test.ts`. The four files exist and each mentions Belize, the footer source links `/terms`, `/privacy`, `/disclaimer` and `/cookies`, the sitemap lists them, and the footer contains `000058528`.

- [ ] **Step 1:** Write the test. Expected: FAIL.
- [ ] **Step 2:** Implement.
- [ ] **Step 3:** Run the tests. Expected: PASS.
- [ ] **Step 4:** Commit with `feat: legal pages and footer`.

### Task 10: Update logo test, verify, deliver

- [ ] **Step 1:** Rewrite `tests/logo-assets.test.ts`. Hash-compare `public/brand/vision-forge-logo.png`, `app/icon.png` and `app/apple-icon.png` with each other (the old test pointed at a Cursor cache path on Windows, which fails anywhere else). Keep the size, no-JPG and Logo assertions. Assert `Furnace.tsx` renders `<Logo` with `priority` and that the navbar keeps the aria-label and the layout references the PNG.
- [ ] **Step 2:** Run `npm test`, `npx eslint` and `npx next build`. Expected: all green.
- [ ] **Step 3:** Run `next start` and take Playwright screenshots at 390×844 and 1440×900 of every section, the game finished state and `/privacy`. Check that there is no horizontal scroll (`scrollWidth <= innerWidth`), that keyboard play works, and that reduced-motion emulation is handled.
- [ ] **Step 4:** Copy the changed files to the user's folder, sending deletions as a list for the user to confirm.
