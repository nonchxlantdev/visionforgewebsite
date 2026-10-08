# Automation-first redesign — design spec

Date: 2026-10-07
Status: approved in brainstorming, awaiting written-spec review

## Why

Feedback from Shamira Young (boss): the site is "all over the place", needs to flow, and a regular
person won't understand what we do. She wants the site aimed at people who need to **automate or
integrate** their processes, and wants it to stand out.

Diagnosis of the current site:

- The same idea ("what we build") is explained four times in a row: hero, two-door tabs, builder,
  pricing. Each section restarts instead of moving the visitor forward.
- Too many competing asks (WhatsApp, tabs, four-step builder, pricing, FAQ).
- Copy uses our vocabulary ("business systems", "portals", "integrations"), not the customer's pain.
- Automation, the highest-value and most distinctive offer, is buried in the "company" tab and the
  BZ$8,000 Custom tier.
- The forge visual language (molten gold, embers, condensed industrial type) competes with a
  message that now needs to be calm and obvious.

## Decisions (from brainstorming)

| Question | Decision |
|---|---|
| Who the homepage leads with | Businesses already running and drowning in manual work. Automation and connecting tools first; websites are one of the things we do. |
| Centrepiece | "One order, two ways": a WhatsApp order handled manually vs automatically. |
| Builder | Replaced by one question, "What's slowing your business down?", plus optional budget. Sits after pricing. |
| Pricing | Three tiers renamed around outcomes: Get found / Automate one task / Connect your business. |
| Page structure | One story, top to bottom (approach 1). No tabs. |
| Visual direction | B · Studio light (Apple main-site style). |

## Page flow

Single page, `app/page.tsx`, in this order. Each section answers the question the previous one raises.

1. **Hero** (`#top`)
2. **Demo — One order, two ways** (`#how`)
3. **What else we automate** (`#automate`)
4. **How it works** (`#steps`)
5. **Pricing** (`#pricing`)
6. **What's slowing your business down?** (`#start`)
7. **FAQ** (`#faq`)
8. **Contact** (`#contact`)

Nav: How it works (`#how`) · What we automate (`#automate`) · Pricing · FAQ · Contact, plus a
"WhatsApp us" pill button. The mobile bottom contact bar stays.

## Section content

### 1. Hero

- Kicker: `Automation and websites · Belize`
- Headline (two lines, second line in the accent colour): **Stop doing the / same work twice.**
- Lede: "We connect the tools your business already uses, like WhatsApp, spreadsheets and your
  accounting software, so orders, invoices and reports happen on their own. We build websites too."
- Primary button: `See how it works` → `#how`. Secondary text link: `WhatsApp us ›` → WhatsApp.
- Trust line: `Based in Belize · Prices from BZ$500* · Free first consultation`.
- Logo is not shown large in the hero any more (it stays in the nav and footer).

### 2. Demo — "One order, two ways"

Heading: "One order, two ways." Sub: "Here's a normal WhatsApp order. Watch what happens to it."

Layout: a phone frame on the left with a WhatsApp-style chat bubble
("Hi, can I get 2 cases of water and 1 bag of rice for Thursday?"), and four step cards on the right.
On screens below `md` the cards stack under the phone.

| # | Manual label | Automated label |
|---|---|---|
| 1 | Copy the order into a spreadsheet | Order saved to your sheet |
| 2 | Write the invoice by hand | Invoice created |
| 3 | Text the customer the total | Customer gets the total on WhatsApp |
| 4 | Remind them to pay | Payment reminder sent on its own |

Behaviour:

- A segmented switch, `Manual` / `Automate it`, starts on Manual.
- When the demo scrolls into view (or Manual is selected), the cards complete one by one at a slow
  pace while a counter counts up to **12 minutes** ("of your time, for one order").
- Selecting `Automate it` replays the cards quickly (~2s total), a connector line draws between them
  in order, each shows a green tick, and the counter animates down to **0 minutes**.
- Below: "That's one order. Multiply it by every order, every day." + link `See what else we automate ↓`.
- Small print under the counter: "Example for illustration. Your times will vary."
- The switch is a real `role="radiogroup"` (two radios), keyboard operable; counter changes are
  announced via an `aria-live="polite"` region.
- `prefers-reduced-motion: reduce`: no step animation or counting; show the selected state instantly.
- No JavaScript: server-render the Automated state as a plain ordered list with the 0-minute line.

Demo timing/state lives in a small pure module (`lib/demo.ts`) so it can be unit tested:
`DEMO_STEPS`, `MANUAL_MINUTES = 12`, `stepMinutes` (sums to 12) and `minutesAfter(mode, completedSteps)`.

### 3. What else we automate

Heading: "Same idea, everywhere you lose time." Six tiles (3×2 desktop, 2 columns tablet, 1 mobile).
Each tile: the pain in quotes, then what we do. Lucide icon per tile.

