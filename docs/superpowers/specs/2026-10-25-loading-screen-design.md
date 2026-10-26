# Loading screen: mark reveal

Date: 2026-10-25
Site: visionforgestudio.app (Next.js, deployed GitHub → Cloudflare)
Status: approved 2026-10-25

## Why

The site opens straight onto the page. A short branded introduction on each full load gives the Vision Forge mark a moment of its own before the page is used.

## Goals

1. Every full load plays the same intro: open the site, refresh, or paste the address.
2. The intro lasts about 3 seconds and uses the real logo on the navy field, with a gold line.
3. The page underneath is already rendered, and it cannot be clicked or tabbed until the intro finishes.
4. A failed logo image still clears the screen on the same timer.
5. Reduced motion shows a still logo, then fades, with no line and no scale.

## Non-goals

- No intro on client-side moves between pages. The root layout stays mounted, so the menu does not replay it.
- No skip control.
- No memory of a previous visit. The next refresh plays it again.
- No change to page content, the hub, or the hero copy.

## Sequence

The overlay is in the first HTML, covering the viewport with `#0b1626`, so the page never shows through before the intro.

| Time | What happens |
| --- | --- |
| 0.0–0.6s | A gold line (`#e7b54a`) draws across the middle. |
| 0.5–1.6s | The logo scales up into place. |
| 1.6–2.4s | The logo holds, still and sharp. |
| 2.4–3.0s | The navy fades out. The overlay leaves the document. |

The logo is `/brand/vision-forge-logo.png` through the existing `Logo` component, large enough to read as the mark (about 160px wide). Its accessible name is "Vision Forge Studio", read once.

## While it plays

- The overlay sits above the skip link, navigation, page, and footer.
- Those regions are `inert` until the overlay is removed, so they cannot be clicked or tabbed.
- Focus is not moved when the overlay leaves.
- There is no spinner and no wordmark besides the logo image.

## Reduced motion

When `prefers-reduced-motion: reduce` matches, the line and the scale do not run. The logo is shown still on the navy for 0.6s, then the screen fades over 0.4s. The overlay still leaves on its own.

## Build

- One client component, `components/layout/LoadingScreen.tsx`, mounted from `app/layout.tsx` so every page gets it.
- It is server-rendered as visible. After hydration it runs the timeline and then removes itself.
- Nothing is written to `sessionStorage` or `localStorage`.
- If the image fails, the timer still removes the overlay.

## Tests

- The root layout renders `LoadingScreen`.
- The screen uses the logo, the navy field, and the gold line.
- Reduced motion skips the line and the scale.
- The screen does not read or write visit storage.
