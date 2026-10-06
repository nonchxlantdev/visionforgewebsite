# Hero logo and connected-system tap prompt

## Purpose

Two changes to the existing Vision Forge Studio page:

1. Tell visitors they can tap a node in “A connected system.”
2. Replace the current logo with the supplied square PNG, and show that lockup large in the hero.

The artwork is not redrawn, cropped, or recolored.

## Tap prompt

`ArchitectureDiagram` keeps its current selection behavior. Tapping a node draws links from that node to every other node. Tapping the origin again clears the links. Desktop and the narrower list use the same selection.

Above the diagram, in this order:

- A static line that never changes: `TAP A NODE TO CONNECT THE SYSTEM.`
- A status line that is absent until a node is selected. After a tap it reads like `05 · DATA · LINKED TO ALL`. Clearing the selection removes it again.

The static line uses the existing small monospace label style. It does not animate and it does not disappear after a choice.

The status lives in a region that stays in the page so a selection is announced when the text appears. The nodes still show `ORIGIN` on the selected node and `LINKED` on the others.

## Logo

The source file is the supplied 819×819 PNG with an alpha channel. It is copied unchanged to `public/brand/vision-forge-logo.png`. The previous JPG is removed.

`Logo` loads that PNG with `object-contain` so the full lockup, including the transparent field, stays visible on the near-black page. Callers pass `sizes` so the hero download is not capped at the nav size.

Placements:

- Hero, first item in the left column, above `VISION FORGE / DIGITAL ENGINEERING`, then the existing headline, copy, and buttons. 160px square below the small breakpoint, 224px square from the small breakpoint up.
- Nav keeps `h-11 w-11`, and `sm:h-12 sm:w-12`, and swaps in the new file. Footer keeps `h-28 w-28`.
- Open Graph, Twitter, and the ProfessionalService `image` and `logo` fields point at the PNG. Declared dimensions are 819×819.
- `app/icon.jpg` and `app/apple-icon.jpg` are replaced by PNG copies of the same file, named `app/icon.png` and `app/apple-icon.png`.

The nav link label stays `Vision Forge Studio, home`. The image alt stays `Vision Forge Studio`.

## Out of scope

No change to node positions, link drawing, the process section, copy outside the prompt, or the logo pixels.

## Check

On a desktop width and at 390px:

- The tap line is visible before a tap and still visible after one.
- Choosing a node links it to every other node, and choosing it again clears the links.
- The status line names the selected node.
- The large logo sits above the mono line and the headline, and the page does not scroll sideways.
