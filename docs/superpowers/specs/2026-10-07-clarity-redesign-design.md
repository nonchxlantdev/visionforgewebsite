# Clarity redesign: a first-time visitor understands what we sell

Date: 7 October 2026
Status: approved in brainstorming, awaiting spec review
Builds on: `2026-10-06-living-forge-redesign-design.md`. The visual system, fonts, legal pages, security headers and Cloudflare deployment stay. The homepage content and order are replaced.

## Goal

A business owner who has never hired a developer lands on the homepage and, within the first screen, can say:

1. what Vision Forge sells (websites, apps and business systems),
2. that it is for businesses like theirs in Belize,
3. roughly what it costs (from BZ$500), and
4. how to start (message on WhatsApp).

Success means more WhatsApp and email enquiries that already state the business, the need, the budget and the timing.

## Audience

There are two audiences on one page, split clearly:

- **Small local businesses:** shops, restaurants, salons, tour operators and clinics.
- **Established companies and organisations:** teams, departments, paperwork and existing software.

## Writing rules

- No metaphors in headlines. No technical term unless a plain explanation sits next to it.
- Headlines use the display font in uppercase. All other text is sentence case, short, at reading level for a non-technical owner.
- No client names or claims of past results. Example visuals are labelled "Example".
- All prices are Belize dollars, written `BZ$`.

## Page order (`app/page.tsx`)

Anchor IDs: `home`, `what`, `build`, `how`, `pricing`, `faq`, `contact`.

### 1. Hero (`#home`)
- h1 (HeatText, display font): **WEBSITES, APPS AND BUSINESS SYSTEMS FOR BELIZEAN BUSINESSES.**
- Lede: "We design and build the tools your business runs on. Whether you need your first website or a system that replaces paper forms and spreadsheets, we build it, launch it and look after it."
- Buttons: **Message us on WhatsApp** (molten, opens `site.whatsapp.href`), **See what we can build** (ghost, `#what`).
- Trust line (mono, small): "Based in Belize · Prices from BZ$500 · Free first consultation".
- The logo stays on the right on ≥ lg and is smaller above the headline on mobile. Click sparks stay.

### 2. Two doors (`#what`)
- Heading: **WHICH SOUNDS LIKE YOU?**
- Two large tabs (a `role="tablist"` with two `role="tab"` buttons) that switch one panel. "Small business" is selected by default. Arrow keys move between tabs.
  - **I run a small business**: "A shop, restaurant, salon, tour operator or clinic."
  - **I run a company or organisation**: "Teams, departments, lots of paperwork, existing software."
- **Small business panel**
  - "Sound familiar?" list: "Customers can't find you on Google." "Orders and bookings get lost in WhatsApp messages." "You're still keeping records in a notebook."
  - "What we build" (4 items, each with a one-line plain explanation):
    - **A website people can find**: "Your hours, services, photos and a map, showing up when people search Google."
    - **Online orders or a shop**: "Customers order or pay online; you get every order in one place."
    - **Bookings and appointments**: "Clients pick a time themselves; you get reminders, not double-bookings."
    - **A simple app for your staff**: "Track jobs, stock or deliveries from a phone."
  - "Typical project: Launch or Grow tier · from BZ$500."
  - Example visual: a CSS/SVG phone showing an invented booking page ("Example: a salon booking page"), with no real business name.
- **Company panel**
  - "Sound familiar?" list: "Forms on paper or in spreadsheets." "Departments can't see each other's work." "Reports take days to put together." "Your software doesn't talk to your other software."
  - "What we build" (4 items):
    - **Staff portals and internal apps**: "One place for your team's work, with the right access for each role."
    - **Digital forms and checklists**: "Replace paper with forms on a phone or tablet, even offline."
    - **Automatic reports and dashboards**: "Live numbers instead of spreadsheets you rebuild every week."
    - **Connecting your systems**: "Make the software you already use share data automatically."
  - "Typical project: Custom tier · from BZ$8,000."
  - Example visual: a CSS/SVG laptop showing an invented dashboard and checklist ("Example: an operations dashboard").
