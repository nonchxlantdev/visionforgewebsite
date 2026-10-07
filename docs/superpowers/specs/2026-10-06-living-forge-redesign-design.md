# Living Forge: full redesign of visionforgestudio.app

Date: 6 October 2026
Status: approved in brainstorming, awaiting spec review
Supersedes: `2026-10-06-hero-logo-and-tap-prompt-design.md`. The tap prompt behaviour carries over. The hero logo placement is replaced.

## Purpose

The current site uses the generic "technical studio" look: cool near-black, mono `01 / LABEL` tags, hairline grids, a cyan bar canvas, and the same header-then-grid rhythm six times. It doesn't match the logo, which is loud and physical (eye, anvil, hammer, sparks, chrome and gold).

The redesign turns the site into a working forge. It should feel alive and catch attention, it must not read as AI-templated, it includes a playable mini-game, it shows every email in lowercase as a clickable `mailto:` link, and it adds legal pages and a footer that fit Belize law.

## Principles

1. **Temperature is the interface.** At rest everything is cold chrome. Hover, focus, touch, scroll-into-view and game strikes heat elements along one ramp (ember, then gold, then white-hot), and they cool back down. Heat always means "active", so it is never decoration.
2. **No repeated pattern.** Each homepage section uses a different interaction model.
3. **Facts stay the same, voice changes.** Every service, process step, contact detail and claim from `lib/site.ts` is kept. Only the wording and headlines change. Nothing new is invented, so there are no fake testimonials or projects.
4. **Fast on mid-range phones.** No new runtime libraries. One shared canvas. Effects are transforms, opacity and canvas only.

## Visual system

### Colour tokens (`app/globals.css`, `:root`)

| Token | Value | Use |
|---|---|---|
| `--forge` | `#0B0907` | page background (warm black) |
| `--soot` | `#1A1613` | raised panels, game stage |
| `--soot-line` | `rgb(230 228 223 / 0.12)` | dividers |
| `--chrome` | `#E6E4DF` | primary text, cold headline top |
| `--chrome-deep` | `#8C9097` | cold headline gradient bottom |
| `--ash` | `#A39C93` | secondary text (≥ 4.5:1 on `--forge`) |
| `--ember` | `#FF5A1F` | heat stop 1 |
| `--molten` | `#F2B33D` | heat stop 2, primary CTA fill |
| `--whitehot` | `#FFF4D6` | heat stop 3 |
| `--on-molten` | `#1C1206` | text on molten |

The cyan token is removed. The site stays dark-only (`color-scheme: dark`), the same as now.

### Type (`next/font/google`, self-hosted)

- **Big Shoulders Display**, variable weight 100–900, for display and headlines. It is uppercase, condensed and set tight. Its weight responds to heat.
- **Instrument Sans** for body text. 16px minimum on mobile, line-height 1.6.
- **Martian Mono** for labels, numerals, the game HUD and email addresses.

Geist and Geist Mono are removed.

### Heat ramp (`lib/heat.ts`, pure)

- `heatColor(h: number): string`, where `h` is clamped to [0, 1]. It interpolates `--chrome` (0), `--ember` (0.35), `--molten` (0.7) and `--whitehot` (1) in sRGB.
- `heatWeight(h: number): number` maps linearly from 400 at `h = 0` to 900 at `h = 1`, rounded to an integer.
- `coolDown(h: number, dtMs: number): number` decays exponentially with a 600 ms half-life. It returns 0 once below 0.01.

### Texture and atmosphere

- The grain overlay is kept (`public/textures/grain.png`), with the opacity raised to 0.06 and blend `overlay`.
- A heat shimmer appears only on elements with `h > 0.6`. It is a CSS `filter: url(#shimmer)` SVG turbulence, disabled under reduced motion and on coarse pointers.
- The faint radial glow behind the hero follows pointer heat.

### Accessibility baseline

- Text contrast is at least 4.5:1, and large display text at least 3:1.
- `:focus-visible` gives the focused element `h = 1` (white-hot outline glow, 2px `--molten` outline, offset 3px).
- Touch targets are at least 44×44px.
- `prefers-reduced-motion: reduce` shows final states with no sparks, shimmer, shake, pinned scroll scrubbing or ignition. The game needle moves in discrete steps.
- The skip link, landmarks and nav focus trap from the current site are kept.

## Shared forge systems (`components/forge/`)

