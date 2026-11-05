# How we work: scroll-driven visual — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a scroll-driven picture to the seven "How we work" steps on the homepage (compact) and `/how-we-work` (full), showing a business's tools going from scattered to connected and live.

**Architecture:** `lib/process.ts` is pure data: the picture for each step (tile positions, flags, hub state) in a wide and a narrow shape. `ProcessScene` renders one frame from that data with CSS transitions. `ProcessScroll` (client) lists the steps, tracks the step crossing the middle of the viewport with one `IntersectionObserver`, pins the picture on desktop and gives each step a still picture on phones.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, lucide-react, `node --test` with `--experimental-strip-types`.

**Spec:** `docs/superpowers/specs/2026-11-04-how-we-work-visual-design.md`

## Global Constraints

- No copy changes: step titles and descriptions come from `howWeWorkSteps` in `lib/site.ts`. The only new word is the "Live" badge.
- No new dependencies.
- `lib/process.ts` must load under `node --test` on its own: type-only import from `./hub`.
- Picture is decorative (`aria-hidden`); the `<ol>` of steps carries the meaning.
- `prefers-reduced-motion: reduce` → no transitions (`motion-reduce:transition-none`).
- Text keeps 4.5:1 contrast (`tests/design.test.ts`).
- The user handles git in Cursor: write files to the working folder; do not commit or push.

---

### Task 1: Scene data (`lib/process.ts`)

**Files:**
- Create: `lib/process.ts`
- Test: `tests/process.test.ts`

**Interfaces:**
- Consumes: `HubTool` type and `HUB_TOOLS` from `lib/hub.ts`.
- Produces: `PROCESS_STEP_COUNT = 7`; `clampStep(step: number): number`; `type SceneShape = "wide" | "narrow"`; `flowPairs(shape?: SceneShape): ReadonlyArray<readonly [number, number]>`; `processScene(step: number, tools: readonly HubTool[], shape?: SceneShape): ProcessScene` where `ProcessScene = { step, tiles: SceneTile[], hub: "none" | "outline" | "solid", lines: "none" | "flow" | "connected", blueprint, live, chart, icon: "chat" | "plan" | "loop" | null }` and `SceneTile = { id, label, x, y, rotate, flagged, checked }`.

