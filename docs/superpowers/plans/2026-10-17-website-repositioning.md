# Website Repositioning and Mahogany Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reposition visionforgestudio.app as a Belizean-owned "local tech partner" with a journey-style page structure (Home, Services, How we work, About, Get started), a light "Mahogany" visual system, two pricing lanes instead of a pricing calculator, and a contact form that emails sales@ instead of phone/WhatsApp contact.

**Spec:** `docs/superpowers/specs/2026-10-17-website-repositioning-design.md`

**Architecture:** Next.js App Router, statically prerendered pages on Cloudflare Workers via OpenNext. All copy lives in `lib/site.ts` (no imports, so `node --test` can load it). Form validation and the request handler are pure functions in `lib/contact.ts`; network calls (Turnstile verify, Resend send) live in `lib/contact-delivery.ts` with an injectable `fetch`, so both are unit-testable. One dynamic route, `app/api/contact/route.ts`, wires them to Worker secrets through `getCloudflareContext()`.

**Tech Stack:** Next 16.3.8 (pinned), React 19.3, Tailwind CSS 4, lucide-react, `node --experimental-strip-types --test`, @opennextjs/cloudflare + Wrangler, Cloudflare Turnstile, Resend.

**Before writing Next.js code:** this repo's `AGENTS.md` warns that Next 16 differs from older versions. Read `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` (Task 5) and `node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md` (Task 6) before those tasks.

## Global Constraints

- `next` and `eslint-config-next` stay pinned at exactly `16.3.8` (`tests/deploy.test.ts`).
- Only public contact: the contact form and `sales@visionforgestudio.app`. No phone numbers, `tel:` links, `wa.me` links, WhatsApp buttons or `support@visionforgestudio.app` anywhere in `app/`, `components/` or `lib/`.
- Always "we" / "our team". Never a headcount, names or roles.
- Two pricing lanes, no feature lists: "Small businesses" with "From BZ$500", and "Growing teams and established companies" with "Let's talk".
- Training and ongoing support are optional. Never present them as included by default.
- Reply promise: "We'll reply within one business day."
- Visual tokens (exact): ink `#1F3B2D`, mahogany `#8A3B22`, body text `#46524B`, muted `#4A5560`, mist `#EEF1EC`, paper `#FFFFFF`. All text pairs ≥ 4.5:1.
- Type: Literata (headings) + Public Sans (body/UI), self-hosted woff2 via `next/font/local`. No Google Fonts requests (CSP `font-src 'self'`).
- Body 17px mobile / 18px desktop, line-height ~1.65, paragraphs ≤ ~68 characters wide.
- Sentence case everywhere. No all-caps eyebrow labels, no single-word headline accents, no `→` appended to link text. Numbered markers only for real sequences (the four stages, the four how-we-work steps).
- Motion: only hover/focus feedback, form state changes and the user-triggered Workbench demo. Respect `prefers-reduced-motion`.
- Visible keyboard focus, 44px+ tap targets, no horizontal scroll at 360px.
- Emails lowercase; the business is never called "Ltd"/"Limited"; footer keeps the registration line.
- Every `target="_blank"` has `rel="noopener noreferrer"`; app source never reads `process.env` or `NEXT_PUBLIC_*`.
- Old URLs answer with HTTP 301: `/pricing` and `/contact` → `/get-started`, `/automation` → `/services#improve`, `/websites` → `/services#build`.

## Owner prerequisites (needed only for Task 14's launch steps)

1. A Resend account with `visionforgestudio.app` verified as a sending domain (DNS records added in Cloudflare) and an API key.
2. A Cloudflare Turnstile widget for `visionforgestudio.app` (site key + secret key).

Until then, development uses Cloudflare's published Turnstile test keys, which always pass: site key `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`.

## File map

| File | Status | Responsibility |
|---|---|---|
| `app/globals.css` | Rewrite (T2) | Mahogany tokens, base type, legal prose, strike-through, print |
| `app/fonts/literata-var.woff2`, `app/fonts/public-sans-var.woff2` | Create (T2) | Self-hosted fonts |
| `app/layout.tsx` | Modify (T2, T7) | Fonts, light viewport, chrome, JSON-LD |
| `lib/site.ts` | Modify (T3, T7, T13) | All copy and nav |
| `lib/contact.ts` | Create (T4) | Form fields, validation, email body, request handler |
| `lib/contact-delivery.ts` | Create (T5) | Turnstile verify + Resend send with injectable fetch |
| `app/api/contact/route.ts` | Create (T5) | POST endpoint wiring handler to Worker secrets |
| `lib/security-headers.ts` | Modify (T5) | CSP allows Turnstile script + iframe |
| `next.config.ts`, `app/sitemap.ts` | Modify (T6) | 301 redirects, new routes |
| `lib/safe-href.ts` | Modify (T7) | Drop tel and wa.me allowances |
| `components/ui/CtaLink.tsx`, `EmailLink.tsx`, `SectionHeading.tsx` | Rewrite (T7) | Restyled primitives |
| `components/layout/*` | Rewrite (T7) | Navbar, Footer, GetStartedBar, PageHeader, ClosingBand, LegalLayout |
| `components/sections/Faq.tsx` | Rewrite (T7) | Restyled FAQ taking `items` |
| `components/sections/ContactForm.tsx`, `ContactSection.tsx`, `Lanes.tsx` | Create (T8) | Contact form, its section, pricing lanes |
| `app/get-started/page.tsx` | Create (T8) | Lanes + form |
| `components/sections/Hero.tsx`, `Workbench.tsx`, `Industries.tsx` | Rewrite (T9) | Home sections |
| `components/sections/Pains.tsx`, `Stages.tsx`, `WhyUs.tsx` | Create (T9) | Home sections |
| `components/sections/ServiceStage.tsx`, `ImproveExamples.tsx`, `app/services/page.tsx` | Create (T10) | Services page |
| `components/sections/ProcessSteps.tsx`, `app/how-we-work/page.tsx` | Create/Rewrite (T11) | How we work page |
| `app/about/page.tsx` | Create (T12) | About page |
| Old pages and sections | Delete (T6, T9, T11) | Superseded |

Tests live in `tests/*.test.ts` and run with `npm test`; one file runs with `node --experimental-strip-types --test tests/<name>.test.ts`.

**Type checking:** `LayoutProps` and other route types are generated by Next, so every type check runs `npx next typegen` first (it writes to the git-ignored `.next/types`).

**Build state between tasks:** `npm test`, `npx next typegen && npx tsc --noEmit` and `npm run lint` must pass at the end of every task from Task 2 on. Between Task 2 and Task 9 the old home and how-we-work components still render with the dark-theme class names, which no longer exist, so those pages look unstyled until they're rebuilt. That's expected.

---

### Task 1: Put the spec and plan in the repo

**Files:**
- Create: `docs/superpowers/specs/2026-10-17-website-repositioning-design.md` (already copied in)
- Create: `docs/superpowers/plans/2026-10-17-website-repositioning.md` (this file)

- [ ] **Step 1: Confirm both files exist**

Run: `ls docs/superpowers/specs/2026-10-17-website-repositioning-design.md docs/superpowers/plans/2026-10-17-website-repositioning.md`
Expected: both paths printed, no "No such file".

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-10-17-website-repositioning-design.md docs/superpowers/plans/2026-10-17-website-repositioning.md
git commit -m "docs: spec and plan for the partner repositioning and Mahogany redesign"
```

---

### Task 2: Mahogany visual foundation (tokens, fonts, base styles)

**Files:**
- Rewrite: `app/globals.css`
- Create: `app/fonts/literata-var.woff2`, `app/fonts/public-sans-var.woff2`
- Delete: `app/fonts/archivo-var.woff2`, `app/fonts/instrument-sans-var.woff2`, `app/fonts/plex-mono-500.woff2`, `app/fonts/caveat-600.woff2`
- Modify: `app/layout.tsx` (font loaders, viewport, `<html>`/`<body>` classes, skip link)
- Rewrite test: `tests/design.test.ts`

**Interfaces:**
- Produces Tailwind utilities used by every later task: colors `ink`, `ink-hover`, `mahogany`, `body`, `muted`, `mist`, `paper`, `line`, `on-ink-2`, `success`, `danger` (e.g. `text-ink`, `bg-mist`, `border-line`); fonts `font-serif` (Literata) and `font-sans` (Public Sans).
- Produces CSS classes `.strike` (with `data-struck="true"`), `.legal-prose`, `.site-header[data-scrolled="true"] .nav-shell`, `.no-print`.

- [ ] **Step 1: Write the failing test**

Replace all of `tests/design.test.ts` with:

```ts
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const css = read("app/globals.css");