- **`SparkField`**: one fixed, full-viewport, `pointer-events: none` canvas mounted once in the root layout. It exposes `emitSparks({ x, y, count, power, palette })` through a small React context (`useSparks()`). Particles have gravity, drag and a short life (≤ 900 ms). The loop runs only while particles are alive and the tab is visible, with at most 400 particles. DPR is capped at 1.25 on coarse pointers and 1.75 otherwise. It is a no-op under reduced motion.
- **`useHeat(ref)`**: tracks the pointer distance to an element and returns a heat value fed through `coolDown`. It uses one shared `pointermove` listener with rAF batching. On coarse pointers, heat comes from touch and scroll-into-view instead.
- **`HeatText`**: splits a headline into per-letter spans (`aria-hidden`), with the full string kept in an `sr-only` span. Each letter's heat depends on its distance from the pointer and sets `color` and `font-variation-settings: "wght"`. On coarse pointers or with reduced motion it renders statically with a chrome gradient.
- **`Ignition`**: a first-visit intro overlay (≤ 1.2 s). An ember appears, a hammer-flash, the logo shows, then a fade. It is skipped when `sessionStorage` has `vf-ignited` (read in try/catch), under reduced motion, or on any tap or key. It never blocks the LCP element: the hero renders underneath.

## Homepage sections (`app/page.tsx`, in order)

Anchor IDs: `home`, `services`, `forge`, `process`, `system`, `why`, `contact`.

### 1. Furnace (`#home`)
- Full viewport height minus the nav. The headline is `HeatText` as `h1`: **WE FORGE / SOFTWARE / THAT WORKS.**
- Sub-copy: "Websites, custom applications, automation, data and cloud systems, hammered into shape around how your business actually runs. Built in Belize."
- CTAs: **Start a project** (molten fill, links to `#contact`) and **Strike the anvil** (ghost, links to `#forge`).
- WhatsApp and Call pills stay, with the same numbers and links.
- The logo (`Logo`, priority) sits large on the right on ≥ lg, above the headline on mobile. It has a slow breathing ember glow behind it (CSS radial, 6 s ease-in-out).
- Clicking or tapping empty hero space calls `emitSparks` at that point.

### 2. Raw Materials (`#services`)
- Heading: **SIX METALS. ONE FORGE.**
- The six capabilities from `site.ts` render as horizontal "ingots", each a chrome bar with its index, title and copy.
- On ≥ lg the section is pinned. Vertical scroll drives horizontal translation via Motion `useScroll` + `useTransform`. The ingot nearest centre gets `h = 1` and reveals its copy and layer meta.
- Below lg it becomes a native horizontal scroll-snap row. An ingot heats when 60% visible (IntersectionObserver).
- Under reduced motion it becomes a static vertical list, with all ingots at mid heat.

### 3. Strike While It's Hot (`#forge`)
The game. See "Mini-game" below.

### 4. The Process (`#process`)
- Heading: **HEAT. SHAPE. STRIKE. TEMPER. SHIP.**
- Mapping (the original copy meaning is kept):
  - Heat = Discover: "We learn your goals, constraints and how work really flows."
  - Shape = Architect: "We design the right structure and technology before a line is written."
  - Strike = Build: "We develop, integrate, test and refine."
  - Temper = Deploy: "We harden, secure and launch it for real-world use."
  - Ship = Evolve: "We stay on. Support, improvements and scale as you grow."
- On ≥ md the section is pinned for 5 steps. An SVG billet morphs (path interpolation over 5 keyframes) from a rough bar to a finished blade. A vertical thermometer drops from white-hot to chrome, and the active step's text slides in.
- On mobile and with reduced motion it is a vertical list. Each step has a small static billet stage icon.

### 5. One Connected System (`#system`): "weld the chain"
- Heading: **NOT JUST A WEBSITE. ONE CONNECTED SYSTEM.** Prompt: `WELD_PROMPT` = "TAP THE PARTS TO WELD YOUR SYSTEM TOGETHER."
- Visitors tap the six parts in any order. Each tap welds a molten seam from the previous part to the new one. When all six are welded, the chain closes back to the first part, every seam glows white-hot with sparks running along it, and the status reads "SYSTEM ONLINE · 6/6 WELDED". A Reset / Weld again button clears it.
- Rules live in `lib/connection-status.ts` (pure, tested): `weld`, `seams`, `isOnline` and `weldStatus`.
- Lines are drawn in pixel space from each box's measured centre (ResizeObserver), so they always meet the boxes exactly. One layout serves all widths: a staggered 3-column board on md+ and a 2-column board on phones. The boxes are opaque and sit above the lines.
- Accessibility: real buttons with `aria-pressed`, a polite live status, and a reduced-motion mode with no draw-in or travelling sparks.