- [ ] **Step 1: Write the failing test** — `tests/process.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { HUB_TOOLS } from "../lib/hub.ts";
import { PROCESS_STEP_COUNT, clampStep, flowPairs, processScene } from "../lib/process.ts";

const scenes = Array.from({ length: PROCESS_STEP_COUNT }, (_, i) => processScene(i, HUB_TOOLS));

test("one picture per step, each with every hub tool in order", () => {
  assert.equal(PROCESS_STEP_COUNT, 7);
  for (const [i, scene] of scenes.entries()) {
    assert.equal(scene.step, i);
    assert.deepEqual(
      scene.tiles.map((t) => t.id),
      HUB_TOOLS.map((t) => t.id),
    );
    assert.deepEqual(
      scene.tiles.map((t) => t.label),
      HUB_TOOLS.map((t) => t.label),
    );
  }
});

const narrow = Array.from({ length: PROCESS_STEP_COUNT }, (_, i) => processScene(i, HUB_TOOLS, "narrow"));

test("tiles stay inside the panel, wide and narrow", () => {
  for (const scene of [...scenes, ...narrow]) {
    for (const t of scene.tiles) {
      assert.ok(t.x >= 8 && t.x <= 92, `${scene.step} ${t.id} x=${t.x}`);
      assert.ok(t.y >= 8 && t.y <= 92, `${scene.step} ${t.id} y=${t.y}`);
    }
  }
});

test("1 Discover: scattered and tilted, no hub, a chat icon", () => {
  const s = scenes[0];
  assert.equal(s.hub, "none");
  assert.equal(s.lines, "none");
  assert.equal(s.icon, "chat");
  assert.ok(s.tiles.some((t) => t.rotate !== 0));
});

test("2 Map: dashed flows, and only the bottleneck tools are flagged", () => {
  assert.equal(scenes[1].lines, "flow");
  assert.equal(scenes[1].hub, "none");
  assert.deepEqual(
    scenes[1].tiles.filter((t) => t.flagged).map((t) => t.id),
    HUB_TOOLS.filter((t) => t.bottleneck).map((t) => t.id),
  );
  for (const [i, scene] of scenes.entries()) {
    if (i !== 1) assert.ok(scene.tiles.every((t) => !t.flagged), `step ${i}`);
  }
});

test("3 Design: a blueprint with an outlined hub and the plan icon", () => {
  const s = scenes[2];
  assert.equal(s.blueprint, true);
  assert.equal(s.hub, "outline");
  assert.equal(s.icon, "plan");
  assert.ok(scenes.every((scene, i) => scene.blueprint === (i === 2)));
});

test("4 onward: solid hub, every tool connected; the hub area stays clear", () => {
  for (const scene of scenes.slice(3)) {
    assert.equal(scene.hub, "solid");
    assert.equal(scene.lines, "connected");
  }
  for (const scene of [...scenes.slice(2), ...narrow.slice(2)]) {
    for (const t of scene.tiles) assert.ok(Math.abs(t.x - 50) > 20 || Math.abs(t.y - 50) > 20, `${scene.step} ${t.id}`);
  }
});

test("5 Test adds checks, 6 Deploy goes live, 7 Improve adds the chart and loop", () => {
  scenes.forEach((s, i) => {
    assert.equal(s.tiles.every((t) => t.checked), i >= 4, `checks at ${i}`);
    assert.equal(s.tiles.some((t) => t.checked), i >= 4, `checks at ${i}`);
    assert.equal(s.live, i >= 5, `live at ${i}`);
    assert.equal(s.chart, i === 6, `chart at ${i}`);
  });
  assert.equal(scenes[6].icon, "loop");
  assert.equal(scenes[3].icon, null);
});

test("out-of-range steps clamp", () => {
  assert.equal(clampStep(-3), 0);
  assert.equal(clampStep(99), 6);
  assert.equal(clampStep(Number.NaN), 0);
  assert.equal(clampStep(2.7), 2);
  assert.deepEqual(processScene(42, HUB_TOOLS), scenes[6]);
});

test("narrow pictures tell the same story in two columns", () => {
  for (const [i, n] of narrow.entries()) {
    const { tiles: wt, ...wideRest } = scenes[i];
    const { tiles: nt, ...narrowRest } = n;
    assert.deepEqual(narrowRest, wideRest, `step ${i}`);
    const meaning = (t: (typeof nt)[number]) => ({ id: t.id, label: t.label, flagged: t.flagged, checked: t.checked });
    assert.deepEqual(nt.map(meaning), wt.map(meaning));
  }
  for (const n of narrow.slice(1)) assert.equal(new Set(n.tiles.map((t) => t.x)).size, 2, "two columns");
});

test("flow lines only join real tiles", () => {
  for (const shape of ["wide", "narrow"] as const) {
    for (const [a, b] of flowPairs(shape)) {
      assert.ok(a >= 0 && a < HUB_TOOLS.length && b >= 0 && b < HUB_TOOLS.length && a !== b);
    }
  }
});
```

- [ ] **Step 2: Run it and confirm it fails**

Run: `node --experimental-strip-types --test tests/process.test.ts`
Expected: FAIL with `ERR_MODULE_NOT_FOUND ... lib/process.ts`

- [ ] **Step 3: Implement** — `lib/process.ts`:

```ts
/**
 * Data for the "How we work" picture: what a business's tools look like at
 * each of the seven steps. Positions are percentages of the panel (tile centres).
 * Type-only import, so node --test can load this file on its own.
 */
import type { HubTool } from "./hub";

export const PROCESS_STEP_COUNT = 7;

export type SceneTile = {
  id: string;
  label: string;
  /** Centre of the tile, 0–100 across the panel. */
  x: number;
  /** Centre of the tile, 0–100 down the panel. */
  y: number;
  /** Degrees; only the first step tilts tiles. */
  rotate: number;
  /** Amber "slow spot" marker (Map step only). */
  flagged: boolean;
  /** Green check badge (Test step onward). */
  checked: boolean;
};

export type ProcessScene = {
  step: number;
  tiles: SceneTile[];
  hub: "none" | "outline" | "solid";
  lines: "none" | "flow" | "connected";
  /** Tiles drawn as dashed outlines (Design step). */
  blueprint: boolean;
  /** "Live" badge on the hub (Deploy onward). */
  live: boolean;
  /** Small rising chart beside Reports (Improve). */
  chart: boolean;
  icon: "chat" | "plan" | "loop" | null;
};

type Spot = readonly [x: number, y: number, rotate: number];

/** Step 1: loose and tilted, centre left clear for the chat icon. */
const SCATTER: readonly Spot[] = [
  [17, 17, -8],
  [46, 13, 6],
  [77, 20, -5],
  [85, 49, 9],
  [16, 54, 7],
  [38, 85, -6],
  [66, 82, 5],
  [86, 84, -9],
];

/** Step 2: two rows, so the flow between neighbours reads left to right. */
const GRID: readonly Spot[] = [
  [15, 32, 0],
  [38, 32, 0],
  [62, 32, 0],
  [85, 32, 0],
  [15, 70, 0],
  [38, 70, 0],
  [62, 70, 0],
  [85, 70, 0],
];

/** Steps 3–7: four tools either side of the hub. */
const AROUND_HUB: readonly Spot[] = [
  [16, 17, 0],
  [16, 39, 0],
  [16, 61, 0],
  [16, 83, 0],
  [84, 17, 0],
  [84, 39, 0],
  [84, 61, 0],
  [84, 83, 0],
];

/** Phone cards are narrow, so the same pictures use two columns. */
const SCATTER_NARROW: readonly Spot[] = [
  [27, 12, -8],
  [72, 16, 6],
  [23, 36, 5],
  [77, 40, -7],
  [27, 62, -5],
  [73, 64, 8],
  [25, 88, 6],
  [71, 86, -6],
];

const GRID_NARROW: readonly Spot[] = [
  [27, 13, 0],
  [73, 13, 0],
  [27, 38, 0],
  [73, 38, 0],
  [27, 62, 0],
  [73, 62, 0],
  [27, 87, 0],
  [73, 87, 0],
];

const AROUND_HUB_NARROW: readonly Spot[] = [
  [20, 14, 0],
  [20, 38, 0],
  [20, 62, 0],
  [20, 86, 0],
  [80, 14, 0],
  [80, 38, 0],
  [80, 62, 0],
  [80, 86, 0],
];

export type SceneShape = "wide" | "narrow";

const LAYOUTS: Record<SceneShape, readonly [readonly Spot[], readonly Spot[], readonly Spot[]]> = {
  wide: [SCATTER, GRID, AROUND_HUB],
  narrow: [SCATTER_NARROW, GRID_NARROW, AROUND_HUB_NARROW],
};

/** Which tiles the Map step joins with dashed "flow" lines (by index into the tool list). */
export function flowPairs(shape: SceneShape = "wide"): ReadonlyArray<readonly [number, number]> {
  return shape === "wide"
    ? [
        [0, 1],
        [1, 2],
        [2, 3],
        [4, 5],
        [5, 6],
        [6, 7],
      ]
    : [
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [0, 2],
        [2, 4],
        [4, 6],
      ];
}

export function clampStep(step: number): number {
  if (!Number.isFinite(step)) return 0;
  return Math.min(PROCESS_STEP_COUNT - 1, Math.max(0, Math.floor(step)));
}

const ICONS: Record<number, ProcessScene["icon"]> = { 0: "chat", 2: "plan", 6: "loop" };

/** The picture for one step (0 = Discover … 6 = Improve). */
export function processScene(rawStep: number, tools: readonly HubTool[], shape: SceneShape = "wide"): ProcessScene {
  const step = clampStep(rawStep);
  const [scatter, grid, aroundHub] = LAYOUTS[shape];
  const layout = step === 0 ? scatter : step === 1 ? grid : aroundHub;
  return {
    step,
    tiles: tools.map((tool, i) => {
      const [x, y, rotate] = layout[i % layout.length];
      return {
        id: tool.id,
        label: tool.label,
        x,
        y,
        rotate,
        flagged: step === 1 && tool.bottleneck,
        checked: step >= 4,
      };
    }),
    hub: step < 2 ? "none" : step === 2 ? "outline" : "solid",
    lines: step === 1 ? "flow" : step >= 3 ? "connected" : "none",
    blueprint: step === 2,
    live: step >= 5,
    chart: step === 6,
    icon: ICONS[step] ?? null,
  };
}
```