function token(name: string): string {
  const match = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(match, `missing token --${name}`);
  return match[1];
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

test("mahogany tokens have the agreed values and the dark theme is gone", () => {
  assert.equal(token("ink").toLowerCase(), "#1f3b2d");
  assert.equal(token("mahogany").toLowerCase(), "#8a3b22");
  assert.equal(token("body").toLowerCase(), "#46524b");
  assert.equal(token("muted").toLowerCase(), "#4a5560");
  assert.equal(token("mist").toLowerCase(), "#eef1ec");
  assert.equal(token("paper").toLowerCase(), "#ffffff");
  for (const name of ["ink-hover", "line", "on-ink-2", "success", "danger"]) token(name);
  for (const old of ["--bg:", "--steel", "--gold", "--paper-ink", "color-scheme: dark", "@keyframes glint", "@keyframes marquee", ".paper-torn", ".font-wide"]) {
    assert.ok(!css.includes(old), old);
  }
  assert.match(css, /color-scheme: light/);
});

test("text colour pairs pass WCAG AA (4.5:1)", () => {
  const pairs: Array<[string, string]> = [
    ["ink", "paper"],
    ["ink", "mist"],
    ["body", "paper"],
    ["body", "mist"],
    ["muted", "paper"],
    ["muted", "mist"],
    ["mahogany", "paper"],
    ["mahogany", "mist"],
    ["paper", "ink"],
    ["paper", "ink-hover"],
    ["on-ink-2", "ink"],
    ["success", "paper"],
    ["danger", "paper"],
  ];
  for (const [fg, bg] of pairs) {
    const ratio = contrast(token(fg), token(bg));
    assert.ok(ratio >= 4.5, `${fg} on ${bg} is ${ratio.toFixed(2)}`);
  }
});

test("two self-hosted faces: Literata for headings, Public Sans for body", () => {
  const layout = read("app/layout.tsx");
  for (const font of ["literata-var", "public-sans-var"]) {
    const file = new URL(`app/fonts/${font}.woff2`, root);
    assert.ok(existsSync(file), font);
    assert.equal(readFileSync(file).subarray(0, 4).toString("latin1"), "wOF2", `${font} is not woff2`);
    assert.match(layout, new RegExp(`${font}\\.woff2`));
  }
  for (const gone of ["archivo-var", "instrument-sans-var", "plex-mono-500", "caveat-600"]) {
    assert.equal(existsSync(new URL(`app/fonts/${gone}.woff2`, root)), false, gone);
    assert.doesNotMatch(layout, new RegExp(gone));
  }
  assert.doesNotMatch(layout, /fonts\.googleapis/);
  assert.match(layout, /colorScheme: "light"/);
  assert.match(css, /--font-serif: var\(--font-literata\)/);
  assert.match(css, /--font-sans: var\(--font-public-sans\)/);
});

test("body text is 17px on phones and 18px from tablet up", () => {
  assert.match(css, /font-size: 1\.0625rem/);
  assert.match(css, /@media \(min-width: 768px\)\s*\{\s*body\s*\{\s*font-size: 1\.125rem/);
  assert.match(css, /line-height: 1\.65/);
});

test("no decorative keyframes; strike-through respects reduced motion", () => {
  assert.doesNotMatch(css, /@keyframes/);
  const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  assert.ok(reduced.includes(".strike"));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/design.test.ts`
Expected: FAIL. `missing token --ink` and the font assertions fail.

- [ ] **Step 3: Fetch the two fonts from npm and remove the old four**

```bash
TMP=$(mktemp -d)
(cd "$TMP" && npm pack @fontsource-variable/literata@5 @fontsource-variable/public-sans@5 >/dev/null \
  && tar xzf fontsource-variable-literata-*.tgz package/files/literata-latin-wght-normal.woff2 \
  && tar xzf fontsource-variable-public-sans-*.tgz package/files/public-sans-latin-wght-normal.woff2)
cp "$TMP/package/files/literata-latin-wght-normal.woff2" app/fonts/literata-var.woff2
cp "$TMP/package/files/public-sans-latin-wght-normal.woff2" app/fonts/public-sans-var.woff2
git rm -q app/fonts/archivo-var.woff2 app/fonts/instrument-sans-var.woff2 app/fonts/plex-mono-500.woff2 app/fonts/caveat-600.woff2
ls -l app/fonts
```

Expected: `ls` shows only `literata-var.woff2` and `public-sans-var.woff2`, each 20–120 KB.

- [ ] **Step 4: Replace `app/globals.css`**

```css
@import "tailwindcss";

:root {
  --ink: #1f3b2d;
  --ink-hover: #2a4d3b;
  --mahogany: #8a3b22;
  --body: #46524b;
  --muted: #4a5560;
  --mist: #eef1ec;
  --paper: #ffffff;
  --line: #d5dbd3;
  --on-ink-2: #b7c3ba;
  --success: #2f6b3f;
  --danger: #a1301c;
  --nav-h: 4.5rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  color-scheme: light;
}

@theme inline {
  --color-ink: var(--ink);
  --color-ink-hover: var(--ink-hover);
  --color-mahogany: var(--mahogany);
  --color-body: var(--body);
  --color-muted: var(--muted);
  --color-mist: var(--mist);
  --color-paper: var(--paper);
  --color-line: var(--line);
  --color-on-ink-2: var(--on-ink-2);
  --color-success: var(--success);
  --color-danger: var(--danger);
  --font-serif: var(--font-literata), Georgia, "Times New Roman", serif;
  --font-sans: var(--font-public-sans), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
}

html {
  scroll-padding-top: var(--nav-h);
}

html,
body {
  overflow-x: clip;
  background: var(--paper);
}

body {
  color: var(--body);
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.65;
  text-rendering: optimizeLegibility;
}

@media (min-width: 768px) {
  body {
    font-size: 1.125rem;
  }
}

::selection {
  background: var(--ink);
  color: var(--paper);
}

@layer base {
  :focus-visible {
    outline: 2px solid var(--mahogany);
    outline-offset: 3px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

/* ---------- Workbench demo: a line struck through when a step is handled ---------- */

.strike {
  background: linear-gradient(var(--mahogany), var(--mahogany)) left 55% / 0 2px no-repeat;
  transition: background-size 450ms var(--ease-out), color 450ms var(--ease-out);
}

.strike[data-struck="true"] {
  background-size: 100% 2px;
  color: var(--muted);
}

/* ---------- header ---------- */

.site-header[data-scrolled="true"] .nav-shell {
  background: rgb(255 255 255 / 0.94);
  backdrop-filter: blur(10px);
}

/* ---------- legal ---------- */

.legal-prose h2 {
  font-family: var(--font-serif);
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 1.25;
  color: var(--ink);
  margin-top: 3rem;
  scroll-margin-top: calc(var(--nav-h) + 1.5rem);
}

.legal-prose p,
.legal-prose li {
  color: var(--body);
  margin-top: 1rem;
}

.legal-prose ul {
  list-style: disc;
  padding-left: 1.25rem;
}

.legal-prose a {
  color: var(--mahogany);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.legal-prose strong {
  color: var(--ink);
  font-weight: 600;
}

@media print {
  .no-print {
    display: none !important;
  }

  html,
  body {
    background: #fff !important;
    color: #000 !important;
  }

  .legal-prose h2,
  .legal-prose p,
  .legal-prose li,
  .legal-prose strong {
    color: #000 !important;
  }

  .legal-prose a::after {
    content: " (" attr(href) ")";
  }
}

/* ---------- motion safety ---------- */

@media (prefers-reduced-motion: reduce) {
  .strike {
    transition: none;
  }
}

@media (prefers-reduced-transparency: reduce) {
  .site-header[data-scrolled="true"] .nav-shell {
    background: var(--paper);
    backdrop-filter: none;
  }
}
```

- [ ] **Step 5: Update fonts, viewport and base classes in `app/layout.tsx`**

Replace the four `localFont(...)` declarations (`archivo`, `instrument`, `plex`, `caveat`) with:

```ts
const literata = localFont({
  src: "./fonts/literata-var.woff2",
  variable: "--font-literata",
  weight: "200 900",
  display: "swap",
});

const publicSans = localFont({
  src: "./fonts/public-sans-var.woff2",
  variable: "--font-public-sans",
  weight: "100 900",
  display: "swap",
});
```

Replace the `viewport` export with:

```ts
export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};
```

Replace the opening `<html …>` tag, `<body …>` tag and the skip link (everything from `<html` through the closing `</a>` of the skip link) with:

```tsx
    <html lang="en" className={`${literata.variable} ${publicSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-paper pb-[calc(4.75rem+env(safe-area-inset-bottom))] font-sans text-body antialiased md:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
```

- [ ] **Step 6: Run the tests and type check**

Run: `node --experimental-strip-types --test tests/design.test.ts && npx next typegen && npx tsc --noEmit && npm run lint`
Expected: design tests PASS; tsc and lint exit 0.

- [ ] **Step 7: Commit**

```bash
git add app/globals.css app/fonts app/layout.tsx tests/design.test.ts
git commit -m "feat: Mahogany tokens, Literata + Public Sans, light base styles"
```

---

### Task 3: New site copy in `lib/site.ts`

This task only adds exports. The old ones stay until Task 13 so existing components keep compiling.

**Files:**
- Modify: `lib/site.ts` (append a block at the end of the file)
- Create test: `tests/content.test.ts`

**Interfaces:**
- Produces (all exported from `lib/site.ts`):
  - `primaryNav: readonly { href: "/services" | "/how-we-work" | "/about"; label: string }[]`
  - `replyPromise: string`
  - `home: { headline; lede; primary: {label, href}; secondary: {label, href}; trust: readonly string[] }`
  - `pains: readonly { id: string; quote: string; answer: string }[]` (4 items)
  - `type StageId = "understand" | "improve" | "build" | "support"`
  - `type Stage = { id: StageId; name: string; title: string; summary: string; needIf: readonly string[]; weDo: readonly string[]; optional: boolean }`
  - `stages: readonly Stage[]` (4 items, in that order)
  - `improveExamples: readonly { id: string; pain: string; fix: string }[]` (5 items)
  - `type FeaturedIndustryIcon = "cart" | "food" | "palm" | "health" | "briefcase" | "store"`
  - `featuredIndustries: readonly { id: string; icon: FeaturedIndustryIcon; name: string; copy: string }[]` (6 items)
  - `moreIndustries: readonly string[]` (lowercase, used inside a sentence)
  - `whyUs: readonly { title: string; copy: string }[]` (3 items)
  - `lanes: readonly { id: "small" | "growing"; title: string; price: string; copy: string }[]`
  - `lanesNote: { text: string; href: "/disclaimer#estimates"; linkLabel: string }`
  - `howWeWorkSteps: readonly { title: string; copy: string }[]` (4 items)
  - `afterLaunch: { title: string; copy: string }`
  - `questions: readonly { q: string; a: string; link?: { href: string; label: string } }[]`
  - `about: { title; lede; story: readonly string[]; beliefs: readonly {title, copy}[]; owned: string }`
  - `closing: { title: string; copy: string; cta: { label: string; href: "/get-started" } }`

- [ ] **Step 1: Write the failing test**

Create `tests/content.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  about,
  afterLaunch,
  closing,
  featuredIndustries,
  home,
  howWeWorkSteps,
  improveExamples,
  lanes,
  lanesNote,
  moreIndustries,
  pains,
  primaryNav,
  questions,
  replyPromise,
  stages,
  whyUs,
} from "../lib/site.ts";

const allCopy = JSON.stringify({
  about,
  afterLaunch,
  closing,
  featuredIndustries,
  home,
  howWeWorkSteps,
  improveExamples,
  lanes,
  lanesNote,
  moreIndustries,
  pains,
  primaryNav,
  questions,
  replyPromise,
  stages,
  whyUs,
});

test("the hero leads with partnership and points to the form", () => {
  assert.equal(home.headline, "Your local tech partner. We bring business ideas to life.");
  assert.match(home.lede, /^A Belizean-owned team/);
  assert.equal(home.primary.href, "/get-started");
  assert.equal(home.primary.label, "Tell us about your business");
  assert.equal(home.secondary.href, "/how-we-work");
  assert.deepEqual([...home.trust], ["Belizean-owned", "Projects from BZ$500", "Free first conversation"]);
});

test("four pains, one of them not about technology", () => {
  assert.equal(pains.length, 4);
  assert.ok(pains.some((p) => /falling through the cracks/.test(p.quote)));
});

test("four stages in order; support is the only optional one", () => {
  assert.deepEqual(
    stages.map((s) => s.id),
    ["understand", "improve", "build", "support"],
  );
  assert.deepEqual(
    stages.map((s) => s.optional),
    [false, false, false, true],
  );
  for (const stage of stages) {
    assert.ok(stage.needIf.length >= 2 && stage.needIf.length <= 4, stage.id);
    assert.ok(stage.weDo.length >= 2, stage.id);
  }
  assert.equal(improveExamples.length, 5);
});

test("two lanes: small businesses from BZ$500, bigger work starts with a conversation", () => {
  assert.deepEqual(
    lanes.map((l) => [l.id, l.title, l.price]),
    [
      ["small", "Small businesses", "From BZ$500"],
      ["growing", "Growing teams and established companies", "Let's talk"],
    ],
  );
  assert.equal(lanesNote.href, "/disclaimer#estimates");
});

test("how we work: four steps, then optional training and support", () => {
  assert.equal(howWeWorkSteps.length, 4);
  assert.match(howWeWorkSteps[3].title, /hand it over/);
  assert.match(afterLaunch.title, /^Optional/);
});

test("training and support are offered, never assumed", () => {
  assert.match(whyUs[2].copy, /if you want|when you'd like|if you'd like/i);
  const afterLaunchQ = questions.find((q) => q.q === "What happens after launch?");
  assert.ok(afterLaunchQ);
  assert.match(afterLaunchQ.a, /if you'd like/i);
  for (const step of howWeWorkSteps) assert.doesNotMatch(step.title, /train|support/i);
});

test("copy never states team size, names or roles", () => {
  assert.doesNotMatch(
    allCopy,
    /\b(two|2|three|3)[- ](person|people|man)\b|\bfounders?\b|\bco-?founder\b|\bour (boss|partner|developer|salesperson)\b|\bShamira\b|\bGlenrick\b|\bNonchalant\b/i,
  );
});

test("no phone, WhatsApp link or support address in the new copy", () => {
  assert.doesNotMatch(allCopy, /wa\.me|tel:|\+501|615-?7575|613-?9219|support@/);
});

test("nav, reply promise and closing", () => {
  assert.deepEqual(
    primaryNav.map((n) => n.href),
    ["/services", "/how-we-work", "/about"],
  );
  assert.equal(replyPromise, "We'll reply within one business day to set up a free conversation.");
  assert.equal(closing.cta.href, "/get-started");
});

test("FAQ covers the agreed questions", () => {
  const qs: string[] = questions.map((q) => q.q);
  for (const q of [
    "Do I need to be tech-savvy?",
    "We're a small business. Is this for us?",
    "Who owns what you build?",
    "What happens after launch?",
    "How long does a project take?",
  ]) {
    assert.ok(qs.includes(q), q);
  }
});

test("industries: six featured, the rest named in a sentence", () => {
  assert.equal(featuredIndustries.length, 6);
  assert.ok(moreIndustries.length >= 8);
  for (const name of moreIndustries) assert.equal(name, name.toLowerCase(), name);
});

test("about keeps the registration and stays headcount-free", () => {
  assert.match(about.owned, /Belizean-owned/);
  assert.match(about.owned, /000058528/);
  assert.equal(about.beliefs.length, 3);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/content.test.ts`
Expected: FAIL with a SyntaxError that `lib/site.ts` does not provide an export named `about`.

- [ ] **Step 3: Append the new copy to `lib/site.ts`**

Add this block at the very end of `lib/site.ts`:

```ts
// ---------- Partner repositioning (October 2026) ----------

export const primaryNav = [
  { href: "/services", label: "Services" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/about", label: "About" },
] as const;

export const replyPromise = "We'll reply within one business day to set up a free conversation.";

export const home = {
  headline: "Your local tech partner. We bring business ideas to life.",
  lede: "A Belizean-owned team that learns how your business really runs, fixes what's slowing it down, and builds the technology to keep it moving.",
  primary: { label: "Tell us about your business", href: "/get-started" },
  secondary: { label: "See how we work", href: "/how-we-work" },
  trust: ["Belizean-owned", "Projects from BZ$500", "Free first conversation"],
} as const;

export const pains = [
  {
    id: "cracks",
    quote: "Things keep falling through the cracks and I can't see where.",
    answer: "We map how work moves through your business and show you exactly where it gets stuck.",
  },
  {
    id: "payments",
    quote: "I chase people to pay every week.",
    answer: "Payment reminders that go out on their own, by WhatsApp or email.",
  },
  {
    id: "reports",
    quote: "Every Friday I rebuild the same report.",
    answer: "A live dashboard that keeps itself up to date.",
  },
  {
    id: "forms",
    quote: "My staff still fill in paper forms.",
    answer: "Forms on a phone that go straight into your records.",
  },
] as const;

export type StageId = "understand" | "improve" | "build" | "support";

export type Stage = {
  id: StageId;
  name: string;
  title: string;
  summary: string;
  needIf: readonly string[];
  weDo: readonly string[];
  optional: boolean;
};

export const stages: readonly Stage[] = [
  {
    id: "understand",
    name: "Understand",
    title: "Business review and consultation",
    summary: "We learn how your business really runs, find what's slowing it down, and tell you plainly what to fix first.",
    needIf: [
      "You're busy every day but can't see where the time goes",
      "You know something needs to change, but not what",
      "You want an honest opinion before spending on new software",
    ],
    weDo: [
      "Sit with you and your team to see how work actually flows",
      "Spot bottlenecks, double work and things worth upgrading",
      "Give you a clear plan, in plain language, with what to do first",
    ],
    optional: false,
  },
  {
    id: "improve",
    name: "Improve",
    title: "Process improvement and automation",
    summary: "We take repetitive, manual work off your plate and connect the tools you already use so they work together.",
    needIf: [
      "You or your staff copy the same information from place to place",
      "Invoices, reminders or reports are still done by hand",
      "Your sales and your books never quite match",
    ],
    weDo: [
      "Simplify the steps before we automate anything",
      "Automatic invoices, reminders and follow-ups",
      "Connect WhatsApp, spreadsheets and your accounting software",
      "Live dashboards that update themselves",
    ],
    optional: false,
  },
  {
    id: "build",
    name: "Build",
    title: "Websites and custom builds",
    summary: "From a professional website to a system built around how you work, we bring the idea to life.",
    needIf: [
      "Customers can't find you online",
      "You sell on social media and orders get lost in messages",
      "You have an idea for an app, portal or system that doesn't exist yet",
    ],
    weDo: [
      "Business websites, online stores and booking sites",
      "Catalogues for selling through Instagram, Facebook and WhatsApp",
      "Custom systems, staff portals and apps built around your business",
    ],
    optional: false,
  },
  {
    id: "support",
    name: "Support",
    title: "Training and ongoing support",
    summary: "Want your team trained or someone on call after launch? We can stay on, project by project.",
    needIf: [
      "Your team is new to the tools we've set up",
      "You'd rather not handle updates and fixes yourself",
    ],
    weDo: ["Hands-on training for your staff", "Fixes, updates and improvements after launch"],
    optional: true,
  },
];

export const improveExamples = [
  { id: "payments", pain: "I chase people to pay every week.", fix: "Automatic payment reminders on WhatsApp or email." },
  { id: "forms", pain: "My staff still fill in paper forms.", fix: "Forms on a phone that go straight into a report." },
  { id: "bookings", pain: "Bookings get lost in my messages.", fix: "Customers book themselves, and you get reminders." },
  { id: "reports", pain: "Every Friday I rebuild the same report.", fix: "A live dashboard that updates itself." },
  { id: "accounts", pain: "My sales and my accounts never match up.", fix: "Your sales flow straight into your books." },
] as const;

export type FeaturedIndustryIcon = "cart" | "food" | "palm" | "health" | "briefcase" | "store";

export const featuredIndustries = [
  {
    id: "ecommerce",
    icon: "cart",
    name: "Online stores and social sellers",
    copy: "Catalogues, checkout and every order landing in one place.",
  },
  {
    id: "food",
    icon: "food",
    name: "Restaurants and food delivery",
    copy: "Menus, online ordering and delivery updates without the message chaos.",
  },
  {
    id: "tourism",
    icon: "palm",
    name: "Tourism, tours and hotels",
    copy: "Bookings, deposits and guest reminders, ready for visitors from anywhere.",
  },
  {
    id: "health",
    icon: "health",
    name: "Clinics, salons and wellness",
    copy: "Appointments, reminders and client records in one calm system.",
  },
  {
    id: "services",
    icon: "briefcase",
    name: "Professional services",
    copy: "Quotes, invoices and client follow-ups that go out on time.",
  },
  {
    id: "retail",
    icon: "store",
    name: "Retail and wholesale",
    copy: "Stock, sales and reorders that finally match your books.",
  },
] as const satisfies ReadonlyArray<{ id: string; icon: FeaturedIndustryIcon; name: string; copy: string }>;

export const moreIndustries = [
  "logistics and delivery",
  "hardware stores",
  "real estate",
  "schools and training",
  "non-profits",
  "auto parts",
  "bakeries",
  "gyms",
  "event planners",
  "car rentals",
  "pharmacies",
  "construction",
  "property management",
] as const;

export const whyUs = [
  {
    title: "Local and Belizean-owned",
    copy: "We know how business works here, from WhatsApp orders to cash on delivery, and we're close by when you need us.",
  },
  {
    title: "We learn before we suggest",
    copy: "We take the time to understand your business first, so what we recommend fits how you actually work.",
  },
  {
    title: "Support if you want it",
    copy: "Training for your team and help after launch are there if you want them, not built into every project.",
  },
] as const;

export const lanes = [
  {
    id: "small",
    title: "Small businesses",
    price: "From BZ$500",
    copy: "A clear, affordable starting point for shops, sellers and growing local businesses. We scope it with you and send a fixed quote.",
  },
  {
    id: "growing",
    title: "Growing teams and established companies",
    price: "Let's talk",
    copy: "More people, more processes, more systems. We start with a conversation and shape the work around your business.",
  },
] as const;

export const lanesNote = {
  text: "Prices are starting points. Your final price is confirmed in a written quote before any work starts.",
  href: "/disclaimer#estimates",
  linkLabel: "Read more",
} as const;

export const howWeWorkSteps = [
  {
    title: "A free first conversation",
    copy: "Tell us about your business and what's slowing you down. No cost and no pressure.",
  },
  {
    title: "We learn how your business runs",
    copy: "We look at how work really moves through your business, together with you and your team.",
  },
  {
    title: "A written plan and a fixed quote",
    copy: "You see exactly what we'll do and what it costs before anything starts.",
  },
  {
    title: "We build and test it with you, then hand it over",
    copy: "We test with your real work, adjust what needs adjusting, and hand over something your team can use.",
  },
] as const;

export const afterLaunch = {
  title: "Optional: training and ongoing support",
  copy: "If you'd like, we can train your staff on what we've built and stay on for fixes, updates and the next idea. It's your choice, project by project.",
} as const;

export const questions = [
  {
    q: "Do I need to be tech-savvy?",
    a: "No. Tell us how your business works in your own words. We handle the technical side and explain everything plainly.",
  },
  {
    q: "We're a small business. Is this for us?",
    a: "Yes. Many of the businesses we help are small, and projects start from BZ$500. We'll suggest a sensible first step for your size and budget.",
  },
  {
    q: "Do I have to change the software I already use?",
    a: "Usually not. Most of the time we improve and connect what you already have.",
  },
  {
    q: "Who owns what you build?",
    a: "You do, once it's paid for.",
    link: { href: "/terms", label: "See our Terms of Service" },
  },
  {
    q: "What happens after launch?",
    a: "It's yours to run. If you'd like, we can train your team and stay on for support, updates and new ideas.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on the size of the work. Smaller projects often take a few weeks, and your quote always includes a timeline.",
  },
] as const satisfies ReadonlyArray<{ q: string; a: string; link?: { href: string; label: string } }>;

export const about = {
  title: "Technology that fits how Belize does business.",
  lede: "We help businesses big and small run better, by understanding how they work and building what they need.",
  story: [
    "Vision Forge started with a simple idea: businesses in Belize deserve technology that fits the way they actually work. Too often, software gets bought first and the business is bent to fit it. We do it the other way round.",
    "We listen like business owners and build like engineers, so what we make fits your day-to-day, not just a feature list.",
    "Sometimes the answer is a new website or an app. Sometimes it's a simpler process and a couple of tools talking to each other. We'll tell you which, plainly.",
  ],
  beliefs: [
    { title: "Learn first", copy: "We understand your business before we recommend anything." },
    { title: "Explain plainly", copy: "No jargon. You'll always know what we're doing and why." },
    { title: "Build things people use", copy: "If your team won't use it, it isn't finished." },
  ],
  owned: `We're Belizean-owned and registered in Belize as ${site.legal.registeredName} (Reg. No. ${site.legal.registrationNumber}), trading as ${site.legal.tradingName}.`,
} as const;

export const closing = {
  title: "Tell us what's slowing you down.",
  copy: "The first conversation is free. We'll reply within one business day.",
  cta: { label: "Tell us about your business", href: "/get-started" },
} as const;
```

- [ ] **Step 4: Run tests and type check**

Run: `node --experimental-strip-types --test tests/content.test.ts && npx next typegen && npx tsc --noEmit`
Expected: all content tests PASS; tsc exits 0.

- [ ] **Step 5: Commit**

```bash
git add lib/site.ts tests/content.test.ts
git commit -m "feat: copy for the partner positioning, stages, lanes and new pages"
```

---

### Task 4: Contact form logic (validation, email body, handler)

**Files:**
- Create: `lib/contact.ts`
- Create test: `tests/contact.test.ts`

**Interfaces:**
- Produces (from `lib/contact.ts`, no imports):
  - `TURNSTILE_SITE_KEY: string` (public site key; Cloudflare test key until launch)
  - `SALES_INBOX = "sales@visionforgestudio.app"`
  - `HONEYPOT_FIELD = "website"`
  - `LANE_OPTIONS: readonly { id: "small" | "growing" | "unsure"; label: string }[]`
  - `type Lane`, `CONTACT_FIELDS` (`["name","business","email","whatTheyDo","slowingDown","lane"]`), `type ContactField`
  - `FIELD_LIMITS: Record<"name"|"business"|"email"|"whatTheyDo"|"slowingDown", number>`
  - `type ContactData`, `type ContactErrors = Partial<Record<ContactField, string>>`
  - `validateContact(raw: unknown): { ok: true; data: ContactData } | { ok: false; errors: ContactErrors }`
  - `isLikelyBot(raw: unknown): boolean`
  - `type OutgoingEmail = { to: string; replyTo: string; subject: string; text: string }`
  - `buildEnquiryEmail(data: ContactData): OutgoingEmail`
  - `type ContactResponse = { ok: true } | { ok: false; reason: "invalid"; errors: ContactErrors } | { ok: false; reason: "verification" } | { ok: false; reason: "failed" }`
  - `type ContactDeps = { verifyToken(token: string): Promise<boolean>; send(email: OutgoingEmail): Promise<boolean> }`
  - `handleContact(raw: unknown, deps: ContactDeps): Promise<{ status: number; body: ContactResponse }>`

- [ ] **Step 1: Write the failing test**

Create `tests/contact.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  buildEnquiryEmail,
  CONTACT_FIELDS,
  handleContact,
  HONEYPOT_FIELD,
  isLikelyBot,
  LANE_OPTIONS,
  SALES_INBOX,
  validateContact,
  type OutgoingEmail,
} from "../lib/contact.ts";

const good = {
  name: "  Maria Chan ",
  business: "Chan's Hardware",
  email: "Maria@ChansHardware.BZ",
  whatTheyDo: "Hardware store in Belmopan",
  slowingDown: "We take orders on WhatsApp\r\nand copy them into a sheet every night.",
  lane: "small",
  token: "tok",
};

test("fields and lanes match the spec", () => {
  assert.deepEqual([...CONTACT_FIELDS], ["name", "business", "email", "whatTheyDo", "slowingDown", "lane"]);
  assert.deepEqual(
    LANE_OPTIONS.map((o) => o.label),
    ["Small business", "Growing team or established company", "Not sure yet"],
  );
  assert.equal(SALES_INBOX, "sales@visionforgestudio.app");
});

test("valid input is trimmed, email lowercased, newlines normalised", () => {
  const result = validateContact(good);
  assert.ok(result.ok);
  assert.equal(result.data.name, "Maria Chan");
  assert.equal(result.data.email, "maria@chanshardware.bz");
  assert.equal(result.data.slowingDown, "We take orders on WhatsApp\nand copy them into a sheet every night.");
  assert.equal(result.data.lane, "small");
});

test("every missing field gets its own plain message", () => {
  const result = validateContact({});
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(result.errors, {
    name: "Enter your name.",
    business: "Enter your business name.",
    email: "Enter your email so we can reply.",
    whatTheyDo: "Tell us what your business does.",
    slowingDown: "Tell us what's slowing you down.",
    lane: "Choose the option that fits you best.",
  });
});

test("bad email, unknown lane and over-long text are rejected", () => {
  const result = validateContact({ ...good, email: "maria@", lane: "enterprise", whatTheyDo: "x".repeat(301) });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.errors.email, "Enter a valid email address, like name@business.com.");
  assert.equal(result.errors.lane, "Choose the option that fits you best.");
  assert.equal(result.errors.whatTheyDo, "Keep this under 300 characters.");
});

test("single-line fields can't smuggle line breaks or control characters", () => {
  const result = validateContact({ ...good, business: "Chan's\r\nBcc: x@y.z\u0007" });
  assert.ok(result.ok);
  assert.equal(result.data.business, "Chan's Bcc: x@y.z");
});

test("non-string and non-object input is handled", () => {
  assert.equal(validateContact(null).ok, false);
  assert.equal(validateContact("hello").ok, false);
  assert.equal(validateContact({ ...good, name: 42 }).ok, false);
});

test("the honeypot flags bots", () => {
  assert.equal(isLikelyBot(good), false);
  assert.equal(isLikelyBot({ ...good, [HONEYPOT_FIELD]: "http://spam.example" }), true);
  assert.equal(isLikelyBot({ ...good, [HONEYPOT_FIELD]: "   " }), false);
  assert.equal(isLikelyBot(null), false);
});

test("the enquiry email goes to sales with reply-to set to the visitor", () => {
  const result = validateContact(good);
  assert.ok(result.ok);
  const email = buildEnquiryEmail(result.data);
  assert.equal(email.to, "sales@visionforgestudio.app");
  assert.equal(email.replyTo, "maria@chanshardware.bz");
  assert.equal(email.subject, "New enquiry from Chan's Hardware");
  assert.match(email.text, /Which fits best: Small business/);
  assert.match(email.text, /What's slowing them down:\nWe take orders/);
});

function deps(overrides: Partial<{ verify: boolean; send: boolean | "throw" }> = {}) {
  const sent: OutgoingEmail[] = [];
  return {
    sent,
    deps: {
      verifyToken: async () => overrides.verify ?? true,
      send: async (email: OutgoingEmail) => {
        if (overrides.send === "throw") throw new Error("network");
        sent.push(email);
        return overrides.send ?? true;
      },
    },
  };
}

test("handler: success sends one email", async () => {
  const d = deps();
  assert.deepEqual(await handleContact(good, d.deps), { status: 200, body: { ok: true } });
  assert.equal(d.sent.length, 1);
});

test("handler: bots get a quiet success and nothing is sent", async () => {
  const d = deps();
  assert.deepEqual(await handleContact({ ...good, website: "spam" }, d.deps), { status: 200, body: { ok: true } });
  assert.equal(d.sent.length, 0);
});

test("handler: invalid input returns field errors", async () => {
  const d = deps();
  const result = await handleContact({ ...good, email: "" }, d.deps);
  assert.equal(result.status, 400);
  assert.deepEqual(result.body, { ok: false, reason: "invalid", errors: { email: "Enter your email so we can reply." } });
  assert.equal(d.sent.length, 0);
});

test("handler: missing or rejected verification token returns 403", async () => {
  assert.equal((await handleContact({ ...good, token: "" }, deps().deps)).status, 403);
  const rejected = await handleContact(good, deps({ verify: false }).deps);
  assert.deepEqual(rejected, { status: 403, body: { ok: false, reason: "verification" } });
});

test("handler: a failed or crashing send returns 502", async () => {
  assert.deepEqual(await handleContact(good, deps({ send: false }).deps), { status: 502, body: { ok: false, reason: "failed" } });
  assert.deepEqual(await handleContact(good, deps({ send: "throw" }).deps), { status: 502, body: { ok: false, reason: "failed" } });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/contact.test.ts`
Expected: FAIL with `Cannot find module '…/lib/contact.ts'`.

- [ ] **Step 3: Write `lib/contact.ts`**

```ts
/**
 * Contact form rules shared by the browser (instant feedback) and the /api/contact route (the real check).
 * No imports, so node --test can load it directly.
 */

/** Public Turnstile site key. Cloudflare's always-pass test key until launch (see the plan's Task 14). */
export const TURNSTILE_SITE_KEY = "1x00000000000000000000AA";

export const SALES_INBOX = "sales@visionforgestudio.app";

/** Hidden field people never see. Bots that fill every input fill this one too. */
export const HONEYPOT_FIELD = "website";

export const LANE_OPTIONS = [
  { id: "small", label: "Small business" },
  { id: "growing", label: "Growing team or established company" },
  { id: "unsure", label: "Not sure yet" },
] as const;

export type Lane = (typeof LANE_OPTIONS)[number]["id"];

export const CONTACT_FIELDS = ["name", "business", "email", "whatTheyDo", "slowingDown", "lane"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
type TextField = Exclude<ContactField, "lane">;

export const FIELD_LIMITS: Record<TextField, number> = {
  name: 100,
  business: 120,
  email: 254,
  whatTheyDo: 300,
  slowingDown: 2000,
};

const REQUIRED: Record<ContactField, string> = {
  name: "Enter your name.",
  business: "Enter your business name.",
  email: "Enter your email so we can reply.",
  whatTheyDo: "Tell us what your business does.",
  slowingDown: "Tell us what's slowing you down.",
  lane: "Choose the option that fits you best.",
};

export type ContactData = {
  name: string;
  business: string;
  email: string;
  whatTheyDo: string;
  slowingDown: string;
  lane: Lane;
};

export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function asRecord(raw: unknown): Record<string, unknown> {
  return raw !== null && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
}

function clean(value: unknown, multiline: boolean): string {
  if (typeof value !== "string") return "";
  if (multiline) return value.replace(/\r\n?/g, "\n").replace(CONTROL, "").trim();
  return value.replace(/[\r\n\t]+/g, " ").replace(CONTROL, "").replace(/\s+/g, " ").trim();
}

function isLane(value: string): value is Lane {
  return LANE_OPTIONS.some((option) => option.id === value);
}

export function validateContact(raw: unknown): { ok: true; data: ContactData } | { ok: false; errors: ContactErrors } {
  const input = asRecord(raw);
  const values: Record<ContactField, string> = {
    name: clean(input.name, false),
    business: clean(input.business, false),
    email: clean(input.email, false).toLowerCase(),
    whatTheyDo: clean(input.whatTheyDo, false),
    slowingDown: clean(input.slowingDown, true),
    lane: clean(input.lane, false),
  };

  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    if (!values[field]) errors[field] = REQUIRED[field];
  }
  for (const field of Object.keys(FIELD_LIMITS) as TextField[]) {
    if (!errors[field] && values[field].length > FIELD_LIMITS[field]) {
      errors[field] = `Keep this under ${FIELD_LIMITS[field]} characters.`;
    }
  }
  if (!errors.email && !EMAIL.test(values.email)) errors.email = "Enter a valid email address, like name@business.com.";
  if (!errors.lane && !isLane(values.lane)) errors.lane = REQUIRED.lane;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { ...values, lane: values.lane as Lane } };
}

export function isLikelyBot(raw: unknown): boolean {
  const value = asRecord(raw)[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim() !== "";
}

export type OutgoingEmail = { to: string; replyTo: string; subject: string; text: string };

export function buildEnquiryEmail(data: ContactData): OutgoingEmail {
  const lane = LANE_OPTIONS.find((option) => option.id === data.lane)?.label ?? data.lane;
  return {
    to: SALES_INBOX,
    replyTo: data.email,
    subject: `New enquiry from ${data.business}`,
    text: [
      `Name: ${data.name}`,
      `Business: ${data.business}`,
      `Email: ${data.email}`,
      `Which fits best: ${lane}`,
      "",
      "What the business does:",
      data.whatTheyDo,
      "",
      "What's slowing them down:",
      data.slowingDown,
      "",
      "Sent from the contact form on visionforgestudio.app",
    ].join("\n"),
  };
}

export type ContactResponse =
  | { ok: true }
  | { ok: false; reason: "invalid"; errors: ContactErrors }
  | { ok: false; reason: "verification" }
  | { ok: false; reason: "failed" };

export type ContactDeps = {
  verifyToken: (token: string) => Promise<boolean>;
  send: (email: OutgoingEmail) => Promise<boolean>;
};

export async function handleContact(raw: unknown, deps: ContactDeps): Promise<{ status: number; body: ContactResponse }> {
  if (isLikelyBot(raw)) return { status: 200, body: { ok: true } };

  const result = validateContact(raw);
  if (!result.ok) return { status: 400, body: { ok: false, reason: "invalid", errors: result.errors } };

  const token = asRecord(raw).token;
  let verified = false;
  if (typeof token === "string" && token !== "" && token.length <= 2048) {
    try {
      verified = await deps.verifyToken(token);
    } catch {
      verified = false;
    }
  }
  if (!verified) return { status: 403, body: { ok: false, reason: "verification" } };

  try {
    if (!(await deps.send(buildEnquiryEmail(result.data)))) return { status: 502, body: { ok: false, reason: "failed" } };
  } catch {
    return { status: 502, body: { ok: false, reason: "failed" } };
  }
  return { status: 200, body: { ok: true } };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node --experimental-strip-types --test tests/contact.test.ts && npx next typegen && npx tsc --noEmit`
Expected: all contact tests PASS; tsc exits 0.

- [ ] **Step 5: Commit**

```bash
git add lib/contact.ts tests/contact.test.ts
git commit -m "feat: contact form validation, enquiry email and request handler"
```

---

### Task 5: Delivery (Turnstile + Resend), the `/api/contact` route, and CSP

**Files:**
- Create: `lib/contact-delivery.ts`
- Create: `app/api/contact/route.ts`
- Modify: `lib/security-headers.ts`
- Modify: `.dev.vars.example`
- Create test: `tests/contact-delivery.test.ts`
- Modify test: `tests/security.test.ts`

**Interfaces:**
- Consumes: `handleContact`, `OutgoingEmail` from `lib/contact.ts`.
- Produces:
  - `verifyTurnstile(token: string, secret: string | undefined, ip: string | undefined, fetchImpl?: FetchLike): Promise<boolean>`
  - `sendWithResend(email: OutgoingEmail, apiKey: string | undefined, fetchImpl?: FetchLike): Promise<boolean>`
  - `FROM_ADDRESS = "Vision Forge Studio website <website@visionforgestudio.app>"`
  - HTTP: `POST /api/contact` with JSON body → JSON `ContactResponse`, status 200/400/403/413/415/502.
  - CSP: `script-src` and `frame-src` allow `https://challenges.cloudflare.com`.

- [ ] **Step 1: Read the route handler docs**

Run: `sed -n 1,120p node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`
Expected: confirms `export async function POST(request: Request)` returning a `Response` is supported in this Next version. If the doc says otherwise, follow the doc and keep the same behaviour.

- [ ] **Step 2: Write the failing tests**

Create `tests/contact-delivery.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { FROM_ADDRESS, RESEND_URL, sendWithResend, TURNSTILE_VERIFY_URL, verifyTurnstile } from "../lib/contact-delivery.ts";

type Call = { url: string; init: RequestInit };

function fakeFetch(status: number, json: unknown) {
  const calls: Call[] = [];
  const impl = async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(JSON.stringify(json), { status, headers: { "Content-Type": "application/json" } });
  };
  return { calls, impl };
}

const email = { to: "sales@visionforgestudio.app", replyTo: "maria@example.bz", subject: "New enquiry from Chan's", text: "hi" };

test("turnstile: posts token, secret and ip, and trusts only success === true", async () => {
  const ok = fakeFetch(200, { success: true });
  assert.equal(await verifyTurnstile("tok", "sec", "1.2.3.4", ok.impl), true);
  assert.equal(ok.calls[0].url, TURNSTILE_VERIFY_URL);
  const body = new URLSearchParams(String(ok.calls[0].init.body));
  assert.equal(body.get("secret"), "sec");
  assert.equal(body.get("response"), "tok");
  assert.equal(body.get("remoteip"), "1.2.3.4");

  assert.equal(await verifyTurnstile("tok", "sec", undefined, fakeFetch(200, { success: false }).impl), false);
  assert.equal(await verifyTurnstile("tok", "sec", undefined, fakeFetch(200, { success: "true" }).impl), false);
  assert.equal(await verifyTurnstile("tok", "sec", undefined, fakeFetch(500, {}).impl), false);
});

test("turnstile: no secret configured means no pass, and no network call", async () => {
  const f = fakeFetch(200, { success: true });
  assert.equal(await verifyTurnstile("tok", undefined, undefined, f.impl), false);
  assert.equal(f.calls.length, 0);
});

test("resend: sends from the website address to sales with reply-to", async () => {
  const f = fakeFetch(200, { id: "abc" });
  assert.equal(await sendWithResend(email, "re_key", f.impl), true);
  assert.equal(f.calls[0].url, RESEND_URL);
  const headers = new Headers(f.calls[0].init.headers);
  assert.equal(headers.get("Authorization"), "Bearer re_key");
  assert.deepEqual(JSON.parse(String(f.calls[0].init.body)), {
    from: FROM_ADDRESS,
    to: ["sales@visionforgestudio.app"],
    reply_to: "maria@example.bz",
    subject: "New enquiry from Chan's",
    text: "hi",
  });
  assert.equal(FROM_ADDRESS, "Vision Forge Studio website <website@visionforgestudio.app>");
});

test("resend: missing key or error status is a failed send", async () => {
  const f = fakeFetch(200, {});
  assert.equal(await sendWithResend(email, undefined, f.impl), false);
  assert.equal(f.calls.length, 0);
  assert.equal(await sendWithResend(email, "re_key", fakeFetch(422, {}).impl), false);
});

test("the route reads secrets from the Cloudflare context and caps the body size", () => {
  const route = readFileSync(new URL("../app/api/contact/route.ts", import.meta.url), "utf8");
  assert.match(route, /export async function POST/);
  assert.match(route, /getCloudflareContext\(\)/);
  assert.match(route, /RESEND_API_KEY/);
  assert.match(route, /TURNSTILE_SECRET_KEY/);
  assert.match(route, /MAX_BODY_BYTES/);
  assert.match(route, /"Cache-Control": "no-store"/);
});
```

In `tests/security.test.ts`, inside the test `"production CSP stays restrictive"`, replace the line

```ts
  assert.match(policy, /frame-src 'none'/);
```

with

```ts
  assert.match(policy, /frame-src https:\/\/challenges\.cloudflare\.com(;|$)/);
  assert.match(policy, /script-src 'self' 'unsafe-inline' https:\/\/challenges\.cloudflare\.com(;|$)/);
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `node --experimental-strip-types --test tests/contact-delivery.test.ts tests/security.test.ts`
Expected: FAIL. `lib/contact-delivery.ts` is not found, and the CSP `frame-src` assertion fails.

- [ ] **Step 4: Write `lib/contact-delivery.ts`**

```ts
import type { OutgoingEmail } from "./contact.ts";

export const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
export const RESEND_URL = "https://api.resend.com/emails";
export const FROM_ADDRESS = "Vision Forge Studio website <website@visionforgestudio.app>";

type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

/** Asks Cloudflare whether the Turnstile token is genuine. Anything other than an explicit success is a fail. */
export async function verifyTurnstile(
  token: string,
  secret: string | undefined,
  ip: string | undefined,
  fetchImpl: FetchLike = fetch,
): Promise<boolean> {
  if (!secret) return false;
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  const response = await fetchImpl(TURNSTILE_VERIFY_URL, { method: "POST", body: form });
  if (!response.ok) return false;
  const data = (await response.json()) as { success?: unknown };
  return data.success === true;
}

/** Sends the enquiry to the sales inbox through Resend. Returns false instead of throwing on an API error. */
export async function sendWithResend(email: OutgoingEmail, apiKey: string | undefined, fetchImpl: FetchLike = fetch): Promise<boolean> {
  if (!apiKey) return false;
  const response = await fetchImpl(RESEND_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [email.to],
      reply_to: email.replyTo,
      subject: email.subject,
      text: email.text,
    }),
  });
  return response.ok;
}
```

- [ ] **Step 5: Write `app/api/contact/route.ts`**

```ts
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { handleContact } from "@/lib/contact";
import { sendWithResend, verifyTurnstile } from "@/lib/contact-delivery";

type ContactEnv = { RESEND_API_KEY?: string; TURNSTILE_SECRET_KEY?: string };

/** The form sends a few KB at most; anything bigger is not a real enquiry. */
const MAX_BODY_BYTES = 16_000;

const json = (body: unknown, status: number) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request): Promise<Response> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, reason: "failed" }, 415);
  }

  const text = await request.text();
  if (text.length > MAX_BODY_BYTES) return json({ ok: false, reason: "failed" }, 413);

  let raw: unknown = null;
  try {
    raw = JSON.parse(text);
  } catch {
    raw = null;
  }

  const env = getCloudflareContext().env as unknown as ContactEnv;
  const ip = request.headers.get("cf-connecting-ip") ?? undefined;

  const { status, body } = await handleContact(raw, {
    verifyToken: (token) => verifyTurnstile(token, env.TURNSTILE_SECRET_KEY, ip),
    send: (email) => sendWithResend(email, env.RESEND_API_KEY),
  });
  return json(body, status);
}
```

- [ ] **Step 6: Allow Turnstile in the CSP**

In `lib/security-headers.ts`:

1. Add a bullet to the top doc comment, under "Relaxed directives, and why they stay":

```ts
 * - https://challenges.cloudflare.com in script-src and frame-src: Cloudflare
 *   Turnstile, the spam check on the contact form, loads its script from there
 *   and runs its check in an iframe from the same origin.
```

2. Above `export function contentSecurityPolicy`, add:

```ts
const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com";
```

3. Change `const scriptSrc = ["'self'", "'unsafe-inline'"];` to:

```ts
  const scriptSrc = ["'self'", "'unsafe-inline'", TURNSTILE_ORIGIN];
```

Note: in development `'unsafe-eval'` is pushed after this, so the dev policy reads `'self' 'unsafe-inline' https://challenges.cloudflare.com 'unsafe-eval'`. The test in Step 2 checks only the production policy.

4. Change the `"frame-src 'none'",` entry to:

```ts
    `frame-src ${TURNSTILE_ORIGIN}`,
```

- [ ] **Step 7: Document the dev secrets**

Replace `.dev.vars.example` with:

```
NEXTJS_ENV=development
# Cloudflare Turnstile test secret: always passes. Use the real secret only as a Worker secret in production.
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
# Resend API key. Leave empty locally to exercise the "message didn't send" path.
RESEND_API_KEY=
```

Then run: `cp .dev.vars.example .dev.vars` (`.dev.vars` is git-ignored; confirm with `git check-ignore .dev.vars`, which should print `.dev.vars`).

- [ ] **Step 8: Run tests, type check and lint**

Run: `npm test && npx next typegen && npx tsc --noEmit && npm run lint`
Expected: all tests PASS (including `tests/contact-delivery.test.ts` and the updated CSP test); tsc and lint exit 0.

- [ ] **Step 9: Commit**

```bash
git add lib/contact-delivery.ts app/api/contact/route.ts lib/security-headers.ts .dev.vars.example tests/contact-delivery.test.ts tests/security.test.ts
git commit -m "feat: /api/contact verifies Turnstile and emails sales via Resend"
```

---
### Task 6: Retire the old pages, add 301 redirects, update the sitemap

**Files:**
- Delete: `app/automation/page.tsx`, `app/websites/page.tsx`, `app/pricing/page.tsx`, `app/contact/page.tsx`
- Delete: `components/sections/Demo.tsx`, `AutomationDetail.tsx`, `WorksWith.tsx`, `WebsiteKinds.tsx`, `SiteIncludes.tsx`, `PricingBuilder.tsx`, `WorkTicket.tsx`, `TierCards.tsx`, `Contact.tsx` (all under `components/sections/`)
- Delete: `lib/project-builder.ts`, `tests/project-builder.test.ts`, `tests/clarity.test.ts` (it tests the old structure; `tests/content.test.ts` and the page tests replace it)
- Modify: `next.config.ts` (add `redirects()`)
- Rewrite: `app/sitemap.ts`
- Create test: `tests/routes.test.ts`

**Interfaces:**
- Produces: the redirects `/pricing`→`/get-started`, `/contact`→`/get-started`, `/automation`→`/services#improve`, `/websites`→`/services#build`, all 301. The sitemap lists `/`, `/services`, `/how-we-work`, `/about`, `/get-started` and the four legal pages.

- [ ] **Step 1: Read the redirects docs**

Run: `grep -n -B2 -A8 "statusCode" node_modules/next/dist/docs/01-app/03-api-reference/05-config/01-next-config-js/redirects.md | head -40`
Expected: `statusCode` can be used instead of `permanent` (not both).

- [ ] **Step 2: Write the failing test**

Create `tests/routes.test.ts`:

```ts
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const exists = (path: string) => existsSync(new URL(path, root));

test("the old pages and their parts are gone", () => {
  for (const gone of [
    "app/automation/page.tsx",
    "app/websites/page.tsx",
    "app/pricing/page.tsx",
    "app/contact/page.tsx",
    "components/sections/Demo.tsx",
    "components/sections/AutomationDetail.tsx",
    "components/sections/WorksWith.tsx",
    "components/sections/WebsiteKinds.tsx",
    "components/sections/SiteIncludes.tsx",
    "components/sections/PricingBuilder.tsx",
    "components/sections/WorkTicket.tsx",
    "components/sections/TierCards.tsx",
    "components/sections/Contact.tsx",
    "lib/project-builder.ts",
  ]) {
    assert.equal(exists(gone), false, gone);
  }
});

test("old URLs redirect permanently (301) to their new homes", () => {
  const config = read("next.config.ts");
  const pairs = [
    ["/pricing", "/get-started"],
    ["/contact", "/get-started"],
    ["/automation", "/services#improve"],
    ["/websites", "/services#build"],
  ];
  for (const [source, destination] of pairs) {
    assert.match(config, new RegExp(`source: "${source}", destination: "${destination}", statusCode: 301`), source);
  }
  assert.doesNotMatch(config, /permanent: true/);
});

test("the sitemap lists the new pages and none of the retired ones", () => {
  const sitemap = read("app/sitemap.ts");
  for (const route of ["/services", "/how-we-work", "/about", "/get-started"]) assert.match(sitemap, new RegExp(`"${route}"`), route);
  for (const route of ["/automation", "/websites", "/pricing", "/contact"]) assert.doesNotMatch(sitemap, new RegExp(`"${route}"`), route);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/routes.test.ts`
Expected: FAIL on `app/automation/page.tsx` still existing.

- [ ] **Step 4: Delete the retired files**

```bash
git rm -q app/automation/page.tsx app/websites/page.tsx app/pricing/page.tsx app/contact/page.tsx \
  components/sections/Demo.tsx components/sections/AutomationDetail.tsx components/sections/WorksWith.tsx \
  components/sections/WebsiteKinds.tsx components/sections/SiteIncludes.tsx components/sections/PricingBuilder.tsx \
  components/sections/WorkTicket.tsx components/sections/TierCards.tsx components/sections/Contact.tsx \
  lib/project-builder.ts tests/project-builder.test.ts tests/clarity.test.ts
grep -rn "project-builder\|PricingBuilder\|WorkTicket\|TierCards\|WebsiteKinds\|SiteIncludes\|WorksWith\|AutomationDetail\|sections/Demo\|sections/Contact\"" app components lib tests || echo "no references left"
```

Expected: `no references left`.

- [ ] **Step 5: Add the redirects to `next.config.ts`**

Inside the `nextConfig` object, directly after the `async headers() { … },` block, add:

```ts
  async redirects() {
    // 301 rather than Next's default 308: these pages are gone for good and 301 is the most widely understood.
    return [
      { source: "/pricing", destination: "/get-started", statusCode: 301 },
      { source: "/contact", destination: "/get-started", statusCode: 301 },
      { source: "/automation", destination: "/services#improve", statusCode: 301 },
      { source: "/websites", destination: "/services#build", statusCode: 301 },
    ];
  },
```

- [ ] **Step 6: Replace `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const pageRoutes = ["/services", "/how-we-work", "/about", "/get-started"] as const;
const legalRoutes = ["/terms", "/privacy", "/disclaimer", "/cookies"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: site.url,
      lastModified: "2026-10-17",
      changeFrequency: "monthly",
      priority: 1,
    },
    ...pageRoutes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: "2026-10-17",
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...legalRoutes.map((route) => ({
      url: `${site.url}${route}`,
      lastModified: "2026-10-17",
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];
}
```

- [ ] **Step 7: Run all tests, type check and lint**

Run: `npm test && npx next typegen && npx tsc --noEmit && npm run lint`
Expected: PASS; tsc and lint exit 0.

- [ ] **Step 8: Commit**

```bash
git add -A app components lib tests next.config.ts
git commit -m "feat: retire automation, websites, pricing and contact pages with 301 redirects"
```

---

### Task 7: Shared chrome and primitives; remove phone, WhatsApp and support@

**Files:**
- Rewrite: `components/ui/CtaLink.tsx`, `components/ui/EmailLink.tsx`, `components/ui/SectionHeading.tsx`
- Rewrite: `components/layout/Navbar.tsx`, `components/layout/Footer.tsx`, `components/layout/PageHeader.tsx`, `components/layout/ClosingBand.tsx`, `components/layout/LegalLayout.tsx`
- Create: `components/layout/GetStartedBar.tsx`; Delete: `components/layout/MobileContactBar.tsx`
- Rewrite: `components/sections/Faq.tsx`
- Modify: `lib/site.ts` (remove `whatsapp`, `phone`, `support`, `projectMailto`, `navItems`; new `title`, `description`, `lastUpdated`)
- Modify: `lib/safe-href.ts` (drop `tel:` and `wa.me`)
- Modify: `app/layout.tsx` (GetStartedBar, JSON-LD)
- Modify: `app/terms/page.tsx`, `app/privacy/page.tsx`, `app/cookies/page.tsx`, `app/disclaimer/page.tsx`
- Patch callers: `components/sections/Hero.tsx`, `components/sections/AutomateList.tsx`, `components/sections/Industries.tsx`, `components/sections/Timeline.tsx`, `app/how-we-work/page.tsx`
- Rewrite test: `tests/contacts.test.ts`; Modify test: `tests/security.test.ts`; Create test: `tests/chrome.test.ts`

**Interfaces:**
- Consumes: `primaryNav`, `closing`, `site` from `lib/site.ts`.
- Produces:
  - `CtaLink({ href, children, variant?: "primary" | "secondary" | "link", className? })`. No `arrow` or `external` props.
  - `ctaClassName(variant?: "primary" | "secondary" | "link", extra?: string): string`, the same look for `<button>` and `<Link>`.
  - `EmailLink({ address, size?: "lg" | "md" | "sm", tone?: "ink" | "muted" | "onDark", subject?, className? })`
  - `SectionHeading({ title, lede?, id?, className? })`. No `kicker`.
  - `PageHeader({ title, lede, children? })`. No `kicker`.
  - `ClosingBand()`. No props.
  - `Faq({ items: readonly FaqItem[]; title?: string })`, with `type FaqItem = { q: string; a: string; link?: { href: string; label: string } }`.
  - `GetStartedBar()`

- [ ] **Step 1: Write the failing tests**

Replace all of `tests/contacts.test.ts` with:

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { site } from "../lib/site.ts";

const root = new URL("../", import.meta.url);

function sourceFiles(dir: URL): URL[] {
  return readdirSync(dir).flatMap((name) => {
    const url = new URL(name, dir);
    if (statSync(url).isDirectory()) return sourceFiles(new URL(`${name}/`, dir));
    return /\.(ts|tsx)$/.test(name) ? [url] : [];
  });
}

const files = ["app/", "components/", "lib/"].flatMap((dir) => sourceFiles(new URL(dir, root)));

test("every visionforgestudio.app email in source is lowercase", () => {
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/[A-Za-z0-9._-]+@visionforgestudio\.app/gi)) {
      assert.equal(match[0], match[0].toLowerCase(), `${file.pathname}: ${match[0]}`);
    }
  }
});