- Each panel ends with **Build your project** (links to `#build`).

### 3. Project builder (`#build`)
See "Project builder" below.

### 4. How it works (`#how`)
- Heading: **HOW IT WORKS**
- Four numbered steps in a horizontal row on ≥ md and stacked on mobile. A heat line fills as the row scrolls into view, and it is static under reduced motion.
  1. **Talk**: "A free chat on WhatsApp, by phone or in person. Tell us what you need."
  2. **Plan and price**: "We send a written plan with a fixed price before any work starts."
  3. **Build**: "You see progress as we build and tell us what to change."
  4. **Launch and support**: "We put it live, show you how it works and stay on to help."

### 5. Pricing (`#pricing`)
- Heading: **CLEAR PRICES, NO SURPRISES**
- Lede: "Every project gets a fixed quote after a free chat. These are typical starting points."
- Three cards:
  - **Launch: from BZ$500** · usually 2–4 weeks. "A professional website or landing page, mobile-friendly, set up on Google, with contact and WhatsApp buttons."
  - **Grow: from BZ$2,500** · usually 4–8 weeks. "Everything in Launch, plus online orders or a shop, bookings, or a simple app."
  - **Custom: from BZ$8,000** · usually 8+ weeks. "Staff portals, digital forms, automation, dashboards and connections between your systems, built around how you work."
- Under the cards: "Not sure which fits? Tell us your budget in the builder above and we'll suggest what you can get." (links to `#build`).
- Tier data lives in `lib/site.ts` (`tiers`) and is shared with the builder.

### 6. Why us
- Short row of the five existing principles (10+ years experience, business focused, secure + scalable, real support, Belize based), as small stamped marks with no animation-dependent content.

### 7. FAQ (`#faq`)
- Heading: **QUESTIONS PEOPLE ASK**
- Native `<details>`/`<summary>` accordion (keyboard and screen-reader friendly with no JS):
  - **Do I need to know anything technical?** "No. Tell us how your business works in your own words; we handle the technical side and explain things plainly."
  - **How much will my project cost?** "It depends on what you need. Websites start from BZ$500, and every project gets a fixed written quote before work starts."
  - **How long does it take?** "Most websites take 2–4 weeks. Bigger systems take longer; your plan will include a timeline."
  - **Who owns the website or app?** "You do, once it's paid for. See our Terms of Service for details." (links to `/terms`)
  - **Can you fix or improve my existing website?** "Yes. Send us the link and tell us what's not working."
  - **Do you handle hosting and the domain?** "We can set up and manage hosting and your domain, or work with what you already have."
  - **What happens after launch?** "We show you how to use it and stay available for support, updates and new features."
- FAQ JSON-LD (`FAQPage`) is added from the same data, escaped like the existing JSON-LD.

### 8. Contact (`#contact`)
- The existing four contact tiles (sales and support emails, WhatsApp, Call) stay.
- Heading changes to **READY TO START? LET'S TALK.**
- Lede: "Message us on WhatsApp, call or email. The first consultation is free."

## Project builder

### Steps (single page, all visible, one tap per choice)
1. **What kind of business?** (single choice, required): `retail` Shop or retail · `food` Restaurant or food · `tourism` Tourism or hotel · `health` Health or beauty · `services` Professional services · `company` Company or organisation · `other` Something else.
2. **What do you need?** (multiple choice, at least one required): `website` A website · `orders` Online orders or a shop · `bookings` Bookings or appointments · `staffApp` A staff app or portal · `forms` Digital forms instead of paper · `reports` Reports or dashboards · `integrations` Connect my systems · `unsure` Not sure, help me decide. Choosing `unsure` clears the others, and choosing another option clears `unsure`.
3. **What's your budget?** (single, optional, default `unsure`): `under1k` Under BZ$1,000 · `to2500` BZ$1,000–2,500 · `to8000` BZ$2,500–8,000 · `over8000` BZ$8,000+ · `unsure` Not sure yet. Each option shows its hint: "A great starter website" / "A website with bookings or a small shop" / "A full online store, app or first business system" / "A custom system built around your operation" / "We'll suggest options".
4. **When do you need it?** (single, optional, default `exploring`): `asap` As soon as possible · `soon` Within 1–3 months · `exploring` Just exploring.