### 6. Hallmarks (`#why`)
- Heading: **STAMPED ON EVERYTHING WE MAKE.**
- The five principles from `site.ts` render as maker's marks (an outlined stamp with lead and support text) on a brushed-steel plate.
- Each stamps in on scroll: scale 1.15 → 1, opacity 0 → 1, 120 ms, staggered 90 ms. On landing: a 2px plate shake (skipped under reduced motion) and a small spark emit.

### 7. Quench (`#contact`)
- Heading: **HAVE AN IDEA? LET'S FORGE IT.**
- Both emails render large in Martian Mono, lowercase, as `<a href="mailto:…">`:
  - `sales@visionforgestudio.app`
  - `support@visionforgestudio.app`
- Hover and focus heat the email and play a steam puff: CSS pseudo-element wisps rising for 600 ms. On coarse pointers the puff plays on tap, before the link opens.
- WhatsApp (`https://wa.me/5016157575`, opens in a new tab with `noopener noreferrer`) and Call (`tel:+5016139219`) rows sit alongside, with the existing display strings.
- The primary CTA **Start a project** links to the sales mailto with the subject `New project enquiry`.

## Mini-game: Strike While It's Hot

### Rules (`lib/forge-game.ts`, pure, no DOM)

- **State:** `idle | playing | striking | finished`.
- **Rounds:** 5, in order `WEB`, `APP`, `AUTOMATION`, `DATA`, `CLOUD`.
- **Needle:** position `p ∈ [0, 1]` follows a triangle wave. The full sweep period (0 → 1 → 0) is `1600 ms × 0.86^(round)`, with round indexed from 0.
- **Zones** are centred at 0.5. The white-hot half-width is `0.05 − 0.006 × round` (so 0.05 down to 0.026). The gold band extends a further 0.10 on each side. Everything else is crack.
- **Strike outcome by zone:**
  - `perfect`: combo + 1, score += 300 × combo (after increment), round forged, advance.
  - `good`: combo + 1, score += 100 × combo, round forged, advance.
  - `crack`: combo = 0, no score, the same round repeats.
- **Cooldown:** strikes are ignored for 350 ms after each strike (the `striking` state).
- **Timer:** 30 000 ms from start. The game ends when all 5 rounds are forged or the timer reaches 0.
- **Time bonus** applies only when all 5 are forged: `floor(remainingMs / 1000) × 50`.
- **Rank** by final score: `< 1200` Apprentice, `< 2800` Smith, `< 4500` Master Smith, `≥ 4500` Forge Legend.
- **Exports:** `createGame()`, `needleAt(state, nowMs)`, `zoneAt(p, round)`, `strike(state, nowMs)`, `tick(state, nowMs)` and `rankFor(score)`. Every function takes and returns plain objects, and timing is passed in so tests are deterministic.

### UI (`components/game/`)

- **`StrikeGame`** is a full-bleed stage on `--soot`. The left side holds the anvil and billet, drawn on a section-local canvas: a hammer swing arc on strike, billet colour from `heatColor`, sparks via `SparkField`. The right side, or the top on mobile, holds the heat bar and needle.
- **Input:** a pointer down anywhere on the stage, or Space/Enter while the stage has focus. The stage is a `<button>`-like focusable region with `aria-describedby` instructions. Start is a real button.
- **`GameHud`** (Martian Mono) shows the score, combo, time left, and five slots that fill as pieces are forged (`[WEB][APP][ · ]…`).
- **Feedback:** perfect gives a large spark burst, a 6px screen-shake of the stage and a "PERFECT" stamp. Good gives a medium burst and "GOOD". Crack gives grey dust and "CRACKED: STRIKE AGAIN". Each outcome is announced via an `aria-live="assertive"` region, for example "Perfect. Web forged. Combo 3."
- **`ResultCard`** shows the five pieces snapping together into a glowing system glyph, the score, the best combo, the rank and the time. Copy:
  - All forged: "You forged a system in 0:{ss}. Now let's forge yours."
  - Timed out: "The metal cooled. Strike again, or let us do the heavy lifting."
  - Buttons: **Strike again**, the email link `sales@visionforgestudio.app` (mailto), and **WhatsApp**.
