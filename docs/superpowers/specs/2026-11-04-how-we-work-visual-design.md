# How we work: scroll-driven visual — design

Date: 4 November 2026
Status: approved in conversation; awaiting spec review

## Goal

Give the seven-step "How we work" process a visual that tells the story of a
client's tools getting connected, step by step, as the visitor scrolls. Used on
the homepage (compact) and on `/how-we-work` (full). No copy changes: step
titles and descriptions stay in `lib/site.ts` (`howWeWorkSteps`).

## Decisions (from brainstorming)

- Placement: both pages, one shared component.
- Interaction: scroll-driven. The step nearest the middle of the viewport is
  "active"; the picture shows that step's state.
- Picture: the same 8 tool tiles as the hero (`HUB_TOOLS` in `lib/hub.ts`),
  changing state per step.
- Phones and narrow tablets: no pinning; each step card carries its own small,
  static picture for that step.
- Build approach: active-step detection plus CSS transitions between fixed
  states (approach 1). No new dependencies.

## Layout

Desktop (`lg` and up):

- Existing section heading on top (`SectionHeading`, eyebrow "Process").
- Two columns. Left: the steps as an `<ol>` with a thin vertical progress rail
  that fills in reef blue down to the active step. Right: a sticky picture panel
  (top offset `calc(var(--nav-h) + 2.5rem)`), styled to match the hero's
  `HubPanel` as it stands now (dark ink panel, faint dot grid, soft reef-blue
  glow, rounded tool windows), so the two read as the same system.
- Active step: blue number, ink title, body copy at full contrast. Inactive
  steps: same text colours as now but the number in `text-muted`; no text drops
  below 4.5:1.
- Corner label in the panel: `{n} / 7 · {title}` (text taken from
  `howWeWorkSteps`).

Variants (prop `variant`):

- `compact` (homepage): each step block about 40vh tall; no extra content.
- `full` (`/how-we-work`): each step block about 60vh tall, larger titles; the
  existing "Optional: training and ongoing support" aside stays below the list.

Below `lg`: a plain stacked list; each step card shows number, title, copy, then
a 200px-tall static picture at that step's state. Nothing is sticky.

## The seven picture states

All states are built from the 8 tiles plus a hub. Tile styling reuses the
hero `HubPanel`'s tool-window look (white card, coloured app dot, label), at a
smaller size, without the per-tool previews.

| # | Step | Picture |
|---|------|---------|
| 1 | Discover | Tiles scattered and slightly rotated; no hub. A chat-bubble icon in the centre. |
| 2 | Map the workflow | Tiles in a loose grid; grey dashed lines between neighbours. Tiles flagged `bottleneck` in `HUB_TOOLS` (Paper forms, Accounting, Reports) get an amber outline and a small clock icon. |
| 3 | Design the solution | Blueprint: tiles turn to dashed outlines, an outlined hub appears in the centre, a small document icon beside it. |
| 4 | Integrate and automate | Hub becomes solid with the logo; reef-blue lines from every tile to the hub; bottleneck flags gone. |
| 5 | Test | Green check badges on each tile, appearing in sequence (staggered 60ms). |
| 6 | Deploy | A "Live" badge with a green dot on the hub. ("Live" is the only new word.) |
| 7 | Improve | A small bar chart rises beside Reports; a loop-arrow icon by the hub. |

States are cumulative where it reads naturally: from step 4 on, the lines stay;
from step 5 on, the checks stay; step 6 adds Live; step 7 adds the chart.

## Architecture

- `lib/process.ts` (new, no imports beyond `lib/hub.ts`, so `node --test` can
  load it): `processScene(step: number)` returns a plain object describing the
  picture for steps 0–6, e.g. `{ layout: "scatter" | "grid" | "hub", tiles:
  [{ id, x, y, rotate, outline, bottleneck, checked }], hub: "none" | "outline" |
  "solid", lines: "none" | "dashed" | "connected", live, chart, icon }`.
  Positions are percentages of the panel. Out-of-range steps clamp.
- `components/sections/process/ProcessScene.tsx` (new, server-safe, no hooks):
  renders one scene from `processScene(step)`. Tiles are absolutely positioned
  and move with CSS `transform`/`opacity` transitions (300–500ms, `--ease-out`).
  Lines are one inline SVG (`aria-hidden`) whose paths fade or draw with
  `stroke-dashoffset`. Props: `step`, `size: "panel" | "card"`.
- `components/sections/process/ProcessScroll.tsx` (new, client): renders the
  heading, the `<ol>` of steps, and on `lg` the sticky panel with
  `<ProcessScene step={active} />`. One `IntersectionObserver` on the step
  blocks with `rootMargin: "-45% 0px -45% 0px"` sets `active`. Each step `<li>`
  gets `aria-current="step"` when active. Below `lg`, each `<li>` renders
  `<ProcessScene step={i} size="card" />`. Props: `variant: "compact" | "full"`.
- `components/sections/Stages.tsx` (homepage) renders
  `<ProcessScroll variant="compact" />` plus the existing "See each step in
  detail" link.
- `components/sections/ProcessSteps.tsx` (`/how-we-work`) renders
  `<ProcessScroll variant="full" />` plus the existing after-launch aside.

Server render and first paint show step 1; the observer takes over on the
client. No layout shift: the panel has a fixed aspect ratio.

## Accessibility and motion

- The picture is decorative (`aria-hidden`); the steps list carries the
  meaning and reads in order without the visual.
- `prefers-reduced-motion: reduce`: no transitions; states swap instantly.
- Keyboard and screen reader users get the same ordered list; no focus traps,
  no scroll hijacking.
- All text pairs keep 4.5:1 (checked by `tests/design.test.ts`).

## Testing

- `tests/process.test.ts` (new): seven scenes; only scene 2 has bottleneck
  flags and they match `HUB_TOOLS`; lines are `connected` from scene 4; checks
  from scene 5; `live` from scene 6; `chart` only in scene 7; clamping works.
- Update `tests/home.test.ts` ("how-we-work summary") and
  `tests/how-we-work.test.ts` to assert that `Stages.tsx` and
  `ProcessSteps.tsx` use `ProcessScroll` with the right variant, and that
  `ProcessScroll.tsx` maps `howWeWorkSteps` into an `<ol>`.
- Manual: desktop scroll through both pages; phone width shows cards with
  pictures; reduced motion swaps instantly.

## Out of scope

- Scroll-scrubbed (continuous) animation, 3D, autoplay.
- Any copy change beyond the single "Live" badge.