### Rules (`lib/project-builder.ts`, pure, no DOM)
- **Tier per need:** `website` → launch. `orders` and `bookings` → grow. `staffApp`, `forms`, `reports` and `integrations` → custom. `unsure` gives no tier.
- **Project tier** = the highest tier among the chosen needs (launch < grow < custom).
- **Tier data** comes from `site.tiers`: launch `{ from: 500, label: "Launch", weeks: "2–4 weeks" }`, grow `{ from: 2500, label: "Grow", weeks: "4–8 weeks" }`, custom `{ from: 8000, label: "Custom", weeks: "8+ weeks" }`.
- **Budget ceilings:** under1k 1000, to2500 2500, to8000 8000, over8000 ∞, unsure none.
- **Budget fit:**
  - `unknown` when the budget is `unsure` or the needs are only `unsure`.
  - `fits` when the ceiling ≥ the tier's `from`.
  - Otherwise `phase-one`, with `startTier` set to the highest tier whose `from` ≤ the ceiling.
- **Summary:** "{Needs} for your {business noun}." The needs are joined with commas and "and", and the first letter is capitalised.
  - Need phrases: website "a website", orders "online ordering", bookings "online bookings", staffApp "a staff app", forms "digital forms to replace paper", reports "automatic reports and dashboards", integrations "connections between your systems".
  - Business nouns: retail "shop", food "restaurant", tourism "tourism business", health "clinic or salon", services "business", company "organisation", other "business".
  - With `unsure` only: "Help choosing the right tools for your {noun}."
- **Card messages:**
  - fits: "Your budget fits this. Typical {Tier} projects start from BZ${from} and take {weeks}."
  - phase-one: "Your budget fits a smaller first version. We'd start with a {startTier label} project (from BZ${from}) and add the rest in a second phase."
  - unknown: "{Tier} projects start from BZ${from} and usually take {weeks}." With no tier, the message is "Tell us a bit about your business and we'll suggest the right starting point."
- **Message text:** "Hi Vision Forge! I run a {noun} and I'm interested in {needs phrase lowercased}. Budget: {budget label}. Timing: {timing label}. Can we talk?" It is trimmed to at most 500 characters.
- **Links:**
  - WhatsApp: `https://wa.me/5016157575?text=` + `encodeURIComponent(message)`.
  - Email: `mailHref` = `mailtoHref(site.sales.display, "Project enquiry")`, with the message as the body (`&body=` encoded).
- **Exports:** `NEEDS`, `BUSINESSES`, `BUDGETS`, `TIMINGS`, `toggleNeed(selected, need)`, `projectTier(needs)`, `budgetFit(tier, budget)`, `summarize(state)`, `buildMessage(state)`, `whatsappHref(state)`, `emailHref(state)`.
- **Complete** = a business is chosen and at least one need is chosen. The send buttons are disabled until then, with the helper text "Pick your business and what you need."

### Safe links
- `lib/safe-href.ts` is extended so that `isSafeNavigationHref` accepts `https://wa.me/5016157575?text=…`: only the `text` parameter is allowed, it must decode to at most 500 characters, and there is no hash.
- `mailtoHref` gains an optional `body` that goes through the same CR/LF and length checks (at most 500 characters).
- Existing security tests stay, and new cases are added.

### UI (`components/builder/`)
- **ProjectBuilder.tsx:** the four step groups as `role="radiogroup"` / checkbox groups of large tappable chips (min 44px). A selected chip uses the molten border, heat glow and `aria-pressed` / `aria-checked`.
- **ProjectCard.tsx:** sticky beside the steps on ≥ lg and below them on mobile. It shows the summary, tier, price, weeks and budget message, then the buttons **Send this on WhatsApp** (molten) and **Email it instead** (ghost). It is wrapped in an `aria-live="polite"` region. The card's border heat rises with completeness (0 → 1). A small spark emit fires when it first becomes complete, and none under reduced motion.
- Nothing is stored or sent until a button is pressed.