- [ ] **Step 4: Run the test again**

Run: `node --experimental-strip-types --test tests/process.test.ts`
Expected: `# pass 10`, `# fail 0`

### Task 2: One frame of the picture (`ProcessScene`)

**Files:**
- Create: `components/sections/process/ProcessScene.tsx`

**Interfaces:**
- Consumes: `processScene`, `flowPairs`, `SceneTile` (Task 1); `HUB_TOOLS`; `Logo`.
- Produces: `ProcessScene({ step: number; size?: "panel" | "card"; className?: string })`. `panel` = 4:3 wide picture; `card` = 300px-tall narrow picture for phones.

- [ ] **Step 1: Implement** — `components/sections/process/ProcessScene.tsx`:

```tsx
import { Check, Clock, FileText, MessageCircle, RefreshCw } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { HUB_TOOLS } from "@/lib/hub";
import { flowPairs, processScene, type SceneTile } from "@/lib/process";

/** App colours, matched to the hero's HubPanel. */
const DOT: Record<string, string> = {
  whatsapp: "#25b36a",
  website: "#0d63f3",
  forms: "#c2410c",
  bookings: "#7c3aed",
  sheets: "#16a37a",
  accounting: "#0d63f3",
  payments: "#16a37a",
  reports: "#e7b54a",
};

const MOVE = "transition-[left,top,transform,opacity,background-color,border-color,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none";
const FADE = "transition-opacity duration-500 motion-reduce:transition-none";

type Size = "panel" | "card";

function Tile({ tile, index, blueprint, size }: { tile: SceneTile; index: number; blueprint: boolean; size: Size }) {
  const small = size === "card";
  return (
    <div
      className={`absolute ${MOVE}`}
      style={{ left: `${tile.x}%`, top: `${tile.y}%`, transform: `translate(-50%, -50%) rotate(${tile.rotate}deg)` }}
    >
      <div
        className={`relative flex items-center gap-1.5 rounded-xl border whitespace-nowrap ${MOVE} ${
          small ? "px-2 py-1 text-[10px]" : "px-3 py-2 text-[12px]"
        } font-semibold ${
          blueprint
            ? "border-dashed border-gold/70 bg-transparent text-gold"
            : tile.flagged
              ? "border-[#f59e0b] bg-paper text-ink shadow-[0_0_0_3px_rgba(245,158,11,0.3)]"
              : "border-white/10 bg-paper text-ink shadow-[0_12px_28px_-18px_rgba(0,0,0,0.8)]"
        }`}
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${FADE} ${blueprint ? "opacity-0" : "opacity-100"}`} style={{ background: DOT[tile.id] ?? "#7fb0ff" }} />
        {tile.label}
        {tile.flagged ? (
          <span className={`flex items-center justify-center rounded-full bg-[#f59e0b] text-ink ${small ? "h-4 w-4" : "h-5 w-5"}`}>
            <Clock className={small ? "h-2.5 w-2.5" : "h-3 w-3"} strokeWidth={2.5} />
          </span>
        ) : null}
        <span
          className={`absolute -top-2 -right-2 flex items-center justify-center rounded-full bg-success text-paper ring-2 ring-ink ${FADE} ${
            small ? "h-4 w-4" : "h-5 w-5"
          } ${tile.checked ? "opacity-100" : "opacity-0"}`}
          style={{ transitionDelay: tile.checked ? `${index * 60}ms` : "0ms" }}
        >
          <Check className={small ? "h-2.5 w-2.5" : "h-3 w-3"} strokeWidth={3} />
        </span>
      </div>
    </div>
  );
}