1. "I chase people to pay every week." → Automatic payment reminders on WhatsApp or email.
2. "My staff still fill in paper forms." → Forms on a phone that go straight into a report.
3. "Bookings get lost in my messages." → Customers book themselves; you get reminders.
4. "Every Friday I rebuild the same report." → A live dashboard that updates itself.
5. "My sales and my accounts never match up." → Your sales flow straight into your books.
6. "People can't find us online." → A fast website set up on Google, with WhatsApp buttons.

### 4. How it works

Four steps, numbered, horizontal on desktop, vertical on mobile:

1. Tell us what's slowing you down.
2. We map it and send a fixed quote.
3. We build it and set it up with your team.
4. We stay on for support.

### 5. Pricing

Heading: "Start small. Add more when it pays off." Three cards on a dark panel:

| id | Label | From | Time | Copy |
|---|---|---|---|---|
| `found` | Get found | BZ$500 | 2–4 weeks | A website or landing page, set up on Google, with WhatsApp and call buttons. |
| `automate` | Automate one task | BZ$1,500 | 2–4 weeks | One job taken off your plate, like orders into a sheet with automatic invoices, or payment reminders. |
| `connect` | Connect your business | BZ$8,000 | 8+ weeks | Several tools working together, plus staff portals, digital forms and dashboards. |

The `automate` card is visually featured with a small "Where most start" label.
Each price has the `*` and the existing `priceNote` small print sits under the cards with its
`Read more` link to `/disclaimer#estimates`. BZ$1,500 is a placeholder the owner will confirm.

### 6. What's slowing your business down?

Replaces the four-step builder. Two groups of chips:

- **What's slowing you down?** (pick any): Typing up orders · Chasing payments · Paper forms ·
  Bookings · Weekly reports · Sales and accounts don't match · I need a website · Not sure yet.
- **Budget** (optional, pick one): Under BZ$1,500 · BZ$1,500–8,000 · BZ$8,000+ · Not sure.

Problem → tier mapping: website → `found`; orders, payments, bookings, forms → `automate`;
reports, accounts → `connect`; "Not sure yet" is exclusive and maps to no tier. The suggested tier
is the highest tier among the picks.

Result card (live region):
- Nothing picked: "Pick what's slowing you down and we'll suggest where to start."
- Tier found: "Sounds like **{Tier}**, from BZ${from}*, usually {weeks}." plus a budget line:
  fits → "Your budget fits this."; below → "Your budget fits a smaller first step. We'd start with
  {lower tier} and add the rest later."; unsure → nothing.
- "Not sure yet" only: "No problem. Send it over and we'll suggest the right first step."
- Price small print under any price.
- Buttons: `Send this on WhatsApp`, `Email it instead` (enabled once at least one problem is picked),
  `Start over`.
- Message (≤500 chars, existing `MAX_MESSAGE`): "Hi Vision Forge, here's what's slowing my business
  down: {problems joined}. Budget: {budget}. Can we talk?" Built and validated with the existing
  `strictEncode`, `whatsappHref`/`mailtoHref` safety rules.

The logic stays a pure module; `lib/project-builder.ts` is rewritten to the new shape (problems +
budget), keeping its safety helpers.

### 7. FAQ

Existing questions, wording updated for the new tiers, plus:

- "Do I have to change the software I already use?" → "Usually not. Most of the time we connect
  what you already have."
- "Is automation only for big companies?" → "No. Most first projects automate one task and start
  from BZ$1,500."

The cost answer is updated to "Websites start from BZ$500 and automation from BZ$1,500…".
FAQPage JSON-LD keeps being generated from the same data.

### 8. Contact

Unchanged structure (four tiles, WhatsApp CTA). Adds one line: "10+ years building software ·
Based in Belize · Real support after launch." Restyled to the new visual system.

## Visual system — Studio light

Reference: Apple's main site. Light pages, dark showcase panels, one accent colour.

### Tokens (`app/globals.css`, Tailwind 4 `@theme inline`)