- **Best score** uses `localStorage` key `vf-best`. Every read and write is wrapped in try/catch, so the game works fully without storage.
- **Sound** is off by default, with a speaker toggle. `clang.ts` synthesises a metallic hit with WebAudio (noise burst plus two detuned triangles and a fast decay), and the pitch rises with combo. The AudioContext is created only after the user enables sound.
- **Lifecycle:** the loop runs only while the stage is on screen and the tab is visible. Leaving the screen mid-game pauses the clock.
- **Reduced motion:** the needle position is quantised to 20 steps, with no shake, the burst replaced by a static flash, and the rules unchanged.

## Navigation

- A slim top bar that is transparent over the furnace. After 8px of scroll it gains a `--forge` 85% + blur background (falling back to solid when `prefers-reduced-transparency`).
- Links: Services · The Forge · Process · Why Us · Contact. The active link (IntersectionObserver, as now) shows a heated underline.
- **Start a project** button on desktop.
- The mobile full-screen menu keeps the current behaviour (focus trap, Escape, body scroll lock, WhatsApp/Call rows) with the new styling.
- On legal pages the nav links point to `/#…`.

## Legal pages and footer

### Entity (from the BCCAR Certificate of Registration)

`site.legal` in `lib/site.ts`:

```ts
legal: {
  registeredName: "Vision Forge",
  tradingName: "Vision Forge Studio",
  form: "partnership",
  registeredUnder: "Business Names Act, Chapter 247",
  registrationNumber: "000058528",
  jurisdiction: "Belize",
  lastUpdated: "6 October 2026",
  copyrightYear: 2026,
}
```

The site never uses "Ltd".

### Routes

`app/terms/page.tsx`, `app/privacy/page.tsx`, `app/disclaimer/page.tsx` and `app/cookies/page.tsx`. Each exports its own `metadata` (title, description, canonical). All four are added to `app/sitemap.ts`.

### `LegalLayout` (`components/layout/LegalLayout.tsx`)

Contains the title, the "Last updated" date, an auto-generated table of contents from `h2` ids, a 68ch reading column in Instrument Sans, calm styling (chrome headings, no heat effects except focus) and print styles (`@media print`: white background, black text, nav and footer hidden, URLs shown after links).

### Required content (generic for now)

All four pages use standard, plain-English, industry-typical wording. They do not cite specific statutes or fix hard numbers (no stated deposit percentage, retention period, liability multiple or response deadline). Wherever a number would go, the wording defers to "the applicable proposal or agreement" or "a reasonable period". Every page names Belize as the governing law. The specific statute citations and figures from the earlier draft can be added later after attorney review.

**Terms of Service** covers who we are, use of the website, quotes and proposals, payment ("as set out in your proposal or invoice"), client responsibilities, changes and revisions, intellectual property (the client owns the final deliverables made for them once paid, Vision Forge keeps its pre-existing tools, and third-party and open-source components stay under their own licences), portfolio use (the client can opt out), confidentiality, warranties, limitation of liability (generic: no indirect loss, liability limited to the extent permitted by law), third-party services, termination, electronic communications, governing law (the laws of Belize), changes to the terms, and contact.

**Privacy Policy** covers who we are, what we collect (only what people send by email, WhatsApp or phone, with no forms, analytics or tracking cookies), how we use it, sharing with service providers, international storage, retention ("only as long as needed"), security, your rights (access, correction, deletion, objection), how to contact us, children, and changes. It says we handle personal information in line with applicable data protection laws of Belize, without naming the Act.

**Disclaimer** covers general information only, not professional advice, no guaranteed results, availability and accuracy, external links, the mini-game being for entertainment only, and trademarks.

**Cookies and Local Storage** covers no tracking cookies, the `vf-best` and `vf-ignited` local keys, that they stay on the visitor's device, how to clear them, no consent banner, and that the page will be updated if this changes.

Every legal page ends with: "This page is provided for general information. It is not legal advice."

### Footer (`components/layout/Footer.tsx`)

Four columns on ≥ md, stacked on mobile:
1. Logo, the tagline "Built for your business. Built for your budget.", and "Belize".
2. **Studio:** Services, The Forge, Process, Contact.
3. **Contact:** `sales@visionforgestudio.app` and `support@visionforgestudio.app` (lowercase mailto links), WhatsApp, Call.
4. **Legal:** Terms of Service, Privacy Policy, Disclaimer, Cookies.