/**
 * One frame of the "How we work" picture: the business's tools at a given step.
 * Decorative; the steps list beside it carries the meaning.
 */
export function ProcessScene({ step, size = "panel", className = "" }: { step: number; size?: Size; className?: string }) {
  const small = size === "card";
  const shape = small ? "narrow" : "wide";
  const scene = processScene(step, HUB_TOOLS, shape);
  const iconClass = small ? "h-5 w-5" : "h-7 w-7";

  return (
    <div aria-hidden className={`relative overflow-hidden rounded-[28px] bg-ink ${small ? "h-[300px]" : "aspect-[4/3]"} ${className}`}>
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div
        className={`pointer-events-none absolute top-1/2 left-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(13,99,243,0.3),transparent_65%)] ${FADE} ${
          scene.hub === "solid" ? "opacity-100" : "opacity-30"
        }`}
      />

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
        <g className={`${FADE} ${scene.lines === "flow" ? "opacity-100" : "opacity-0"}`}>
          {flowPairs(shape).map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={scene.tiles[a].x}
              y1={scene.tiles[a].y}
              x2={scene.tiles[b].x}
              y2={scene.tiles[b].y}
              stroke="rgba(255,255,255,0.35)"
              strokeWidth={1.5}
              strokeDasharray="4 5"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>
        <g className={`${FADE} ${scene.lines === "connected" ? "opacity-100" : "opacity-0"}`}>
          {scene.tiles.map((t) => (
            <line key={t.id} x1={t.x} y1={t.y} x2={50} y2={50} stroke="#7fb0ff" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          ))}
        </g>
      </svg>

      {/* Hub */}
      <div
        className={`absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[26px] border ${MOVE} ${
          small ? "h-20 w-20" : "h-[26%] w-auto aspect-square min-h-24"
        } ${
          scene.hub === "solid"
            ? "border-white/10 bg-[#0f1830] opacity-100 shadow-[0_0_0_8px_rgba(13,99,243,0.12),0_24px_50px_-20px_rgba(0,0,0,0.8)]"
            : scene.hub === "outline"
              ? "border-dashed border-gold/70 bg-transparent opacity-100"
              : "border-transparent opacity-0"
        }`}
      >
        <Logo decorative sizes="96px" className={`h-[62%] w-auto ${FADE} ${scene.hub === "solid" ? "opacity-100" : "opacity-0"}`} />
        <span
          className={`absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-paper px-2.5 py-0.5 text-[11px] font-semibold text-ink ${FADE} ${
            scene.live ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
          Live
        </span>
      </div>

      {/* Step icons */}
      <MessageCircle className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold ${iconClass} ${FADE} ${scene.icon === "chat" ? "opacity-100" : "opacity-0"}`} strokeWidth={1.75} />
      <FileText className={`absolute ${small ? "top-[74%]" : "top-[80%]"} left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold ${iconClass} ${FADE} ${scene.icon === "plan" ? "opacity-100" : "opacity-0"}`} strokeWidth={1.75} />
      <RefreshCw className={`absolute ${small ? "top-[24%]" : "top-[18%]"} left-1/2 -translate-x-1/2 -translate-y-1/2 text-gold ${iconClass} ${FADE} ${scene.icon === "loop" ? "opacity-100" : "opacity-0"}`} strokeWidth={1.75} />

      {/* Improve: a small chart beside Reports */}
      <div className={`absolute ${small ? "top-[86%] left-[52%]" : "top-[83%] left-[64%]"} flex -translate-x-1/2 -translate-y-1/2 items-end gap-1 ${FADE} ${scene.chart ? "opacity-100" : "opacity-0"}`}>
        {[35, 55, 70, 100].map((h, i) => (
          <span
            key={h}
            className={`w-2 origin-bottom rounded-sm ${i === 3 ? "bg-gold" : "bg-[#7fb0ff]/70"} transition-transform duration-500 motion-reduce:transition-none`}
            style={{ height: small ? `${h * 0.22}px` : `${h * 0.34}px`, transform: `scaleY(${scene.chart ? 1 : 0})`, transitionDelay: scene.chart ? `${i * 80}ms` : "0ms" }}
          />
        ))}
      </div>

      {scene.tiles.map((tile, i) => (
        <Tile key={tile.id} tile={tile} index={i} blueprint={scene.blueprint} size={size} />
      ))}

    </div>
  );
}
```

- [ ] **Step 2: Type-check** — Run: `npx next build` · Expected: "Finished TypeScript", no errors.

### Task 3: Scroll-driven steps (`ProcessScroll`) and wiring both pages

**Files:**
- Create: `components/sections/process/ProcessScroll.tsx`
- Modify: `components/sections/Stages.tsx` (homepage)
- Modify: `components/sections/ProcessSteps.tsx` (`/how-we-work`)
- Test: `tests/home.test.ts`, `tests/how-we-work.test.ts`

**Interfaces:**
- Consumes: `ProcessScene` (Task 2); `howWeWorkSteps`, `afterLaunch` from `lib/site.ts`.
- Produces: `ProcessScroll({ variant?: "compact" | "full" })`.

- [ ] **Step 1: Update the tests first.** In `tests/home.test.ts` replace the "how-we-work summary" test and add the picture test:

```ts
test("how-we-work summary uses the compact scroll-driven steps and links to the full page", () => {
  const src = read("components/sections/Stages.tsx");
  assert.match(src, /<ProcessScroll variant="compact" \/>/);
  assert.match(src, /href="\/how-we-work"/);
  const scroll = read("components/sections/process/ProcessScroll.tsx");
  assert.match(scroll, /<ol/);
  assert.match(scroll, /howWeWorkSteps\.map/);
  assert.match(scroll, /aria-current=\{isActive \? "step"/);
  assert.match(scroll, /IntersectionObserver/);
  assert.match(scroll, /lg:hidden/, "phones get a still picture per step");
  assert.match(scroll, /sticky/, "desktop pins the picture");
});

test("the process picture is decorative, eases between steps and respects reduced motion", () => {
  const scene = read("components/sections/process/ProcessScene.tsx");
  assert.match(scene, /aria-hidden className=\{`relative overflow-hidden/);
  assert.match(scene, /processScene\(step, HUB_TOOLS, shape\)/);
  assert.match(scene, /small \? "narrow" : "wide"/, "phone cards use the two-column pictures");
  assert.match(scene, /motion-reduce:transition-none/);
});
```

In `tests/how-we-work.test.ts`, the second test becomes:

```ts
test("the full scroll-driven steps, then training and support set apart as optional", () => {
  const steps = read("components/sections/ProcessSteps.tsx");
  assert.match(steps, /<ProcessScroll variant="full" \/>/);
  assert.match(steps, /afterLaunch\.title/);
  assert.match(steps, /<aside/);
});
```

- [ ] **Step 2: Run and confirm they fail** — Run: `npm test` · Expected: the three tests above FAIL (no `ProcessScroll` yet).

- [ ] **Step 3: Implement** — `components/sections/process/ProcessScroll.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { ProcessScene } from "@/components/sections/process/ProcessScene";
import { howWeWorkSteps } from "@/lib/site";

type Variant = "compact" | "full";

const STEP_HEIGHT: Record<Variant, string> = {
  compact: "lg:min-h-[38vh]",
  full: "lg:min-h-[56vh]",
};

/**
 * The seven steps with a picture that changes as you scroll.
 * Desktop: steps on the left, the picture pinned on the right; the step
 * crossing the middle of the screen is the active one.
 * Phones: each step carries its own still picture; nothing is pinned.
 */
export function ProcessScroll({ variant = "compact" }: { variant?: Variant }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const total = howWeWorkSteps.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step ?? 0));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of stepRefs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
      <ol className="relative flex flex-col gap-10 lg:gap-0">
        {/* Progress rail (desktop) */}
        <span aria-hidden className="absolute top-5 bottom-5 left-5 hidden w-px bg-line lg:block" />
        <span
          aria-hidden
          className="absolute top-5 left-5 hidden w-px bg-brand transition-[height] duration-500 motion-reduce:transition-none lg:block"
          style={{ height: `calc((100% - 2.5rem) * ${active / Math.max(1, total - 1)})` }}
        />
        {howWeWorkSteps.map((step, index) => {
          const isActive = index === active;
          return (
            <li
              key={step.title}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              data-step={index}
              aria-current={isActive ? "step" : undefined}
              className={`relative flex flex-col lg:justify-center ${STEP_HEIGHT[variant]}`}
            >
              <div className="flex gap-5">
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-[16px] font-semibold tabular-nums transition-colors duration-300 motion-reduce:transition-none ${
                    isActive ? "bg-brand text-paper" : "bg-mist text-muted"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="pt-1.5">
                  <h3
                    className={`font-display leading-snug font-semibold tracking-[-0.02em] text-ink ${
                      variant === "full" ? "text-[1.5rem] md:text-[1.75rem]" : "text-[1.25rem] md:text-[1.375rem]"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[44ch] text-[16px] leading-relaxed text-body">{step.copy}</p>
                </div>
              </div>
              <ProcessScene step={index} size="card" className="mt-5 lg:hidden" />
            </li>
          );
        })}
      </ol>

      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--nav-h)+2.5rem)]">
          <ProcessScene step={active} size="panel" />
          <p aria-hidden className="mt-4 font-mono text-[12px] tracking-[0.04em] text-muted uppercase">
            {active + 1} / {total} · {howWeWorkSteps[active].title}
          </p>
        </div>
      </div>
    </div>
  );
}
```

`components/sections/Stages.tsx`:

```tsx
import { ProcessScroll } from "@/components/sections/process/ProcessScroll";
import { CtaLink } from "@/components/ui/CtaLink";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Home-page summary of how a project runs, with the scroll-driven picture. */
export function Stages() {
  return (
    <section aria-labelledby="stages-title" className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          id="stages-title"
          eyebrow="Process"
          title="How we work"
          lede="Every project follows the same path, from understanding your business to improving what we've built."
        />
        <ProcessScroll variant="compact" />
        <div className="mt-10">
          <CtaLink href="/how-we-work" variant="link">
            See each step in detail →
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
```

`components/sections/ProcessSteps.tsx`:

```tsx
import { ProcessScroll } from "@/components/sections/process/ProcessScroll";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { afterLaunch } from "@/lib/site";

/** The full "How we work" walkthrough: the scroll-driven steps, then optional training and support. */
export function ProcessSteps() {
  return (
    <section aria-labelledby="steps-title" className="px-5 py-20 sm:px-8 md:py-28">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading id="steps-title" eyebrow="Process" title="From first conversation to continuous improvement" />
        <ProcessScroll variant="full" />
        <aside aria-labelledby="after-launch-title" className="mt-16 rounded-[24px] border border-dashed border-line bg-mist p-7 md:p-9">
          <h3 id="after-launch-title" className="font-display text-[1.375rem] font-semibold tracking-[-0.02em] text-ink">
            {afterLaunch.title}
          </h3>
          <p className="mt-2 max-w-[62ch] text-body">{afterLaunch.copy}</p>
        </aside>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run everything** — Run: `npm test && npx eslint app components lib tests && npx next build` · Expected: all tests pass, no lint problems, build succeeds.

- [ ] **Step 5: Check it by eye** (`npm run dev`):
  - Desktop, homepage and `/how-we-work`: scroll the steps; the picture changes at each step, the rail fills, the label reads "n / 7 · title".
  - Phone width (390px): each step shows its own picture; no overlapping tiles.
  - OS "reduce motion" on: pictures swap with no animation.