| Token | Value | Use |
|---|---|---|
| `--page` | `#FFFFFF` | Main background |
| `--canvas` | `#F5F5F7` | Alternate section background, cards on white |
| `--ink` | `#1D1D1F` | Headings and body text |
| `--ink-2` | `#6E6E73` | Secondary text (passes 4.5:1 on white and #F5F5F7) |
| `--hairline` | `#D2D2D7` | Dividers, chip borders |
| `--panel` | `#000000` | Dark showcase panels (demo, pricing) |
| `--panel-2` | `#1D1D1F` | Cards inside dark panels |
| `--panel-ink` | `#F5F5F7` | Text on dark panels |
| `--panel-ink-2` | `#A1A1A6` | Secondary text on dark panels |
| `--accent` | `#0071E3` | Primary buttons, selected chips |
| `--accent-link` | `#0066CC` (light) / `#2997FF` (on dark) | Text links |
| `--done` | `#30D158` on dark / `#1E7B34` on light | Completed demo steps only |

`color-scheme: light`. Old forge tokens (forge, soot, chrome, ash, ember, molten, whitehot) and
CSS (`.grain`, `.chrome-text`, `.hot-text`, `.brushed`, `.ingot`, `.furnace-glow`, steam, shakes)
are removed. The logo keeps its own gold, which becomes the only gold on the page.

### Type

- One family: **Inter** variable, self-hosted via `next/font/local` (woff2 from `@fontsource-variable/inter`,
  copied into `app/fonts/`). The three forge fonts are removed.
- Headlines: weight 600–700, letter-spacing −0.02 to −0.03em, `clamp(2.75rem, 7vw, 5.5rem)` for the
  hero, `clamp(2rem, 4.5vw, 3.5rem)` for section headings. Sentence case, no all-caps.
- Body 17px / 1.5 (Apple's body size), secondary 15px. Minimum 12px (small print only).
- Kickers are small accent-coloured sentence-case text, not mono caps.

### Shape and layout

- Max content width 1120px, centred; section padding `py-24 md:py-32`.
- Headlines centred for hero, demo, pricing and "slowing you down"; left-aligned grids inside.
- Rounded panels: 28px radius for dark panels and large cards, 18px for tiles, pill buttons
  (`rounded-full`), 44px minimum touch targets.
- No hard borders around sections; separation comes from background changes (white ↔ #F5F5F7 ↔ black).
- Nav: translucent white with backdrop blur once scrolled, 52px tall, small text links.

### Motion (Motion library)

- Section content fades in and rises 16px on scroll into view, 400–500ms, `cubic-bezier(0.16,1,0.3,1)`,
  once only.
- The demo is the one larger animation (see section 2).
- Hover: buttons darken slightly; tiles lift 2px. 150–250ms.
- All motion disabled under `prefers-reduced-motion: reduce` (existing `useReducedMotionPref`).
- Removed: SparkField, HeatText, heat-hover, nav underline glow.

## Files

New:
- `components/sections/Demo.tsx` (client) and `lib/demo.ts` (pure)
- `components/sections/Automate.tsx` (server)
- `components/sections/Start.tsx` (client; replaces builder) + `components/sections/StartCard.tsx`
- `components/ui/Reveal.tsx` (client fade-up wrapper)
- `app/fonts/inter-variable.woff2`
- `tests/demo.test.ts`

Rewritten: `lib/site.ts` (hero, automate tiles, steps, tiers, faq, nav), `lib/project-builder.ts`,
`app/globals.css`, `app/layout.tsx` (font, body classes), `app/page.tsx`, `components/sections/{Hero,
HowItWorks,Pricing,Faq,Contact}.tsx`, `components/layout/{Navbar,Footer,MobileContactBar,LegalLayout}.tsx`,
`components/ui/{CtaLink,EmailLink,SectionHeading,Label}.tsx`, tests `clarity`, `project-builder`,
`heat` (reduced to the motion preference helper), `logo-assets`.

Removed (user deletes on device with one PowerShell command):
`components/sections/{Doors,WhyUs}.tsx`, `components/builder/` (folder), `components/visuals/Examples.tsx`,
`components/forge/{HeatText,SparkField}.tsx`, `lib/heat.ts` (if nothing else needs it),
`app/fonts/{big-shoulders-display,instrument-sans,martian-mono}.woff2`. `useHeat.ts` moves to
`lib/use-reduced-motion.ts`.

Unchanged: legal page content, security headers, safe-href rules, image loader, Cloudflare/OpenNext
config, sitemap, robots.

## Testing and checks

- Unit tests (node --test):
  - `demo`: 4 steps, manual minutes sum to 12, automated ends at 0.
  - `project-builder`: problem→tier mapping, "Not sure yet" exclusivity, budget fit messages,
    message ≤500 chars, WhatsApp/mailto hrefs pass `isSafeNavigationHref`.
  - `clarity`: hero headline text, six automate tiles including the sales/accounts one, tiers
    500/1500/8000 with new ids, FAQ ≥ 8 incl. the two new questions, `priceNote` in Pricing and Start,
    no forge jargon or forge tokens (`molten`, `ember`, `HeatText`) in components.
  - Existing contacts, legal, deploy, security, logo tests keep passing.
- `tsc --noEmit`, ESLint, OpenNext build, local Workers preview: all routes 200, 404 correct, no CSP
  violations.
- Browser checks at 390px and 1440px: no horizontal scroll, demo works by mouse and keyboard,
  reduced-motion shows static states, JS-off shows the automated list and all FAQ answers.
- Contrast: all text pairs ≥ 4.5:1 (secondary grey `#6E6E73` on `#F5F5F7` is 4.6:1).
- Screenshots of desktop and mobile sent before delivery to the device.

## Open items for the owner

- Confirm BZ$1,500 starting price for "Automate one task".
- Confirm the 12-minute illustrative figure is acceptable.
- Still pending from before: free first consultation promise; BZ$8,000 Connect tier.