Bottom bar: "© 2026 Vision Forge. Registered in Belize under the Business Names Act, Cap. 247, Reg. No. 000058528. Trading as Vision Forge Studio." It also has a back-to-top ember button (`aria-label="Back to top"`). The year is the static `site.legal.copyrightYear` (2026). With Cache Components on, `new Date()` fails the prerender.

## Data changes (`lib/site.ts`)

- `sales.display` / `sales.href` change to `sales@visionforgestudio.app` / `mailto:sales@visionforgestudio.app`. `support` changes the same way.
- `navItems` uses the new ids and labels, and `capabilities`, `processSteps` and `principles` are re-worded per this spec. The existing values, `architectureNodes` and phone and WhatsApp numbers stay.
- `legal` is added (above). The JSON-LD in `layout.tsx` uses the lowercase emails, adds `legalName: "Vision Forge"`, and keeps the phone numbers.

## File structure

```
lib/        site.ts · heat.ts · forge-game.ts · connection-status.ts
components/forge/    SparkField.tsx · useHeat.ts · HeatText.tsx · Ignition.tsx
components/game/     StrikeGame.tsx · GameHud.tsx · ResultCard.tsx · clang.ts
components/sections/ Furnace · RawMaterials · Strike · Process · ConnectedSystem · Hallmarks · Quench
components/visuals/  ArchitectureDiagram.tsx (restyled) · Billet.tsx
components/ui/       Logo · CtaLink · Label · SectionHeading · EmailLink
components/layout/   Navbar · Footer · LegalLayout
app/                 layout.tsx · page.tsx · globals.css · sitemap.ts · robots.ts
app/{terms,privacy,disclaimer,cookies}/page.tsx
```

Removed, because they are replaced: `CapabilityStrip`, `CapabilityMatrix`, `WhyVisionForge`, `ProcessPipeline`, `ContactSection`, `Hero`, `ArchitectureSection`, `SystemVisual`, `AnimatedLine`, `Headline`, `Reveal`, `TechnicalLabel` and `SectionHeader`.

## Error handling and degradation

- No canvas 2D context: `SparkField` and the game canvas render nothing extra, the game falls back to the DOM-only anvil (CSS shapes), and play continues.
- Storage blocked: the best score shows "-" and no error.
- WebAudio unavailable: the sound toggle is hidden.
- Without JS: all content, links, emails and legal pages render server-side. The game section shows its rules and a "Enable JavaScript to play" note.
- Heavy effects are disabled when `navigator.hardwareConcurrency <= 4` on coarse pointers: shimmer off, spark cap 150.

## Testing

Run with `npm test` (`node --experimental-strip-types --test`).

- `tests/heat.test.ts`: colour at stops 0, 0.35, 0.7 and 1, clamping, weight endpoints, decay half-life, and the zero floor.
- `tests/forge-game.test.ts`: zone boundaries per round, perfect, good and crack scoring with combo, crack repeating a round, the cooldown ignoring strikes, the timer ending a game, the time bonus only when all are forged, rank thresholds, and deterministic `needleAt`.
- `tests/connection-status.test.ts`: unchanged.
- `tests/logo-assets.test.ts`: keeps the PNG hash, size, no-JPG and Logo component assertions (src, `object-contain`, alt, 819×819), and the layout metadata references. The hero and nav class and label assertions are rewritten to the new placements (hero uses `Logo` with `priority`, the nav link keeps `aria-label="Vision Forge Studio, home"`).
- `tests/contacts.test.ts`: every `mailto:` in `lib/site.ts` and in the source of components and app is lowercase, the displayed emails are lowercase, and no capital letters appear in any `@visionforgestudio.app` string across the source.
- `tests/legal.test.ts`: the four legal route files exist, each mentions "Belize", the sitemap lists them, and the footer links to all four.

Manual check before handover: `next build` and `eslint` pass, plus screenshots at 390px and 1440px of every section, the game finished state and one legal page. No horizontal scroll at 390px. Keyboard play works (Tab to stage, Space strikes). Reduced-motion mode is checked via emulation.

## Out of scope

Blog/CMS, a contact form, analytics, light mode, i18n/Spanish, portfolio or testimonials (pending real material from the owner), and 3D/Three.js.