test("every mailto link is lowercase", () => {
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/mailto:[^"'`\s)}?]+/g)) {
      assert.equal(match[0], match[0].toLowerCase(), `${file.pathname}: ${match[0]}`);
    }
  }
});

test("sales is the only published contact", () => {
  assert.equal(site.sales.display, "sales@visionforgestudio.app");
  assert.equal(site.sales.href, "mailto:sales@visionforgestudio.app");
  for (const gone of ["support", "whatsapp", "phone", "projectMailto"]) assert.equal(gone in site, false, gone);
});

test("no phone numbers, WhatsApp links or support address anywhere in source", () => {
  const banned = /615-?7575|613-?9219|5016157575|5016139219|wa\.me|\btel:|support@visionforgestudio|site\.(whatsapp|phone|support)\b/;
  for (const file of files) assert.doesNotMatch(readFileSync(file, "utf8"), banned, file.pathname);
});

test("the business is never called a limited company", () => {
  for (const file of files) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /\bLtd\b|\bLimited\b/, file.pathname);
  }
  assert.equal(site.legal.registeredName, "Vision Forge");
  assert.equal(site.legal.registrationNumber, "000058528");
});
```

Create `tests/chrome.test.ts`:

```ts
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const exists = (path: string) => existsSync(new URL(path, root));

