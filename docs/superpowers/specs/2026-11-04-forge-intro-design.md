# Loading screen: hammer and anvil intro — design

Date: 4 November 2026
Status: approved in conversation

## Goal

Replace the current intro (logo fading in behind a thin line) with a short
forge moment: a hammer taps an anvil twice, then lands one big strike whose
flash turns into the Vision Forge logo. Same length, same behaviour, more brand.

## Decisions (from brainstorming)

- Concept: the strike reveals the logo; the intro still ends on the logo.
- Rhythm: tap, tap, STRIKE.
- Style: flat dark-slate silhouettes (hammer and anvil) on a white intro
  background, drawn smaller than the logo (112px vs 160px), with gold-orange
  sparks and a warm gold flash that echo the gold in the logo. (Revised after
  review: originally silver on near-black.)
- Build: inline SVG animated with CSS keyframes in `app/globals.css`, so it
  plays from first paint, before hydration. No new dependencies, no sound.

## Timeline (full motion, 3.0s total, unchanged)

| Time | Event |
|------|-------|
| 0.0–0.3s | Hammer (raised) and anvil fade in. |
| 0.55s | Tap 1: short swing down, 3 sparks, 2px anvil jolt. |
| 0.95s | Tap 2: same. |
| 1.15–1.5s | Wind-up higher, then the strike: white flash, 10 sparks, small shake. |
| 1.6–2.1s | Hammer and anvil shrink and fade; the logo scales up out of the flash. |
| 2.4–3.0s | Whole overlay fades out (existing `vf-fade`), site becomes usable. |

## Reduced motion

`prefers-reduced-motion: reduce`: the hammer and anvil are hidden; the logo
shows at rest; the overlay fades at 0.6s and the timer ends at 1.0s, exactly as
today.

## Unchanged behaviour

`LoadingScreen` keeps its timer (3000ms / 1000ms), keeps `#site` inert until it
leaves, keeps `role="status"` and the overlay at `z-[80]` (now `bg-paper`, white), the priority
logo (`w-40`, `sizes="160px"`), and stores nothing between visits.

## Architecture

- `components/layout/ForgeIntro.tsx` (new, no hooks): the decorative SVG
  (`aria-hidden`): anvil, hammer group (rotates about the end of its handle),
  three spark groups (tap 1, tap 2, strike) and the flash circle. Spark
  directions are fixed data in the file.
- `components/layout/LoadingScreen.tsx`: renders `<ForgeIntro />` in place of
  the line, with the logo layered on top in the same centre.
- `app/globals.css`: keyframes `vf-forge-in`, `vf-hammer`, `vf-jolt`,
  `vf-spark`, `vf-flash`, `vf-forge-out` replace `vf-line`; `vf-logo` now starts
  at 1.6s. All forge animation sits inside
  `@media (prefers-reduced-motion: no-preference)`.

## Testing

- `tests/loading-screen.test.ts`: the intro mounts `<ForgeIntro />`, keeps the
  timer, inert and status behaviour, and the CSS has the new keyframes with the
  reduced-motion fallback (forge hidden, logo at rest, fade at 0.6s).
- `tests/design.test.ts`: the allowed keyframe list matches.
- Manual: watch the intro at desktop and phone width; check with reduced motion.

## Out of scope

Sound, redrawing the logo itself, changing the intro's length.