## Navigation and chrome
- Nav links: What we build (`/#what`) · Build your project (`/#build`) · Pricing (`/#pricing`) · FAQ (`/#faq`) · Contact (`/#contact`), plus a **WhatsApp** button on desktop.
- On < md, a fixed bottom bar shows **WhatsApp us** (molten) and **Call** (ghost), with `env(safe-area-inset-bottom)` padding. It is hidden when the contact section is in view. The page gets bottom padding so content isn't covered.
- Footer "Studio" links update to the new anchors. The legal pages are unchanged.
- Metadata: title "Websites, Apps & Business Systems in Belize | Vision Forge Studio". Description: "Vision Forge Studio builds websites, online stores, booking systems, staff apps and business systems for businesses in Belize. Prices from BZ$500. Free first consultation."

## Removed
- Components:
  - `Ignition`
  - `RawMaterials`
  - `Strike`, `StrikeGame`, `GameHud`, `ResultCard`, `clang`
  - `Process`, `Billet`
  - `ConnectedSystem`, `ArchitectureDiagram`
  - `Hallmarks` (replaced by WhyUs)
  - `Furnace` (replaced by Hero)
  - `Quench` (renamed to Contact)
- Lib: `forge-game.ts`, `connection-status.ts`.
- Storage keys: `vf-best` and `vf-ignited`. The ignition pre-paint script is removed from the layout.
- Tests: `forge-game.test.ts`, `connection-status.test.ts`.
- Copy in `site.ts`: `capabilities` (metal symbols), `architectureNodes`, `processSteps` (forge names).
- The cookies page drops the two storage keys and states that the site stores nothing in the browser.
- The disclaimer drops the game paragraph.
- The legal test is updated accordingly.
- Kept: `SparkField`, `HeatText`, `useHeat`, `heat.ts`, contact tiles, `EmailLink`, `CtaLink`, `Label`, `SectionHeading`, `Logo`, footer, legal layout, security headers, Cloudflare config, logo variants.

## Error handling
- Without JS, all content renders. The doors show both panels (the second panel is hidden only after hydration). The FAQ works natively. The builder shows a note: "Message us on WhatsApp and tell us what you need," with the link.
- If WhatsApp isn't installed, wa.me opens WhatsApp Web, which is the expected behaviour.

## Testing
- `tests/project-builder.test.ts`:
  - per-need tiers and the highest-tier rule;
  - budget fit for each ceiling, including the edge where the ceiling equals `from`;
  - phase-one `startTier`;
  - summary grammar for 1, 2 and 3+ needs, and the unsure-only case;
  - `toggleNeed` exclusivity of `unsure`;
  - message length cap;
  - WhatsApp and email hrefs pass `isSafeNavigationHref` and decode back to the message.
- `tests/security.test.ts`: the wa.me rules allow `?text=` only. Other params, a hash, more than 500 characters, or another number are rejected. `mailtoHref` with a body rejects CR/LF.
- `tests/clarity.test.ts`:
  - the hero h1 contains "websites, apps and business systems" (case-insensitive) and "Belize";
  - the hero trust line contains "BZ$500";
  - `site.tiers` has three tiers starting at 500, 2500 and 8000;
  - the FAQ has at least 6 items and its JSON-LD source is present;
  - no homepage source contains the retired forge jargon: the strings "Heat. Shape.", "Raw materials" or "Strike while", or a `metal:` field in `site.ts`.
- Existing contacts, legal, logo, deploy and heat tests stay. The legal and cookies expectations are updated.
- Manual checks:
  - tests, lint and the OpenNext build all pass;
  - screenshots at 390 and 1440 for every section, the builder in both empty and filled states, and the mobile bottom bar;
  - no horizontal scroll;
  - keyboard tabbing through the doors, builder and FAQ;
  - the "first-timer test": from the first screen alone, can a reader name what is sold, to whom, the starting price and how to make contact?

## Out of scope
Client case studies (pending permission), testimonials, a contact form or database, a blog, Spanish translation, and online payments.
