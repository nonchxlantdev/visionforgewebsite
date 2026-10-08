# Workshop multipage redesign — design spec

Date: 2026-10-08
Status: approved in brainstorming (direction "A · Workshop", tier-based pricing ticket, page lineup)

## Why

- New logo: a chrome-and-gold eye with hammer, anvil and sparks. The light Apple-style site clashes with it.
- The owner felt the light site looked "heavily AI": centred headlines, gradient text, pills, soft cards, Inter, dot grid.
- Goal: unique but natural, built from the logo, and multipage so it's more interactive. Same automation-first
  message and pricing.

## Decisions

| Question | Decision |
|---|---|
| Direction | **Workshop**: near-black, steel-white type, gold as a maker's mark, real objects (paper receipt, work ticket). |
| Headline | "Your business, minus the busywork." |
| Structure | Six pages: Home, Automation, Websites, Pricing, How we work, Contact (+ legal pages). |
| Pricing | Tier-based. The work ticket lists what was picked and shows the tier and its starting price. No per-item prices. |

## Pages

Nav: **Automation · Websites · Pricing · How we work · Contact** + gold "WhatsApp us" button; logo → Home. Active page
marked. Every page except Contact ends with the shared **Closing band** ("Ready when you are." + WhatsApp + Price your project).

1. **Home `/`**
   - Hero (left-aligned): kicker "Belize · Automation & websites", H1 "Your business, minus the **busywork.**"
     (gold last word), lede, buttons "Price your project →" (`/pricing`) and "See how it works" (`/automation`),
     meta row "From BZ$500* · Fixed written quotes · Free first chat". Right: the full logo emblem with a slow
     light glint and a small stamp "Est. Belize · Reg. 000058528".
   - Workbench: "Every order you write by hand is an hour you never get back." A paper receipt with four
     handwritten lines next to an "Order #1042" panel. Button **Automate it**: each handwritten line is struck
     through in turn while its automated row ticks on, then "Your time: 0 min". "Do it by hand again" resets.
   - What we automate: the six problems as numbered rows (pain in quotes → what we do).
   - Who we work with: the eight business types + the scrolling ribbon + "Don't see your business?" line.
   - Page index: four links (Automation, Websites, Pricing, How we work) with one line each.
2. **Automation `/automation`**: page header; the "One order, two ways" demo (existing logic, restyled); the
   six automations as *What you do now → What happens instead*; "Works with what you already use" (WhatsApp,
   spreadsheets, accounting software, email, your website); two FAQs; closing band.
3. **Websites `/websites`**: page header; four kinds (Business websites, E-commerce stores, Virtual shops,
   Booking sites) each with 3 bullets; "Every site includes" list beside a browser-frame preview; closing band.
4. **Pricing `/pricing`**: page header "Build it. See the price."; the three tier cards; the builder:
   01 business type (optional, one) → 02 what's slowing you down (any) → 03 budget (optional); the paper work
   ticket (sticky on desktop) shows business, picked items, tier, from price*, usual time, budget fit line,
   small print, Send on WhatsApp / Email it instead / Start over; three pricing FAQs; closing band.
5. **How we work `/how-we-work`**: the four steps as a numbered timeline; "What you always get" (fixed written
   quote; you own what we build; support after launch; plain language, no tech talk); trust line; full FAQ with
   FAQPage JSON-LD; closing band.
6. **Contact `/contact`**: header "Let's talk."; four contact tiles; big WhatsApp button; "The first
   consultation is free."

## Visual system

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0d0c0b` | Page |
| `--bg-2` | `#161412` | Panels |
| `--bg-3` | `#1f1c19` | Raised panels, inputs |
| `--line` | `#2a2724` | Rules |
| `--line-2` | `#3d3934` | Control borders |
| `--steel-hi` | `#f1f1ef` | Headings |
| `--steel` | `#d9dbde` | Body |
| `--steel-2` | `#9a9ea4` | Secondary |
| `--gold` | `#e0ad3a` | Accent, primary buttons |
| `--gold-hi` | `#f0c25a` | Button hover |
| `--on-gold` | `#1a1205` | Text on gold |
| `--paper` | `#efe7d6` | Receipt, work ticket |
| `--paper-ink` | `#241e17` | Text on paper |
| `--paper-ink-2` | `#6b5f4e` | Secondary on paper |
| `--ink-red` | `#9a3b2c` | Handwritten corrections |
| `--done` | `#7fd18b` | Completed steps on dark |

Type (self-hosted woff2): **Archivo** variable (width 112–118%, weight 700–800) for headings; **Instrument Sans**
for body (17px/1.55); **IBM Plex Mono** 500 for small uppercase labels; **Caveat** 600 for handwriting only.
Layout: max width 1240px, left-aligned headings, 1px rules instead of cards, 4–6px radii, no pills, no gradients
on text. Gold is used for one word per headline, buttons, numbers and hairline highlights only.

Motion: logo glint (a light band sweeping across the emblem every ~7s, masked to the logo), workbench strike-
through sequence, demo sequence, CSS scroll reveal, ribbon marquee, ticket rows stamping in. All off under
`prefers-reduced-motion`.

## Logo

The new PNG (1369×1149, transparent) replaces `public/brand/vision-forge-logo.png`; WebP variants regenerated at
96, 160, 256, 384, 512, 640, 819, 1080, 1369 widths. Favicon and Apple icon become square padded crops of the new
logo on transparent/black. `Logo` uses width 1369 / height 1149.

## Logic changes

- `lib/project-builder.ts`: add optional `business` (9 options incl. "Something else"); message becomes
  "Hi Vision Forge, I run {a/an business}. Here's what's slowing my business down: …. Budget: …. Can we talk?"
  (the "I run" part only when a business is picked). Everything else unchanged.
- `lib/demo.ts`: add a handwritten `note` per step for the receipt.
- `lib/site.ts`: hero copy; `navItems` become page routes; new `websiteKinds`, `websiteIncludes`, `promises`,
  `worksWith`, `pageIndex`.

## Testing

Unit: demo, project-builder (business), site content, design tokens + contrast (steel-2 on bg/bg-2,
paper-ink-2 on paper, on-gold on gold, gold on bg), logo assets. Structure: every route exists with metadata
and one `<h1>`, nav order, home section order, pricing page has the builder and `priceNote`, FAQPage JSON-LD on
How we work, sitemap lists all pages. Browser: all routes 200 in the Workers runtime, no CSP errors, no
horizontal scroll at 390/1440, workbench and demo work by keyboard, reduced motion shows final states, JS off
shows content.