test("navbar: services, how we work, about and a Get started button", () => {
  const nav = read("components/layout/Navbar.tsx");
  assert.match(nav, /primaryNav/);
  assert.match(nav, /href="\/get-started"/);
  assert.match(nav, /usePathname/);
  assert.doesNotMatch(nav, /whatsapp|phone/i);
  assert.match(nav, /aria-label="Vision Forge Studio, home"/);
});

test("footer: sales email, pages, legal links and the registration line", () => {
  const footer = read("components/layout/Footer.tsx");
  assert.match(footer, /site\.sales\.display/);
  assert.match(footer, /primaryNav/);
  assert.match(footer, /legalItems/);
  assert.match(footer, /registrationNumber/);
  assert.doesNotMatch(footer, /whatsapp|phone/i);
});

test("the phone bar is now a single Get started button", () => {
  assert.equal(exists("components/layout/MobileContactBar.tsx"), false);
  const bar = read("components/layout/GetStartedBar.tsx");
  assert.match(bar, /href="\/get-started"/);
  assert.match(bar, /md:hidden/);
  const layout = read("app/layout.tsx");
  assert.match(layout, /<GetStartedBar \/>/);
  assert.doesNotMatch(layout, /MobileContactBar/);
});

test("structured data lists the sales email and no telephone", () => {
  const layout = read("app/layout.tsx");
  assert.doesNotMatch(layout, /telephone/);
  assert.match(layout, /contactType: "sales"/);
  assert.match(layout, /\/get-started/);
});

test("closing band sends people to the form", () => {
  const band = read("components/layout/ClosingBand.tsx");
  assert.match(band, /closing\.cta\.href/);
  assert.doesNotMatch(band, /whatsapp/i);
});

test("legal pages: no WhatsApp, and the privacy policy describes the form truthfully", () => {
  for (const page of ["terms", "privacy", "cookies", "disclaimer"]) {
    assert.doesNotMatch(read(`app/${page}/page.tsx`), /WhatsApp/, page);
  }
  const privacy = read("app/privacy/page.tsx");
  assert.doesNotMatch(privacy, /no contact forms/);
  assert.match(privacy, /contact form/);
  assert.match(privacy, /Turnstile/);
  assert.match(privacy, /Resend/);
});

test("primitives: no all-caps labels, kickers or appended arrows", () => {
  assert.doesNotMatch(read("components/ui/CtaLink.tsx"), /ArrowRight|uppercase/);
  assert.match(read("components/ui/CtaLink.tsx"), /export function ctaClassName/);
  assert.doesNotMatch(read("components/ui/SectionHeading.tsx"), /kicker|Label/);
  assert.doesNotMatch(read("components/layout/PageHeader.tsx"), /kicker|Label/);
  assert.doesNotMatch(read("components/layout/Footer.tsx"), /className="label/);
  assert.match(read("components/layout/PageHeader.tsx"), /<h1/);
});
```

In `tests/security.test.ts`:

1. Replace the whole test `"published contact targets are the only external navigations"` with:

```ts
test("only on-site paths, the site's own https and the sales mailto are navigable", () => {
  assert.equal(isSafeNavigationHref(site.sales.href), true);
  assert.equal(isSafeNavigationHref(site.url), true);
  assert.equal(isSafeNavigationHref("/terms"), true);
  assert.equal(isSafeNavigationHref("/services#improve"), true);
  assert.equal(isSafeNavigationHref("#contact"), true);

  assert.equal(isSafeNavigationHref("https://wa.me/5016157575"), false);
  assert.equal(isSafeNavigationHref("tel:+5016139219"), false);
  assert.equal(isSafeNavigationHref("javascript:alert(1)"), false);
  assert.equal(isSafeNavigationHref("http://visionforgestudio.app"), false);
  assert.equal(isSafeNavigationHref("https://evil.example"), false);
  assert.equal(isSafeNavigationHref("//evil.example"), false);
  assert.equal(isSafeNavigationHref("mailto:sales@visionforgestudio.app\r\nBcc:attacker@example.com"), false);
});
```

2. Delete the whole test `"wa.me links may carry only a short prefilled text"`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --experimental-strip-types --test tests/contacts.test.ts tests/chrome.test.ts tests/security.test.ts`
Expected: FAIL. `support` is still in `site`, `GetStartedBar.tsx` is missing, and `wa.me` is still safe.

- [ ] **Step 3: Trim contacts and metadata in `lib/site.ts`**

In the `site` object:
- Delete the `whatsapp`, `phone`, `support` and `projectMailto` entries entirely.
- Replace `title` and `description` with:

```ts
  title: "Vision Forge Studio | Your local tech partner in Belize",
  description:
    "A Belizean-owned team that reviews how your business runs, improves and automates your processes, and builds websites and custom systems. Projects from BZ$500. Free first conversation.",
```

- In `legal`, change `lastUpdated: "6 October 2026",` to `lastUpdated: "17 October 2026",`.

Delete the `navItems` export (`export const navItems = [ … ] as const;`). `primaryNav` from Task 3 replaces it.

- [ ] **Step 4: Drop `tel:` and `wa.me` from `lib/safe-href.ts`**

Replace the file with:

```ts
const HASH = /^#[A-Za-z][\w-]*$/;
const PATH = /^\/(?!\/)[A-Za-z0-9/_\-.]*?(?:#[A-Za-z][\w-]*)?$/;
const MAILTO = /^mailto:[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}(?:\?[a-z0-9._~%=&+-]*)?$/i;
const EMAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

/** Longest prefilled text we allow in an email link. */
export const MAX_MESSAGE = 500;

/** encodeURIComponent plus the characters it leaves alone (! ' ( ) *), so links stay in the strict allow-list. */
export function strictEncode(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** True for on-site paths and the site's own https and mailto targets. */
export function isSafeNavigationHref(href: string): boolean {
  if (href.includes("\\") || /[\u0000-\u001F\u007F]/.test(href)) return false;
  if (HASH.test(href) || PATH.test(href) || MAILTO.test(href)) return true;

  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }

  if (url.protocol !== "https:" || url.username || url.password) return false;
  return url.hostname === "visionforgestudio.app" || url.hostname === "www.visionforgestudio.app";
}

export function mailtoHref(address: string, subject?: string, body?: string): string | undefined {
  const email = address.trim().toLowerCase();
  if (!EMAIL.test(email)) return undefined;
  for (const part of [subject, body]) {
    if (part !== undefined && (/[\r\n]/.test(part) || part.length > MAX_MESSAGE)) return undefined;
  }
  const params = [
    subject ? `subject=${strictEncode(subject)}` : "",
    body ? `body=${strictEncode(body)}` : "",
  ].filter(Boolean);
  const href = `mailto:${email}${params.length ? `?${params.join("&")}` : ""}`;
  return isSafeNavigationHref(href) ? href : undefined;
}
```

- [ ] **Step 5: Rewrite the UI primitives**

`components/ui/CtaLink.tsx`:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";
import { isSafeNavigationHref } from "@/lib/safe-href";

type Variant = "primary" | "secondary" | "link";

const looks: Record<Variant, string> = {
  primary: "min-h-12 rounded-md bg-ink px-6 text-paper hover:bg-ink-hover",
  secondary: "min-h-12 rounded-md border border-ink px-6 text-ink hover:bg-mist",
  link: "min-h-11 text-mahogany underline decoration-mahogany/40 underline-offset-4 hover:decoration-mahogany",
};

/** Shared look for links and buttons that act as calls to action. */
export function ctaClassName(variant: Variant = "primary", extra = ""): string {
  return `inline-flex items-center justify-center gap-2 text-[16px] font-medium whitespace-nowrap transition-colors duration-200 ${looks[variant]} ${extra}`.trim();
}

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

export function CtaLink({ href, children, variant = "primary", className = "" }: CtaLinkProps) {
  const destination = isSafeNavigationHref(href) ? href : undefined;
  const classes = ctaClassName(variant, className);
  if (destination?.startsWith("/") || destination?.startsWith("#")) {
    return (
      <Link href={destination} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <a href={destination} className={classes}>
      {children}
    </a>
  );
}
```

`components/ui/EmailLink.tsx`:

```tsx
import { mailtoHref } from "@/lib/safe-href";

type EmailLinkProps = {
  address: string;
  size?: "lg" | "md" | "sm";
  tone?: "ink" | "muted" | "onDark";
  subject?: string;
  className?: string;
};

const sizes = {
  lg: "text-[1.25rem]",
  md: "text-[17px]",
  sm: "text-[15px]",
} as const;

const tones = {
  ink: "text-ink underline decoration-mahogany/50 underline-offset-4 hover:decoration-mahogany",
  muted: "text-body hover:text-ink",
  onDark: "text-on-ink-2 hover:text-paper",
} as const;

/** A lowercase, clickable mailto link. */
export function EmailLink({ address, size = "md", tone = "ink", subject, className = "" }: EmailLinkProps) {
  return (
    <a
      href={mailtoHref(address, subject)}
      className={`inline-flex min-h-11 items-center [overflow-wrap:anywhere] lowercase transition-colors ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {address.toLowerCase()}
    </a>
  );
}
```

`components/ui/SectionHeading.tsx`:

```tsx
import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  className?: string;
};

export function SectionHeading({ title, lede, id, className = "" }: SectionHeadingProps) {
  return (
    <header className={`max-w-3xl ${className}`}>
      <h2 id={id} className="font-serif text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.18] font-semibold tracking-[-0.01em] text-balance text-ink">
        {title}
      </h2>
      {lede ? <p className="mt-4 max-w-[60ch] text-body">{lede}</p> : null}
    </header>
  );
}
```

- [ ] **Step 6: Rewrite the layout components**

`components/layout/PageHeader.tsx`:

```tsx
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  lede: ReactNode;
  children?: ReactNode;
};

/** The one h1 on every inner page. */
export function PageHeader({ title, lede, children }: PageHeaderProps) {
  return (
    <header className="border-b border-line bg-mist">
      <div className="mx-auto max-w-[1180px] px-5 pt-14 pb-12 sm:px-8 md:pt-20 md:pb-16 lg:px-10">
        <h1 className="max-w-[22ch] font-serif text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.12] font-semibold tracking-[-0.01em] text-balance text-ink">
          {title}
        </h1>
        <div className="mt-5 max-w-[60ch] text-[1.125rem] text-body md:text-[1.1875rem]">{lede}</div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
```

`components/layout/ClosingBand.tsx`:

```tsx
import { CtaLink } from "@/components/ui/CtaLink";
import { closing } from "@/lib/site";

/** Shared end-of-page call to action so no page is a dead end. */
export function ClosingBand() {
  return (
    <section aria-labelledby="closing-title" className="bg-mist">
      <div className="mx-auto flex max-w-[1180px] flex-col gap-8 px-5 py-20 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-10">
        <div className="max-w-2xl">
          <h2 id="closing-title" className="font-serif text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.18] font-semibold text-balance text-ink">
            {closing.title}
          </h2>
          <p className="mt-4 text-body">{closing.copy}</p>
        </div>
        <CtaLink href={closing.cta.href}>{closing.cta.label}</CtaLink>
      </div>
    </section>
  );
}
```

`components/layout/GetStartedBar.tsx` (then `git rm components/layout/MobileContactBar.tsx`):

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ctaClassName } from "@/components/ui/CtaLink";

/** Phone-only bottom bar so the form is always one tap away. Hidden on the form's own page. */
export function GetStartedBar() {
  const pathname = usePathname();
  if (pathname === "/get-started") return null;

  return (
    <div className="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <Link href="/get-started" className={ctaClassName("primary", "w-full")}>
        Get started
      </Link>
    </div>
  );
}
```

`components/layout/Navbar.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ctaClassName } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";
import { primaryNav } from "@/lib/site";

function Brand() {
  return <span className="hidden font-serif text-[18px] font-semibold text-ink sm:inline">Vision Forge Studio</span>;
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const onScroll = () => {
      const header = headerRef.current;
      if (!header) return;
      const next = window.scrollY > 8 ? "true" : "false";
      if (header.dataset.scrolled !== next) header.dataset.scrolled = next;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = dialogRef.current;
    dialog?.querySelector<HTMLElement>("[data-close-menu]")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>("a, button"));
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header ref={headerRef} data-scrolled="false" className="site-header no-print sticky top-0 z-50">
      <div className="nav-shell border-b border-line bg-paper transition-[background-color] duration-300">
        <div className="mx-auto flex h-[var(--nav-h)] max-w-[1180px] items-center gap-6 px-5 sm:px-8 lg:px-10">
          <Link href="/" className="flex min-h-11 items-center gap-3" aria-label="Vision Forge Studio, home">
            <Logo priority className="h-10 w-auto" sizes="48px" />
            <Brand />
          </Link>

          <nav className="ml-auto hidden items-center gap-8 lg:flex" aria-label="Primary">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="py-2 text-[16px] text-body transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline aria-[current=page]:decoration-mahogany aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Link href="/get-started" className={ctaClassName("primary", "min-h-11 px-5")}>
              Get started
            </Link>
          </div>

          <button
            ref={menuButtonRef}
            type="button"
            className="ml-auto flex h-11 w-11 items-center justify-center text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(true)}
          >
            <Menu aria-hidden strokeWidth={1.75} className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          ref={dialogRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
          className="fixed inset-0 z-[60] flex flex-col bg-paper lg:hidden"
        >
          <div className="flex h-[var(--nav-h)] items-center justify-between border-b border-line px-5">
            <Link href="/" onClick={closeMenu} className="flex min-h-11 items-center gap-3" aria-label="Vision Forge Studio, home">
              <Logo className="h-10 w-auto" sizes="48px" />
              <Brand />
            </Link>
            <button
              type="button"
              data-close-menu
              className="flex h-11 w-11 items-center justify-center text-ink"
              onClick={() => {
                setOpen(false);
                menuButtonRef.current?.focus();
              }}
            >
              <X aria-hidden strokeWidth={1.75} className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </button>
          </div>

          <nav className="flex flex-1 flex-col px-5 pt-2" aria-label="Mobile">
            {[{ href: "/", label: "Home" }, ...primaryNav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                aria-current={(item.href === "/" ? pathname === "/" : isActive(item.href)) ? "page" : undefined}
                className="flex min-h-16 items-center border-b border-line py-4 font-serif text-[1.75rem] leading-none font-semibold text-ink aria-[current=page]:text-mahogany"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-8">
              <Link href="/get-started" onClick={closeMenu} className={ctaClassName("primary", "w-full")}>
                Get started
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
```

`components/layout/Footer.tsx`:

```tsx
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { EmailLink } from "@/components/ui/EmailLink";
import { Logo } from "@/components/ui/Logo";
import { legalItems, primaryNav, site } from "@/lib/site";

const titleClass = "text-[15px] font-semibold text-paper";
const linkClass = "inline-flex min-h-10 items-center text-[15px] text-on-ink-2 transition-colors hover:text-paper";

export function Footer() {
  const { legal } = site;
  return (
    <footer className="no-print bg-ink text-on-ink-2">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-8 lg:px-10">
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr_1fr]">
          <div>
            <Link href="/" aria-label="Vision Forge Studio, home" className="inline-flex items-center gap-3">
              <Logo className="h-14 w-auto" sizes="68px" />
              <span className="font-serif text-[20px] font-semibold text-paper">Vision Forge Studio</span>
            </Link>
            <p className="mt-5 max-w-xs text-[16px]">Your local tech partner. Belizean-owned.</p>
          </div>

          <nav aria-label="Pages">
            <h2 className={titleClass}>Pages</h2>
            <ul className="mt-3">
              {[{ href: "/", label: "Home" }, ...primaryNav, { href: "/get-started", label: "Get started" }].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={titleClass}>Contact</h2>
            <ul className="mt-3">
              <li>
                <EmailLink address={site.sales.display} size="sm" tone="onDark" />
              </li>
              <li>
                <Link href="/get-started" className={linkClass}>
                  Send us a message
                </Link>
              </li>
            </ul>
          </div>

          <nav aria-label="Legal">
            <h2 className={titleClass}>Legal</h2>
            <ul className="mt-3">
              {legalItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/15 py-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-[13px] leading-relaxed">
            © {legal.copyrightYear} {legal.registeredName}. Registered in Belize under the Business Names Act, Cap. 247,
            Reg. No. {legal.registrationNumber}. Trading as {legal.tradingName}.
          </p>
          <a
            href="#main"
            aria-label="Back to top"
            className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-md border border-white/25 text-paper transition-colors hover:bg-white/10 md:self-auto"
          >
            <ArrowUp aria-hidden className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
```

`components/layout/LegalLayout.tsx`:

```tsx
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export type LegalSection = { id: string; heading: string; body: ReactNode };

type LegalLayoutProps = {
  kicker: string;
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
};

export function LegalLayout({ kicker, title, intro, sections }: LegalLayoutProps) {
  return (
    <article className="px-5 pt-14 pb-24 sm:px-8 lg:px-10 lg:pt-20">
      <div className="mx-auto max-w-[1180px]">
        <header className="max-w-3xl border-b border-line pb-10">
          <p className="text-[15px] font-medium text-mahogany">{kicker}</p>
          <h1 className="mt-3 font-serif text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.12] font-semibold text-ink">{title}</h1>
          <p className="mt-5 text-[15px] text-muted">Last updated {site.legal.lastUpdated}</p>
          <div className="mt-5 text-[1.125rem] leading-relaxed text-body">{intro}</div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[15rem_1fr]">
          <nav aria-label="On this page" className="no-print lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
            <p className="text-[15px] font-semibold text-ink">On this page</p>
            <ol className="mt-3 space-y-0.5 border-l border-line">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="block py-1.5 pl-4 text-[15px] text-body transition-colors hover:text-ink">
                    <span className="mr-2 text-mahogany tabular-nums">{index + 1}.</span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-prose max-w-[68ch] text-[17px] leading-[1.7]">
            {sections.map((section, index) => (
              <section key={section.id} aria-labelledby={section.id}>
                <h2 id={section.id}>
                  <span className="mr-3 text-mahogany tabular-nums">{index + 1}.</span>
                  {section.heading}
                </h2>
                {section.body}
              </section>
            ))}
            <p className="mt-16 border-t border-line pt-6 text-[15px] text-muted">
              This page is provided for general information. It is not legal advice.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
```

`components/sections/Faq.tsx`:

```tsx
import { Plus } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type FaqItem = { q: string; a: string; link?: { href: string; label: string } };

export function Faq({ items, title = "Questions people ask" }: { items: readonly FaqItem[]; title?: string }) {
  return (
    <section aria-labelledby="faq-title" className="border-b border-line">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <SectionHeading id="faq-title" title={title} />
        <div className="border-t border-line">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-[1.1875rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus aria-hidden className="h-5 w-5 shrink-0 text-mahogany transition-transform duration-200 group-open:rotate-45" strokeWidth={1.75} />
              </summary>
              <p className="max-w-[62ch] pr-10 pb-6 text-body">
                {item.a}
                {item.link ? (
                  <>
                    {" "}
                    <Link href={item.link.href} className="text-mahogany underline underline-offset-4">
                      {item.link.label}
                    </Link>
                  </>
                ) : null}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Update `app/layout.tsx`**

1. Replace `import { MobileContactBar } from "@/components/layout/MobileContactBar";` with `import { GetStartedBar } from "@/components/layout/GetStartedBar";`, and `<MobileContactBar />` with `<GetStartedBar />`.
2. Replace the whole `const jsonLd = { … };` with:

```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  legalName: site.legal.registeredName,
  url: site.url,
  image: `${site.url}/brand/vision-forge-logo.png`,
  logo: `${site.url}/brand/vision-forge-logo.png`,
  description: site.description,
  email: site.sales.display,
  areaServed: {
    "@type": "Country",
    name: "Belize",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "BZ",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "sales",
      email: site.sales.display,
      availableLanguage: ["English"],
      url: `${site.url}/get-started`,
    },
  ],
};
```

- [ ] **Step 8: Fix contact facts in the legal pages**

```bash
sed -i 's/site\.support\./site.sales./g' app/terms/page.tsx app/privacy/page.tsx app/cookies/page.tsx
```

In `app/privacy/page.tsx`, make these exact replacements:

| Find | Replace with |
|---|---|
| `This website has no contact forms, no analytics and no advertising or tracking cookies. We only receive` | `This website has one contact form and no analytics, advertising or tracking cookies. We only receive` |
| `<li>your name, email address and phone number;</li>` | `<li>your name and email address;</li>` |
| `<li>messages you send us by email, WhatsApp or phone.</li>` | `<li>messages you send us through our contact form or by email.</li>` |
| `<li>WhatsApp (Meta), when you choose to message us there, under its own privacy policy;</li>` | `<li>Cloudflare, which hosts this website and runs the spam check on our contact form, and Resend, which delivers contact form messages to our inbox;</li>` |

Then, still in `app/privacy/page.tsx`, insert this paragraph immediately before the paragraph that starts `Like most websites, our hosting provider`:

```tsx
        <p>
          Our contact form uses Cloudflare Turnstile to check that a person, not an automated program, is sending the
          message.
        </p>
```

In `app/cookies/page.tsx` replace `If you follow a link to another site, such as WhatsApp, that site may set its own cookies under its own` with `If you follow a link to another site, that site may set its own cookies under its own`.

In `app/disclaimer/page.tsx` replace `Links to other websites, such as WhatsApp, are provided for convenience.` with `Links to other websites are provided for convenience.`

- [ ] **Step 9: Patch the remaining old callers so they compile**

- `components/sections/Hero.tsx`: change `<CtaLink href={hero.primary.href} arrow>` to `<CtaLink href={hero.primary.href}>`, and `variant="ghost"` to `variant="secondary"`.
- `components/sections/AutomateList.tsx`: change `<SectionHeading id="automate-title" kicker="What we automate" title="Sounds like your week?" />` to `<SectionHeading id="automate-title" title="Sounds like your week?" />`.
- `components/sections/Industries.tsx`: delete the line `kicker="Who we work with"`.
- `components/sections/Timeline.tsx`: change `<SectionHeading id="steps-title" kicker="Four steps" title="From first message to running for real." />` to `<SectionHeading id="steps-title" title="From first message to running for real." />`.
- `app/how-we-work/page.tsx`: delete the line `kicker="How we work"` and change `<Faq />` to `<Faq items={faq} />`.

Then confirm nothing else uses removed APIs:

Run: `grep -rnE '<SectionHeading[^>]*kicker|kicker="(How we work|Who we work with)"|<CtaLink[^>]* (arrow|external)|variant="ghost"|navItems|MobileContactBar|site\.(whatsapp|phone|support|projectMailto)' app components lib || echo "clean"`
Expected: `clean`. (Legal pages still pass `kicker="Legal"` to `LegalLayout`, which keeps that prop.)

- [ ] **Step 10: Run all tests, type check and lint**

Run: `npm test && npx next typegen && npx tsc --noEmit && npm run lint`
Expected: PASS; tsc and lint exit 0.

- [ ] **Step 11: Commit**

```bash
git add -A app components lib tests
git commit -m "feat: light chrome with a Get started button; remove phone, WhatsApp and support contacts"
```

---

### Task 8: Contact form, pricing lanes and the Get started page

**Files:**
- Create: `components/sections/ContactForm.tsx` (client)
- Create: `components/sections/ContactSection.tsx`
- Create: `components/sections/Lanes.tsx`
- Create: `app/get-started/page.tsx`
- Create test: `tests/get-started.test.ts`

**Interfaces:**
- Consumes: `validateContact`, `CONTACT_FIELDS`, `FIELD_LIMITS`, `HONEYPOT_FIELD`, `LANE_OPTIONS`, `TURNSTILE_SITE_KEY`, `ContactErrors`, `ContactField`, `ContactResponse` (lib/contact); `ctaClassName` (CtaLink); `EmailLink`; `lanes`, `lanesNote`, `replyPromise`, `closing`, `site` (lib/site); `POST /api/contact`.
- Produces: `ContactForm()`, `ContactSection({ title?: string })` (renders `<section id="contact">`), `Lanes({ title?: string })`.

- [ ] **Step 1: Write the failing test**

Create `tests/get-started.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

test("get started page: lanes first, then the form, with its own metadata", () => {
  const page = read("app/get-started/page.tsx");
  assert.match(page, /export const metadata/);
  assert.match(page, /canonical: "\/get-started"/);
  assert.ok(page.indexOf("<Lanes") > -1 && page.indexOf("<Lanes") < page.indexOf("<ContactSection"));
  assert.match(page, /<PageHeader/);
});

test("the form posts JSON to /api/contact and shares validation with the server", () => {
  const form = read("components/sections/ContactForm.tsx");
  assert.match(form, /^"use client";/);
  assert.match(form, /fetch\("\/api\/contact"/);
  assert.match(form, /validateContact/);
  assert.match(form, /HONEYPOT_FIELD/);
  assert.match(form, /TURNSTILE_SITE_KEY/);
  assert.match(form, /render=explicit/);
  assert.match(form, /noValidate/);
});

test("form states: inline errors, sending, sent, failed", () => {
  const form = read("components/sections/ContactForm.tsx");
  assert.match(form, /aria-invalid/);
  assert.match(form, /aria-describedby/);
  assert.match(form, /role="alert"/);
  assert.match(form, /role="status"/);
  assert.match(form, /Sending…/);
  assert.match(form, /Send message/);
  assert.match(form, /Message sent/);
  assert.match(form, /Your message didn't send\. Try again, or email /);
});

test("every field has a visible label, and lanes are a labelled radio group", () => {
  const form = read("components/sections/ContactForm.tsx");
  for (const name of ["name", "business", "email", "whatTheyDo", "slowingDown"]) {
    assert.match(form, new RegExp(`name: "${name}"`), name);
  }
  assert.match(form, /htmlFor=\{fieldId\}/);
  assert.match(form, /<legend[^>]*>Which fits you best\?<\/legend>/);
  assert.match(form, /type="radio"/);
});

test("contact section shows the sales email; the form shows the reply promise", () => {
  const section = read("components/sections/ContactSection.tsx");
  assert.match(section, /id="contact"/);
  assert.match(section, /site\.sales\.display/);
  assert.match(read("components/sections/ContactForm.tsx"), /replyPromise/);
});

test("lanes render both lanes and the small-print link", () => {
  const lanesSrc = read("components/sections/Lanes.tsx");
  assert.match(lanesSrc, /lanes\.map/);
  assert.match(lanesSrc, /lanesNote\.href/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/get-started.test.ts`
Expected: FAIL with ENOENT for `app/get-started/page.tsx`.

- [ ] **Step 3: Write `components/sections/Lanes.tsx`**

```tsx
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { lanes, lanesNote } from "@/lib/site";

/** The two ways to start. No feature lists: who each lane is for, and a starting price. */
export function Lanes({ title }: { title?: string }) {
  return (
    <section
      aria-labelledby={title ? "lanes-title" : undefined}
      aria-label={title ? undefined : "Ways to start"}
      className="border-b border-line"
    >
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 md:py-20 lg:px-10">
        {title ? <SectionHeading id="lanes-title" title={title} className="mb-10" /> : null}
        <ul className="grid gap-5 md:grid-cols-2">
          {lanes.map((lane) => (
            <li key={lane.id} className="rounded-lg border border-line bg-paper p-7 md:p-8">
              <h3 className="font-serif text-[1.3125rem] leading-snug font-semibold text-ink">{lane.title}</h3>
              <p className="mt-3 font-serif text-[1.75rem] leading-none font-semibold text-mahogany">{lane.price}</p>
              <p className="mt-4 max-w-[48ch] text-body">{lane.copy}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] text-muted">
          {lanesNote.text}{" "}
          <Link href={lanesNote.href} className="text-mahogany underline underline-offset-4">
            {lanesNote.linkLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write `components/sections/ContactForm.tsx`**

```tsx
"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { ctaClassName } from "@/components/ui/CtaLink";
import {
  CONTACT_FIELDS,
  FIELD_LIMITS,
  HONEYPOT_FIELD,
  LANE_OPTIONS,
  TURNSTILE_SITE_KEY,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactResponse,
} from "@/lib/contact";
import { replyPromise, site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "failed" | "verification";

type TurnstileApi = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile);
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    const script = existing ?? Object.assign(document.createElement("script"), { src: TURNSTILE_SRC, async: true });
    script.addEventListener("load", () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing"))));
    script.addEventListener("error", () => reject(new Error("Turnstile failed to load")));
    if (!existing) document.head.appendChild(script);
  });
}

type TextField = Exclude<ContactField, "lane">;

const fields: { name: TextField; label: string; type?: string; autoComplete?: string; placeholder?: string; multiline?: boolean }[] = [
  { name: "name", label: "Your name", autoComplete: "name" },
  { name: "business", label: "Business name", autoComplete: "organization" },
  { name: "email", label: "Email", type: "email", autoComplete: "email", placeholder: "name@business.com" },
  { name: "whatTheyDo", label: "What does your business do?", placeholder: "We run a hardware store in Belmopan" },
  {
    name: "slowingDown",
    label: "What's slowing you down?",
    multiline: true,
    placeholder: "We take orders on WhatsApp and copy them into a spreadsheet every night.",
  },
];

const failureText = {
  failed: "Your message didn't send. Try again, or email ",
  verification: "We couldn't confirm the message came from a person. Try again, or email ",
} as const;

const inputClass =
  "mt-2 block w-full rounded-md border border-line bg-paper px-4 text-[17px] text-ink placeholder:text-muted/70 focus-visible:border-ink aria-[invalid=true]:border-danger";

export function ContactForm() {
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    let cancelled = false;
    loadTurnstile()
      .then((api) => {
        if (cancelled || !widgetRef.current || widgetId.current) return;
        widgetId.current = api.render(widgetRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "light",
          appearance: "interaction-only",
          callback: (value: string) => setToken(value),
          "expired-callback": () => setToken(""),
          "error-callback": () => setToken(""),
        });
      })
      .catch(() => {
        if (!cancelled) setToken("");
      });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = null;
    };
  }, []);

  const resetTurnstile = () => {
    setToken("");
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
  };

  const focusFirstError = (found: ContactErrors) => {
    const first = CONTACT_FIELDS.find((field) => found[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const clearError = (event: FormEvent<HTMLFormElement>) => {
    const name = (event.target as HTMLInputElement).name as ContactField;
    if (!errors[name]) return;
    setErrors((previous) => {
      const next = { ...previous };
      delete next[name];
      return next;
    });
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    const values = Object.fromEntries(new FormData(event.currentTarget)) as Record<string, string>;

    const check = validateContact(values);
    if (!check.ok) {
      setErrors(check.errors);
      focusFirstError(check.errors);
      return;
    }

    setErrors({});
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, token }),
      });
      const body = (await response.json().catch(() => null)) as ContactResponse | null;
      if (body?.ok) {
        setStatus("sent");
        return;
      }
      if (body && !body.ok && body.reason === "invalid") {
        setErrors(body.errors);
        focusFirstError(body.errors);
        setStatus("idle");
        resetTurnstile();
        return;
      }
      setStatus(body && !body.ok && body.reason === "verification" ? "verification" : "failed");
      resetTurnstile();
    } catch {
      setStatus("failed");
      resetTurnstile();
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="py-4">
        <h3 className="font-serif text-[1.5rem] font-semibold text-ink">Message sent</h3>
        <p className="mt-3 text-body">{"We'll be in touch within one business day."}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} onInput={clearError} className="relative grid gap-6">
      {fields.map((field) => {
        const fieldId = `${id}-${field.name}`;
        const error = errors[field.name];
        const shared = {
          id: fieldId,
          name: field.name,
          autoComplete: field.autoComplete,
          placeholder: field.placeholder,
          maxLength: FIELD_LIMITS[field.name],
          required: true,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": error ? `${fieldId}-error` : undefined,
        };
        return (
          <div key={field.name}>
            <label htmlFor={fieldId} className="block text-[16px] font-medium text-ink">
              {field.label}
            </label>
            {field.multiline ? (
              <textarea {...shared} rows={5} className={`${inputClass} min-h-36 py-3`} />
            ) : (
              <input {...shared} type={field.type ?? "text"} className={`${inputClass} min-h-12`} />
            )}
            {error ? (
              <p id={`${fieldId}-error`} className="mt-2 text-[15px] text-danger">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <fieldset aria-describedby={errors.lane ? `${id}-lane-error` : undefined}>
        <legend className="text-[16px] font-medium text-ink">Which fits you best?</legend>
        <div className="mt-3 grid gap-2">
          {LANE_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-line px-4 text-ink has-[:checked]:border-ink has-[:checked]:bg-mist"
            >
              <input type="radio" name="lane" value={option.id} className="h-4 w-4 accent-[var(--ink)]" />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {errors.lane ? (
          <p id={`${id}-lane-error`} className="mt-2 text-[15px] text-danger">
            {errors.lane}
          </p>
        ) : null}
      </fieldset>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-${HONEYPOT_FIELD}`}>Leave this empty</label>
        <input id={`${id}-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div ref={widgetRef} />

      {status === "failed" || status === "verification" ? (
        <p role="alert" className="text-[16px] text-danger">
          {failureText[status]}
          <a href={site.sales.href} className="underline underline-offset-4">
            {site.sales.display}
          </a>
          .
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <button type="submit" disabled={status === "sending"} className={ctaClassName("primary", "w-full sm:w-auto sm:self-start disabled:cursor-wait disabled:opacity-80")}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-[15px] text-muted">{replyPromise}</p>
      </div>
    </form>
  );
}
```

- [ ] **Step 5: Write `components/sections/ContactSection.tsx`**

```tsx
import { ContactForm } from "@/components/sections/ContactForm";
import { EmailLink } from "@/components/ui/EmailLink";
import { closing, site } from "@/lib/site";

export function ContactSection({ title = closing.title }: { title?: string }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-mist">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[0.85fr_1.15fr] lg:px-10">
        <div>
          <h2 id="contact-title" className="font-serif text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.18] font-semibold text-balance text-ink">
            {title}
          </h2>
          <p className="mt-4 max-w-[46ch] text-body">
            Tell us a little about your business and what isn&apos;t working. The first conversation is free.
          </p>
          <p className="mt-8 text-body">Prefer email?</p>
          <EmailLink address={site.sales.display} subject="New project enquiry" />
        </div>
        <div className="rounded-lg border border-line bg-paper p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Write `app/get-started/page.tsx`**

```tsx
import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactSection } from "@/components/sections/ContactSection";
import { Lanes } from "@/components/sections/Lanes";

export const metadata: Metadata = {
  title: "Get Started | Vision Forge Studio",
  description:
    "Tell us about your business and what's slowing you down. Small business projects start from BZ$500; bigger work starts with a free conversation.",
  alternates: { canonical: "/get-started" },
};

export default function GetStartedPage() {
  return (
    <>
      <PageHeader
        title="Let's start with a conversation."
        lede="Tell us about your business and what's slowing you down. The first conversation is free, and there's no obligation."
      />
      <Lanes />
      <ContactSection title="Tell us about your business" />
    </>
  );
}
```

- [ ] **Step 7: Run tests, type check and lint**

Run: `npm test && npx next typegen && npx tsc --noEmit && npm run lint`
Expected: PASS; tsc and lint exit 0.

- [ ] **Step 8: Try the form locally**

Run: `npm run dev` (background), then:

```bash
curl -s -X POST localhost:3000/api/contact -H 'Content-Type: application/json' -d '{"name":""}' ; echo
curl -s -X POST localhost:3000/api/contact -H 'Content-Type: application/json' -d '{"website":"spam"}' ; echo
curl -s -X POST localhost:3000/api/contact -H 'Content-Type: application/json' \
  -d '{"name":"Maria","business":"Chan","email":"m@chan.bz","whatTheyDo":"Hardware","slowingDown":"Orders","lane":"small","token":"XXXX.DUMMY.TOKEN.XXXX"}' ; echo
curl -s -o /dev/null -w "%{http_code}\n" -X POST localhost:3000/api/contact -H 'Content-Type: text/plain' -d 'hi'
```

Expected, in order:
- `{"ok":false,"reason":"invalid","errors":{…}}`
- `{"ok":true}`
- `{"ok":false,"reason":"failed"}`. The Turnstile test secret passes the token, and the empty `RESEND_API_KEY` makes the send fail, which proves the failure path. If this machine can't reach `challenges.cloudflare.com` (some sandboxes block it), you'll get `{"ok":false,"reason":"verification"}` instead, which is also correct: an unverifiable token is refused.
- `415`

Open `http://localhost:3000/get-started` in a browser. Submit empty: inline errors appear and focus jumps to "Your name". Fill it in and submit: the red "Your message didn't send…" alert appears and the typed values are still there. Stop the dev server.

- [ ] **Step 9: Commit**

```bash
git add components/sections/ContactForm.tsx components/sections/ContactSection.tsx components/sections/Lanes.tsx app/get-started tests/get-started.test.ts
git commit -m "feat: Get started page with pricing lanes and the contact form"
```

---
### Task 9: Rebuild the home page

**Files:**
- Rewrite: `components/sections/Hero.tsx`, `components/sections/Workbench.tsx`, `components/sections/Industries.tsx`
- Create: `components/sections/Pains.tsx`, `components/sections/Stages.tsx`, `components/sections/WhyUs.tsx`
- Rewrite: `app/page.tsx`
- Delete: `components/sections/AutomateList.tsx`, `components/sections/PageIndex.tsx`, `components/ui/Label.tsx`
- Create test: `tests/home.test.ts`

**Interfaces:**
- Consumes: `home`, `pains`, `stages`, `featuredIndustries`, `moreIndustries`, `whyUs` (lib/site); `DEMO_STEPS`, `DEMO_RECEIPT_TITLE`, `minutesAfter` (lib/demo); `CtaLink`, `ctaClassName`, `SectionHeading`, `Logo`; `Lanes`, `ContactSection` (Task 8).
- Produces: `Hero()`, `Pains()`, `Stages()`, `Workbench()`, `Industries()`, `WhyUs()`.

- [ ] **Step 1: Write the failing test**

Create `tests/home.test.ts`:

```ts
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const exists = (path: string) => existsSync(new URL(path, root));

test("home tells the partner story in the agreed order", () => {
  const page = read("app/page.tsx");
  const order = ["<Hero", "<Pains", "<Stages", "<Workbench", "<Industries", "<WhyUs", "<Lanes", "<ContactSection"];
  const positions = order.map((tag) => page.indexOf(tag));
  for (const [i, pos] of positions.entries()) assert.ok(pos > -1, order[i]);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.doesNotMatch(page, /<ClosingBand|<PageIndex|<AutomateList/);
});

test("hero uses the new copy, one h1 and no all-caps label", () => {
  const hero = read("components/sections/Hero.tsx");
  assert.match(hero, /home\.headline/);
  assert.match(hero, /<h1/);
  assert.match(hero, /home\.trust\.map/);
  assert.doesNotMatch(hero, /Label|goldWord|emblem-glint|className="label/);
});

test("retired home parts are gone", () => {
  for (const gone of ["components/sections/AutomateList.tsx", "components/sections/PageIndex.tsx", "components/ui/Label.tsx"]) {
    assert.equal(exists(gone), false, gone);
  }
});

test("workbench still works: a real button, a live region, reduced motion", () => {
  const bench = read("components/sections/Workbench.tsx");
  assert.match(bench, /<button/);
  assert.match(bench, /aria-live="polite"/);
  assert.match(bench, /prefers-reduced-motion/);
  assert.doesNotMatch(bench, /font-hand|paper-torn|text-gold/);
});

test("stages section marks support as optional and links to services", () => {
  const src = read("components/sections/Stages.tsx");
  assert.match(src, /stage\.optional/);
  assert.match(src, /href="\/services"/);
  assert.match(src, /<ol/);
});

test("industries: six featured, the rest named in one sentence, no marquee", () => {
  const src = read("components/sections/Industries.tsx");
  assert.match(src, /featuredIndustries\.map/);
  assert.match(src, /moreIndustries/);
  assert.doesNotMatch(src, /marquee/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/home.test.ts`
Expected: FAIL. `<Pains` is not in `app/page.tsx`.

- [ ] **Step 3: Write `components/sections/Hero.tsx`**

```tsx
import { Check } from "lucide-react";
import { CtaLink } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";
import { home } from "@/lib/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-line">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 pt-14 pb-16 sm:px-8 md:pt-20 lg:grid-cols-[1.4fr_0.6fr] lg:px-10 lg:pb-24">
        <div>
          <h1
            id="hero-title"
            className="max-w-[18ch] font-serif text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.08] font-semibold tracking-[-0.015em] text-balance text-ink"
          >
            {home.headline}
          </h1>
          <p className="mt-6 max-w-[56ch] text-[1.125rem] text-body md:text-[1.25rem]">{home.lede}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={home.primary.href}>{home.primary.label}</CtaLink>
            <CtaLink href={home.secondary.href} variant="secondary">
              {home.secondary.label}
            </CtaLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-muted">
            {home.trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check aria-hidden className="h-4 w-4 text-mahogany" strokeWidth={2.25} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden rounded-2xl bg-mist p-10 lg:block">
          <Logo priority className="h-auto w-full" sizes="260px" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write `components/sections/Pains.tsx`**

```tsx
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pains } from "@/lib/site";

export function Pains() {
  return (
    <section aria-labelledby="pains-title" className="border-b border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="pains-title"
          title="Sound familiar?"
          lede="Most of the businesses we meet aren't short on effort. Something in how the work flows is slowing them down."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
          {pains.map((pain) => (
            <li key={pain.id} className="bg-paper p-7 md:p-8">
              <p className="font-serif text-[1.3125rem] leading-snug font-medium text-ink">“{pain.quote}”</p>
              <p className="mt-3 text-body">{pain.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Write `components/sections/Stages.tsx`**

```tsx
import { CtaLink } from "@/components/ui/CtaLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { stages } from "@/lib/site";

/** Home-page summary of how we work with a business. A real sequence, so it's numbered. */
export function Stages() {
  return (
    <section aria-labelledby="stages-title" className="border-b border-line bg-mist">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="stages-title"
          title="How we work with you"
          lede="We start by understanding your business. Then we improve how it runs and build what it needs."
        />
        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {stages.map((stage, index) => (
            <li key={stage.id} className="border-t-2 border-ink pt-5">
              <p className="flex flex-wrap items-baseline gap-x-3 font-serif text-[1.3125rem] font-semibold text-ink">
                <span className="text-mahogany tabular-nums">{index + 1}</span>
                {stage.name}
                {stage.optional ? <span className="font-sans text-[14px] font-normal text-muted">Optional</span> : null}
              </p>
              <p className="mt-1 text-[15px] font-medium text-ink">{stage.title}</p>
              <p className="mt-3 text-[16px] text-body">{stage.summary}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <CtaLink href="/services" variant="link">
            See what each stage includes
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Rewrite `components/sections/Workbench.tsx`**

```tsx
"use client";

import { Check, RotateCcw, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ctaClassName } from "@/components/ui/CtaLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DEMO_RECEIPT_TITLE, DEMO_STEPS, minutesAfter } from "@/lib/demo";

const STEP_MS = 650;
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** One customer order, done by hand and then handled for you. Only moves when the visitor presses the button. */
export function Workbench() {
  const [done, setDone] = useState(0);
  const timersRef = useRef<number[]>([]);
  const total = DEMO_STEPS.length;
  const running = done > 0 && done < total;

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.splice(0).forEach((id) => window.clearTimeout(id));
  }, []);

  const automate = () => {
    const timers = timersRef.current;
    timers.splice(0).forEach((id) => window.clearTimeout(id));
    if (prefersReducedMotion()) {
      setDone(total);
      return;
    }
    setDone(0);
    DEMO_STEPS.forEach((_, i) => timers.push(window.setTimeout(() => setDone(i + 1), STEP_MS * (i + 1))));
  };

  const reset = () => {
    timersRef.current.splice(0).forEach((id) => window.clearTimeout(id));
    setDone(0);
  };

  const minutes = minutesAfter("auto", done);

  return (
    <section aria-labelledby="bench-title" className="border-b border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="bench-title"
          title="Every order you handle by hand is time you never get back."
          lede="Here's one customer order, done by hand and then handled for you. Press the button to see the difference."
        />

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
          <figure className="rounded-lg border border-line bg-mist p-7">
            <figcaption className="text-[15px] text-muted">Tuesday, by hand</figcaption>
            <p className="mt-3 font-serif text-[1.25rem] font-semibold text-ink">{DEMO_RECEIPT_TITLE}</p>
            <ul className="mt-3 space-y-2">
              {DEMO_STEPS.map((step, i) => (
                <li key={step.manual}>
                  <span className="strike" data-struck={i < done}>
                    {step.manual}
                  </span>
                </li>
              ))}
            </ul>
          </figure>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={done >= total ? reset : automate}
              disabled={running}
              className={ctaClassName("primary", "disabled:cursor-wait disabled:opacity-80")}
            >
              {done >= total ? (
                <>
                  <RotateCcw aria-hidden className="h-4 w-4" /> Do it by hand again
                </>
              ) : (
                <>
                  <Zap aria-hidden className="h-4 w-4" /> Handle it for me
                </>
              )}
            </button>
          </div>

          <div className="rounded-lg border border-line bg-paper p-7">
            <p className="text-[15px] text-muted">Order #1042, handled for you</p>
            <ul className="mt-3">
              {DEMO_STEPS.map((step, i) => {
                const on = i < done;
                return (
                  <li key={step.auto} className="flex min-h-12 items-center gap-3 border-b border-line py-2.5 last:border-b-0">
                    {on ? (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-paper">
                        <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="h-6 w-6 shrink-0 rounded-full border border-dashed border-muted/50" />
                    )}
                    <span className={on ? "text-ink" : "text-muted"}>{step.auto}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
              <span className="font-serif text-[1.25rem] font-semibold text-ink">Your time</span>
              <span aria-hidden className="font-serif text-[1.75rem] font-semibold text-ink tabular-nums">
                {minutes} min
              </span>
            </div>
            <p className="sr-only" aria-live="polite">
              {done >= total ? "Handled for you: every step done, 0 minutes of your time." : ""}
            </p>
            <p className="mt-3 text-[14px] text-muted">Example for illustration. Your times will vary.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Rewrite `components/sections/Industries.tsx`**

```tsx
import { BriefcaseBusiness, ShoppingCart, Stethoscope, Store, TreePalm, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredIndustries, moreIndustries, type FeaturedIndustryIcon } from "@/lib/site";

const icons: Record<FeaturedIndustryIcon, LucideIcon> = {
  cart: ShoppingCart,
  food: UtensilsCrossed,
  palm: TreePalm,
  health: Stethoscope,
  briefcase: BriefcaseBusiness,
  store: Store,
};

const moreList = `${moreIndustries.slice(0, -1).join(", ")} and ${moreIndustries[moreIndustries.length - 1]}`;

export function Industries() {
  return (
    <section aria-labelledby="industries-title" className="border-b border-line bg-mist">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="industries-title"
          title="From the corner shop to the established company."
          lede="We work around how your business already runs, not the other way round."
        />
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredIndustries.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li key={item.id} className="rounded-lg border border-line bg-paper p-7">
                <Icon aria-hidden className="h-6 w-6 text-mahogany" strokeWidth={1.75} />
                <h3 className="mt-5 font-serif text-[1.1875rem] leading-snug font-semibold text-ink">{item.name}</h3>
                <p className="mt-2 text-[16px] text-body">{item.copy}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 max-w-[70ch] text-body">
          We also work with {moreList}. If your business runs on messages, spreadsheets or paperwork, we can help.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Write `components/sections/WhyUs.tsx`**

```tsx
import { SectionHeading } from "@/components/ui/SectionHeading";
import { whyUs } from "@/lib/site";

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="border-b border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading id="why-title" title="Why work with us" />
        <ul className="mt-12 grid gap-10 md:grid-cols-3">
          {whyUs.map((point) => (
            <li key={point.title}>
              <span aria-hidden className="block h-0.5 w-10 bg-mahogany" />
              <h3 className="mt-5 font-serif text-[1.25rem] leading-snug font-semibold text-ink">{point.title}</h3>
              <p className="mt-3 text-body">{point.copy}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 9: Rewrite `app/page.tsx` and delete the retired parts**

```tsx
import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { Hero } from "@/components/sections/Hero";
import { Industries } from "@/components/sections/Industries";
import { Lanes } from "@/components/sections/Lanes";
import { Pains } from "@/components/sections/Pains";
import { Stages } from "@/components/sections/Stages";
import { WhyUs } from "@/components/sections/WhyUs";
import { Workbench } from "@/components/sections/Workbench";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Pains />
      <Stages />
      <Workbench />
      <Industries />
      <WhyUs />
      <Lanes title="Two ways to start" />
      <ContactSection />
    </>
  );
}
```

```bash
git rm -q components/sections/AutomateList.tsx components/sections/PageIndex.tsx components/ui/Label.tsx
grep -rn "AutomateList\|PageIndex\|ui/Label" app components || echo "no references left"
```

Expected: `no references left`.

- [ ] **Step 10: Run tests, type check and lint**

Run: `npm test && npx next typegen && npx tsc --noEmit && npm run lint`
Expected: PASS; tsc and lint exit 0.

- [ ] **Step 11: Look at it**

Run `npm run dev` and open `http://localhost:3000` at 360px, 768px and 1280px wide. Check that:
- the headline wraps cleanly with no horizontal scroll
- the "Handle it for me" button strikes through each line and counts down to 0 min
- with reduced motion on, it jumps straight to 0 min
- the logo panel shows only on wide screens
- the form sits at the bottom with the sales email beside it

Stop the server.

- [ ] **Step 12: Commit**

```bash
git add -A app components tests
git commit -m "feat: partner-led home page with stages, proof, industries, lanes and form"
```

---

### Task 10: Services page

**Files:**
- Create: `components/sections/ServiceStage.tsx`, `components/sections/ImproveExamples.tsx`, `app/services/page.tsx`
- Create test: `tests/services.test.ts`

**Interfaces:**
- Consumes: `stages`, `Stage`, `improveExamples` (lib/site); `PageHeader`, `ClosingBand`.
- Produces: `ServiceStage({ stage: Stage; index: number; children?: ReactNode })`, which renders `<section id={stage.id}>` (anchors `#understand`, `#improve`, `#build`, `#support`, matching the Task 6 redirect targets). Also `ImproveExamples()`.

- [ ] **Step 1: Write the failing test**

Create `tests/services.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

test("services page: one section per stage, then the closing band", () => {
  const page = read("app/services/page.tsx");
  assert.match(page, /export const metadata/);
  assert.match(page, /canonical: "\/services"/);
  assert.match(page, /stages\.map/);
  assert.match(page, /<ServiceStage/);
  assert.match(page, /<ImproveExamples/);
  assert.match(page, /<ClosingBand/);
  assert.match(page, /<PageHeader/);
});

test("each stage section carries its anchor and both lists", () => {
  const stage = read("components/sections/ServiceStage.tsx");
  assert.match(stage, /id=\{stage\.id\}/);
  assert.match(stage, /You might need this if/);
  assert.match(stage, /What we do/);
  assert.match(stage, /stage\.optional/);
});

test("improve examples come from the copy file", () => {
  assert.match(read("components/sections/ImproveExamples.tsx"), /improveExamples\.map/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/services.test.ts`
Expected: FAIL with ENOENT for `app/services/page.tsx`.

- [ ] **Step 3: Write `components/sections/ServiceStage.tsx`**

```tsx
import { Check } from "lucide-react";
import type { ReactNode } from "react";
import type { Stage } from "@/lib/site";

export function ServiceStage({ stage, index, children }: { stage: Stage; index: number; children?: ReactNode }) {
  const shaded = index % 2 === 1;
  return (
    <section id={stage.id} aria-labelledby={`${stage.id}-title`} className={`border-b border-line ${shaded ? "bg-mist" : ""}`}>
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <p className="font-serif text-[1.125rem] font-semibold text-mahogany">
            {index + 1}. {stage.name}
            {stage.optional ? <span className="ml-2 font-sans text-[15px] font-normal text-muted">Optional</span> : null}
          </p>
          <h2
            id={`${stage.id}-title`}
            className="mt-3 font-serif text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.18] font-semibold text-balance text-ink"
          >
            {stage.title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-body">{stage.summary}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-[16px] font-semibold text-ink">You might need this if</h3>
            <ul className="mt-3 space-y-3">
              {stage.needIf.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-mahogany" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-ink">What we do</h3>
            <ul className="mt-3 space-y-3">
              {stage.weDo.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <Check aria-hidden className="mt-[0.3em] h-4 w-4 shrink-0 text-success" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {children ? <div className="lg:col-span-2">{children}</div> : null}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Write `components/sections/ImproveExamples.tsx`**

```tsx
import { improveExamples } from "@/lib/site";

export function ImproveExamples() {
  return (
    <div className="rounded-lg border border-line bg-paper">
      <h3 className="border-b border-line px-6 py-4 font-serif text-[1.125rem] font-semibold text-ink">Common fixes</h3>
      <ul>
        {improveExamples.map((example) => (
          <li key={example.id} className="grid gap-1 border-b border-line px-6 py-4 last:border-b-0 md:grid-cols-2 md:gap-8">
            <p className="text-ink">“{example.pain}”</p>
            <p className="text-body">{example.fix}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

- [ ] **Step 5: Write `app/services/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { ImproveExamples } from "@/components/sections/ImproveExamples";
import { ServiceStage } from "@/components/sections/ServiceStage";
import { stages } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services | Vision Forge Studio",
  description:
    "Business reviews and consultation, process improvement and automation, websites and custom systems, plus optional training and support. For businesses big and small in Belize.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        title="How we help your business"
        lede="Every business is different, so we start by understanding yours. Then we improve how it runs and build what it needs. Training and support are there if you want them."
      >
        <nav aria-label="Services on this page">
          <ul className="flex flex-wrap gap-2">
            {stages.map((stage) => (
              <li key={stage.id}>
                <a
                  href={`#${stage.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-paper px-4 text-[15px] text-ink transition-colors hover:border-ink"
                >
                  {stage.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      {stages.map((stage, index) => (
        <ServiceStage key={stage.id} stage={stage} index={index}>
          {stage.id === "improve" ? <ImproveExamples /> : null}
        </ServiceStage>
      ))}
      <ClosingBand />
    </>
  );
}
```

- [ ] **Step 6: Run tests, type check and lint**

Run: `npm test && npx next typegen && npx tsc --noEmit && npm run lint`
Expected: PASS; tsc and lint exit 0.

- [ ] **Step 7: Commit**

```bash
git add app/services components/sections/ServiceStage.tsx components/sections/ImproveExamples.tsx tests/services.test.ts
git commit -m "feat: Services page organised by the four stages"
```

---

### Task 11: How we work page

**Files:**
- Create: `components/sections/ProcessSteps.tsx`
- Rewrite: `app/how-we-work/page.tsx`
- Delete: `components/sections/Timeline.tsx`, `components/sections/Promises.tsx`
- Create test: `tests/how-we-work.test.ts`

**Interfaces:**
- Consumes: `howWeWorkSteps`, `afterLaunch`, `questions` (lib/site); `Faq` (Task 7); `PageHeader`, `ClosingBand`, `SectionHeading`.
- Produces: `ProcessSteps()`.

- [ ] **Step 1: Write the failing test**

Create `tests/how-we-work.test.ts`:

```ts
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

test("how we work: steps, the new FAQ with structured data, and the closing band", () => {
  const page = read("app/how-we-work/page.tsx");
  assert.match(page, /<ProcessSteps \/>/);
  assert.match(page, /<Faq items=\{questions\} \/>/);
  assert.match(page, /"FAQPage"/);
  assert.match(page, /questions\.map/);
  assert.match(page, /<ClosingBand \/>/);
  assert.match(page, /canonical: "\/how-we-work"/);
  assert.doesNotMatch(page, /Timeline|Promises/);
});

test("four numbered steps, then training and support set apart as optional", () => {
  const steps = read("components/sections/ProcessSteps.tsx");
  assert.match(steps, /<ol/);
  assert.match(steps, /howWeWorkSteps\.map/);
  assert.match(steps, /afterLaunch\.title/);
  assert.match(steps, /<aside/);
});

test("the old timeline and promises are gone", () => {
  for (const gone of ["components/sections/Timeline.tsx", "components/sections/Promises.tsx"]) {
    assert.equal(existsSync(new URL(gone, root)), false, gone);
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/how-we-work.test.ts`
Expected: FAIL. `<ProcessSteps />` is not in the page.

- [ ] **Step 3: Write `components/sections/ProcessSteps.tsx`**

```tsx
import { SectionHeading } from "@/components/ui/SectionHeading";
import { afterLaunch, howWeWorkSteps } from "@/lib/site";

export function ProcessSteps() {
  return (
    <section aria-labelledby="steps-title" className="border-b border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading id="steps-title" title="From first conversation to hand-over" />
        <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {howWeWorkSteps.map((step, index) => (
            <li key={step.title} className="border-t-2 border-ink pt-5">
              <span className="font-serif text-[1.5rem] font-semibold text-mahogany tabular-nums">{index + 1}</span>
              <h3 className="mt-2 font-serif text-[1.25rem] leading-snug font-semibold text-ink">{step.title}</h3>
              <p className="mt-3 text-[16px] text-body">{step.copy}</p>
            </li>
          ))}
        </ol>
        <aside aria-labelledby="after-launch-title" className="mt-12 rounded-lg border border-dashed border-muted/60 bg-mist p-7 md:p-8">
          <h3 id="after-launch-title" className="font-serif text-[1.25rem] font-semibold text-ink">
            {afterLaunch.title}
          </h3>
          <p className="mt-2 max-w-[62ch] text-body">{afterLaunch.copy}</p>
        </aside>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Rewrite `app/how-we-work/page.tsx` and delete the old sections**

```tsx
import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { Faq } from "@/components/sections/Faq";
import { ProcessSteps } from "@/components/sections/ProcessSteps";
import { questions } from "@/lib/site";

export const metadata: Metadata = {
  title: "How We Work | Vision Forge Studio",
  description:
    "A free first conversation, a look at how your business runs, a written plan with a fixed quote, and a build you test with us. Training and support if you want them.",
  alternates: { canonical: "/how-we-work" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: questions.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function HowWeWorkPage() {
  return (
    <>
      <PageHeader
        title="Here's what working with us looks like."
        lede="You tell us how your business runs in your own words. We learn it, send a written plan with a fixed quote, then build and test it with you."
      />
      <ProcessSteps />
      <Faq items={questions} />
      <ClosingBand />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
```

```bash
git rm -q components/sections/Timeline.tsx components/sections/Promises.tsx
```

- [ ] **Step 5: Run tests, type check and lint**

Run: `npm test && npx next typegen && npx tsc --noEmit && npm run lint`
Expected: PASS; tsc and lint exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A app/how-we-work components/sections tests/how-we-work.test.ts
git commit -m "feat: How we work page with four steps and optional training and support"
```

---

### Task 12: About page

**Files:**
- Create: `app/about/page.tsx`
- Create test: `tests/about.test.ts`

**Interfaces:**
- Consumes: `about` (lib/site); `PageHeader`, `ClosingBand`, `SectionHeading`.

- [ ] **Step 1: Write the failing test**

Create `tests/about.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = () => readFileSync(new URL("../app/about/page.tsx", import.meta.url), "utf8");

test("about: why we exist, what we believe, Belizean-owned, then the closing band", () => {
  const src = page();
  assert.match(src, /export const metadata/);
  assert.match(src, /canonical: "\/about"/);
  assert.match(src, /about\.story\.map/);
  assert.match(src, /about\.beliefs\.map/);
  assert.match(src, /about\.owned/);
  assert.match(src, /<ClosingBand \/>/);
  assert.ok(src.indexOf("about.story") < src.indexOf("about.beliefs"));
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/about.test.ts`
Expected: FAIL with ENOENT for `app/about/page.tsx`.

- [ ] **Step 3: Write `app/about/page.tsx`**

```tsx
import type { Metadata } from "next";
import { ClosingBand } from "@/components/layout/ClosingBand";
import { PageHeader } from "@/components/layout/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { about } from "@/lib/site";

export const metadata: Metadata = {
  title: "About | Vision Forge Studio",
  description:
    "Vision Forge Studio is a Belizean-owned team bringing technology to businesses big and small, built around how they actually work.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader title={about.title} lede={about.lede} />

      <section aria-labelledby="story-title" className="border-b border-line">
        <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <SectionHeading id="story-title" title="Why Vision Forge exists" />
          <div className="max-w-[62ch] space-y-5 text-body">
            {about.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="beliefs-title" className="border-b border-line bg-mist">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
          <SectionHeading id="beliefs-title" title="What we believe" />
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {about.beliefs.map((belief) => (
              <li key={belief.title} className="rounded-lg border border-line bg-paper p-7">
                <h3 className="font-serif text-[1.25rem] font-semibold text-ink">{belief.title}</h3>
                <p className="mt-3 text-body">{belief.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="owned-title" className="border-b border-line">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
          <SectionHeading id="owned-title" title="Belizean-owned" lede={about.owned} />
        </div>
      </section>

      <ClosingBand />
    </>
  );
}
```

- [ ] **Step 4: Run tests, type check and lint**

Run: `npm test && npx next typegen && npx tsc --noEmit && npm run lint`
Expected: PASS; tsc and lint exit 0.

- [ ] **Step 5: Commit**

```bash
git add app/about tests/about.test.ts
git commit -m "feat: About page"
```

---

### Task 13: Clean up leftovers and update the security docs

**Files:**
- Modify: `lib/site.ts` (delete superseded exports)
- Modify: `SECURITY.md`, `SECURITY-DEPLOYMENT.md`
- Create test: `tests/cleanup.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/cleanup.test.ts`:

```ts
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import * as siteModule from "../lib/site.ts";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

function sources(dir: string): string[] {
  return readdirSync(new URL(dir, root)).flatMap((name) => {
    const path = `${dir}${name}`;
    if (statSync(new URL(path, root)).isDirectory()) return sources(`${path}/`);
    return /\.(ts|tsx|css)$/.test(name) ? [path] : [];
  });
}

test("superseded copy exports are gone from lib/site.ts", () => {
  const exported = Object.keys(siteModule);
  for (const gone of [
    "hero",
    "automations",
    "industries",
    "industryRibbon",
    "websiteKinds",
    "websiteIncludes",
    "worksWith",
    "promises",
    "pageIndex",
    "steps",
    "faq",
    "tiers",
    "tierOrder",
    "featuredTier",
    "formatBZ",
    "priceNote",
    "navItems",
  ]) {
    assert.equal(exported.includes(gone), false, gone);
  }
  assert.equal("trustLine" in siteModule.site, false);
});

test("no dark-theme utilities, old fonts or all-caps labels survive in app or components", () => {
  const banned =
    /\b(?:text|bg|border|decoration|from|to|via)-(?:steel(?:-hi|-2)?|gold(?:-hi)?|on-gold|bg(?:-2|-3)?|line-2|paper-ink(?:-2)?|ink-red|done)\b|font-wide|font-hand|font-mono|className="label|emblem-|marquee/;
  for (const file of [...sources("app/"), ...sources("components/")]) {
    assert.doesNotMatch(read(file), banned, file);
  }
});

test("security docs describe the contact form and the sales address", () => {
  assert.doesNotMatch(read("SECURITY.md"), /support@/);
  const deployment = read("SECURITY-DEPLOYMENT.md");
  assert.match(deployment, /\/api\/contact/);
  assert.match(deployment, /Turnstile/);
  assert.doesNotMatch(deployment, /no contact form/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --experimental-strip-types --test tests/cleanup.test.ts`
Expected: FAIL on `hero` (still exported).

- [ ] **Step 3: Delete the superseded exports from `lib/site.ts`**

Delete these declarations entirely, including their doc comments and types:
- `trustLine` (the property inside `site`)
- `priceNote`, `hero`, `AutomationIcon`, `automations`, `IndustryIcon`, `industries`, `industryRibbon`, `websiteKinds`, `websiteIncludes`, `worksWith`, `promises`, `pageIndex`, `steps`, `faq`, `TierId`, `tiers`, `tierOrder`, `featuredTier`, `formatBZ`

The file should then contain, in order: `site`, `legalItems`, and the "Partner repositioning (October 2026)" block from Task 3.

Run: `npx next typegen && npx tsc --noEmit`
Expected: exit 0. Any error means a component still uses an old export. Switch it to the new copy (see Task 3's Interfaces) rather than restoring the export.

- [ ] **Step 4: Update the security docs**

In `SECURITY.md`, replace the reporting address: change `[support@visionforgestudio.app](mailto:support@visionforgestudio.app)` to `[sales@visionforgestudio.app](mailto:sales@visionforgestudio.app)`.

In `SECURITY-DEPLOYMENT.md`:
- Replace line 3 with:

```
This application is Next.js 16.3.8 with the App Router. Every page is prerendered static HTML except one route, `POST /api/contact`, which validates the contact form, checks a Cloudflare Turnstile token and emails the enquiry to sales@visionforgestudio.app through Resend. Its secrets (`RESEND_API_KEY`, `TURNSTILE_SECRET_KEY`) are Cloudflare Worker secrets, never source files. There are no accounts and no server actions. The only public contact is the form and a `mailto:` link.
```

- Replace the **Bot protection** bullet with:

```
- **Bot protection:** Enable Bot Fight Mode or a Super Bot Fight / Bot Management plan if the zone has it. The contact form already uses Turnstile and a honeypot field, so don't add a challenge for every visitor.
```

- Replace the **Rate limiting** bullet with:

```
- **Rate limiting:** Add a rate-limiting rule for `POST /api/contact`, for example 5 requests per minute per IP, with a block action. Turnstile stops most bots; this caps anything that gets through.
```

- [ ] **Step 5: Run all tests, type check and lint**

Run: `npm test && npx next typegen && npx tsc --noEmit && npm run lint`
Expected: PASS; tsc and lint exit 0.

- [ ] **Step 6: Commit**

```bash
git add -A lib SECURITY.md SECURITY-DEPLOYMENT.md tests/cleanup.test.ts
git commit -m "chore: drop superseded copy and document the contact form in security docs"
```

---

### Task 14: Verify the build, then launch

**Files:** none new, unless verification finds something to fix.

- [ ] **Step 1: Full check**

Run: `npm test && npx next typegen && npx tsc --noEmit && npm run lint && npm run build`
Expected: all pass. The build route list shows `/`, `/services`, `/how-we-work`, `/about`, `/get-started` and the legal pages as static (○), and `/api/contact` as dynamic (ƒ).

- [ ] **Step 2: Nothing banned made it into the built pages**

Run: `grep -rlE "615-?7575|613-?9219|wa\.me|support@visionforgestudio|tel:\+501" .next/server/app && echo "FOUND - fix before launch" || echo "clean"`
Expected: `clean`.

- [ ] **Step 3: Run the Workers preview and check routes, redirects and the API**

Run `npm run preview` in the background (it serves on `http://localhost:8787`), then:

```bash
for p in / /services /how-we-work /about /get-started /terms /privacy /disclaimer /cookies /sitemap.xml; do
  printf "%s %s\n" "$(curl -s -o /dev/null -w '%{http_code}' "localhost:8787$p")" "$p"
done
for p in /pricing /contact /automation /websites; do
  printf "%s " "$p"; curl -s -o /dev/null -D - "localhost:8787$p" | grep -iE "^HTTP|^location" | tr '\r\n' '  '; echo
done
curl -s -X POST localhost:8787/api/contact -H 'Content-Type: application/json' -d '{"name":""}'; echo
```

Expected:
- `200` for every page and for `/sitemap.xml`
- `/pricing` and `/contact`: `HTTP/1.1 301` with `location: /get-started`
- `/automation`: `301` with `location: /services#improve`
- `/websites`: `301` with `location: /services#build`
- the API returns `{"ok":false,"reason":"invalid",…}`

Stop the preview.

- [ ] **Step 4: Visual and accessibility pass**

For each page, check at 360px, 768px and 1280px widths (browser devtools, or Playwright screenshots if it can be installed):
- no horizontal scroll
- body text reads at 17/18px in Public Sans
- headings use Literata
- the logo looks right on white
- the keyboard focus ring is visible on every link, button and field
- the mobile "Get started" bar doesn't cover content and disappears on `/get-started`
- the form's error, sending and failure states read clearly

If Chrome is available, run `npx lighthouse http://localhost:8787/ --only-categories=accessibility --form-factor=mobile --quiet --chrome-flags="--headless"` for each page. Expected: accessibility ≥ 95. Fix anything below and re-run Step 1.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A && git commit -m "fix: verification follow-ups" || echo "nothing to commit"
```

- [ ] **Step 6: Launch (owner actions; needs the prerequisites at the top of this plan)**

1. **Resend:** verify `visionforgestudio.app` as a sending domain, adding the DNS records it shows in Cloudflare DNS. Create an API key, then run `npx wrangler secret put RESEND_API_KEY` and paste it.
2. **Turnstile:** create a widget for `visionforgestudio.app` in the Cloudflare dashboard. Run `npx wrangler secret put TURNSTILE_SECRET_KEY` with its secret key. Replace `TURNSTILE_SITE_KEY` in `lib/contact.ts` with its site key, then `npm test` and commit: `git commit -am "chore: production Turnstile site key"`.
3. **Rate limit:** add the `POST /api/contact` rule described in `SECURITY-DEPLOYMENT.md`.
4. **Deploy:** push to GitHub (the Cloudflare build deploys it), or run `npm run deploy`.
5. **Live checks on https://visionforgestudio.app:** send a real enquiry from `/get-started` and confirm it arrives at sales@ with reply-to set to the address you entered. Then open `/pricing` and `/automation` and confirm they land on the right pages.
6. **Privacy wording:** read the updated Privacy Policy once and confirm it matches how you handle enquiries.

---

## Self-review against the spec

| Spec requirement | Task |
|---|---|
| Partner positioning, hero copy, trust line | 3, 9 |
| "Our team" only, no headcount, names or roles | 3 (test), 12 |
| Remove phones, WhatsApp, support@; sales@ + form only; mobile bar → Get started | 7 (tests scan all source), 14 (build grep) |
| Metadata and OG updated | 7 (`site.title`/`description`, JSON-LD), page metadata in 8–12 |
| Pricing page removed; two lanes; "From BZ$500" in hero | 3, 6, 8, 9 |
| Services model: four stages, support optional | 3, 9, 10, 11 |
| Pages, nav, 301 redirects | 6, 7, 8, 10, 11, 12 |
| Home sections 1–8 in order | 9 |
| Services sections with "You might need this if", Improve examples | 10 |
| How we work: four steps, optional follow-on, FAQs | 3, 11 |
| About: why, beliefs, Belizean-owned with registration | 3, 12 |
| Get started: lanes, form fields, states, reply promise, sales@ | 4, 8 |
| Delivery via server route, Turnstile + honeypot | 4, 5, 8 |
| Mahogany tokens, contrast, Literata + Public Sans, type sizes | 2 |
| Sentence case, no all-caps labels, numbered only for sequences, minimal motion | 2, 7, 9, 13 |
| Testing and acceptance | 14 |
| Legal pages: factual fixes only | 7 |
