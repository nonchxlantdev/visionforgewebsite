# Automation-First Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the visionforgestudio.app homepage as one automation-first story ("Stop doing the same work twice") in an Apple-style light visual system.

**Architecture:** Content lives in `lib/site.ts`; pure logic in `lib/demo.ts` and `lib/project-builder.ts` (unit-tested with `node --test`). Sections are server components except `Demo`, `Start`/`StartCard` and `Navbar`/`MobileContactBar`. Scroll reveals are pure CSS (`animation-timeline: view()`, progressive enhancement) so content is visible without JavaScript; the forge Motion/canvas layer is removed.

**Tech Stack:** Next.js 16.3.8 App Router, React 19.3, Tailwind 4 (`@theme inline`), lucide-react, TypeScript, `node --experimental-strip-types --test`, OpenNext for Cloudflare Workers.

## Global Constraints

- `next` and `eslint-config-next` stay pinned at exactly `16.3.8`.
- Every email lowercase and a `mailto:` link; never call the business "Ltd"/"Limited".
- Registration line: "© 2026 Vision Forge. Registered in Belize under the Business Names Act, Cap. 247, Reg. No. 000058528. Trading as Vision Forge Studio."
- Every `target="_blank"` has `rel="noopener noreferrer"`; every link goes through `isSafeNavigationHref`; prefilled messages ≤ 500 chars.
- Tiers: Get found BZ$500 · Automate one task BZ$1,500 · Connect your business BZ$8,000. Every displayed price carries `*` and the `priceNote` small print.
- Fonts self-hosted (no Google Fonts requests). Single family: Inter variable.
- Text contrast ≥ 4.5:1; touch targets ≥ 44px; `prefers-reduced-motion` respected; no horizontal scroll at 390px.
- Tests import `.ts` with explicit extensions (tsconfig `allowImportingTsExtensions`).
- Code blocks below tagged `file=<path>` are the complete file contents.

---

### Task 1: Inter font, Studio-light tokens, root layout

**Files:**
- Create: `app/fonts/inter-variable.woff2` (from `@fontsource-variable/inter`)
- Rewrite: `app/globals.css`, `app/layout.tsx`
- Test: `tests/design.test.ts`

**Interfaces:**
- Produces Tailwind colours: `page canvas ink ink-2 hairline panel panel-2 panel-3 panel-ink panel-ink-2 accent accent-hover link link-dark done done-ink`; classes `.reveal`, `.text-gradient`, `.legal-prose`, `.site-header[data-scrolled]`.

- [ ] **Step 1: Write the failing test**

```ts file=tests/design.test.ts
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

test("studio-light tokens exist and the forge palette is gone", () => {
  for (const name of ["page", "canvas", "ink", "ink-2", "hairline", "panel", "panel-2", "panel-ink", "panel-ink-2", "accent", "link", "link-dark", "done", "done-ink"]) {
    token(name);
  }
  for (const old of ["--molten", "--ember", "--whitehot", "--soot", ".grain", ".hot-text", ".ingot"]) {
    assert.ok(!css.includes(old), old);
  }
  assert.match(css, /color-scheme: light/);
});

test("text colour pairs pass WCAG AA (4.5:1)", () => {
  const pairs: Array<[string, string]> = [
    ["ink", "page"],
    ["ink-2", "page"],
    ["ink-2", "canvas"],
    ["link", "page"],
    ["link", "canvas"],
    ["done-ink", "page"],
    ["panel-ink", "panel"],
    ["panel-ink-2", "panel"],
    ["panel-ink-2", "panel-2"],
    ["link-dark", "panel"],
    ["link-dark", "panel-2"],
  ];
  for (const [fg, bg] of pairs) {
    const ratio = contrast(token(fg), token(bg));
    assert.ok(ratio >= 4.5, `${fg} on ${bg} is ${ratio.toFixed(2)}`);
  }
  assert.ok(contrast("#ffffff", token("accent")) >= 4.5, "white on accent");
});

test("the layout self-hosts Inter only and is light", () => {
  const layout = read("app/layout.tsx");
  assert.ok(existsSync(new URL("app/fonts/inter-variable.woff2", root)));
  assert.match(layout, /inter-variable\.woff2/);
  assert.doesNotMatch(layout, /big-shoulders|instrument-sans|martian-mono|SparksProvider|grain/);
  assert.match(layout, /colorScheme: "light"/);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node --experimental-strip-types --test tests/design.test.ts`
Expected: FAIL (`missing token --page`).

- [ ] **Step 3: Add the font**

```bash
npm install --no-save @fontsource-variable/inter
cp node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2 app/fonts/inter-variable.woff2
```

- [ ] **Step 4: Write the tokens and layout**

```css file=app/globals.css
@import "tailwindcss";

:root {
  --page: #ffffff;
  --canvas: #f5f5f7;
  --ink: #1d1d1f;
  --ink-2: #6e6e73;
  --hairline: #d2d2d7;
  --panel: #000000;
  --panel-2: #1d1d1f;
  --panel-3: #2c2c2e;
  --panel-ink: #f5f5f7;
  --panel-ink-2: #a1a1a6;
  --accent: #0071e3;
  --accent-hover: #0077ed;
  --link: #0066cc;
  --link-dark: #2997ff;
  --done: #30d158;
  --done-ink: #1e7b34;
  --nav-h: 3.25rem;
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  color-scheme: light;
}

@theme inline {
  --color-page: var(--page);
  --color-canvas: var(--canvas);
  --color-ink: var(--ink);
  --color-ink-2: var(--ink-2);
  --color-hairline: var(--hairline);
  --color-panel: var(--panel);
  --color-panel-2: var(--panel-2);
  --color-panel-3: var(--panel-3);
  --color-panel-ink: var(--panel-ink);
  --color-panel-ink-2: var(--panel-ink-2);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-link: var(--link);
  --color-link-dark: var(--link-dark);
  --color-done: var(--done);
  --color-done-ink: var(--done-ink);
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

html {
  scroll-padding-top: var(--nav-h);
}

html,
body {
  overflow-x: clip;
  background: var(--page);
}

body {
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 1.0625rem;
  line-height: 1.5;
  letter-spacing: -0.011em;
  text-rendering: optimizeLegibility;
}

::selection {
  background: rgb(0 113 227 / 0.2);
}

@layer base {
  :focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 3px;
    border-radius: 6px;
  }
}

/* Scroll reveal: progressive enhancement, content is visible without it. */
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }

  @supports (animation-timeline: view()) {
    .reveal {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 35%;
    }
  }
}

.text-gradient {
  background: linear-gradient(90deg, #0071e3 0%, #00a3c4 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.site-header[data-scrolled="true"] .nav-shell {
  background: rgb(255 255 255 / 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  border-bottom-color: rgb(0 0 0 / 0.08);
}

/* ---------- legal ---------- */

.legal-prose h2 {
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--ink);
  margin-top: 3rem;
  scroll-margin-top: calc(var(--nav-h) + 1.5rem);
}

.legal-prose p,
.legal-prose li {
  color: #424245;
  margin-top: 1rem;
}

.legal-prose ul {
  list-style: disc;
  padding-left: 1.25rem;
}

.legal-prose a {
  color: var(--link);
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

  .legal-prose a::after {
    content: " (" attr(href) ")";
  }
}

@media (prefers-reduced-transparency: reduce) {
  .site-header[data-scrolled="true"] .nav-shell {
    background: var(--page);
    backdrop-filter: none;
  }
}
```

```tsx file=app/layout.tsx
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { MobileContactBar } from "@/components/layout/MobileContactBar";
import { Navbar } from "@/components/layout/Navbar";
import { site } from "@/lib/site";
import "./globals.css";

const inter = localFont({
  src: "./fonts/inter-variable.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.name,
    locale: "en_US",
    images: [
      {
        url: "/brand/vision-forge-logo.png",
        width: 819,
        height: 819,
        alt: "Vision Forge Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/brand/vision-forge-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

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
  telephone: "+501-613-9219",
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
      telephone: "+501-615-7575",
      contactType: "sales",
      email: site.sales.display,
      availableLanguage: ["English"],
      url: site.whatsapp.href,
    },
    {
      "@type": "ContactPoint",
      telephone: "+501-613-9219",
      contactType: "customer support",
      email: site.support.display,
      availableLanguage: ["English"],
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-page pb-[calc(4.75rem+env(safe-area-inset-bottom))] font-sans text-ink antialiased md:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-full focus:bg-accent focus:px-4 focus:py-3 focus:text-white"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <MobileContactBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Run the test**

Run: `node --experimental-strip-types --test tests/design.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit** — `git add app/globals.css app/layout.tsx app/fonts/inter-variable.woff2 tests/design.test.ts && git commit -m "feat: studio-light tokens and Inter"`

---

### Task 2: Site content (`lib/site.ts`)

**Files:**
- Rewrite: `lib/site.ts`
- Test: `tests/clarity.test.ts` (content parts; page-structure parts land in Task 8)

**Interfaces:**
- Produces: `site` (adds `trustLine`; drops `tagline`), `navItems` (ids `how automate pricing faq contact`), `legalItems`, `priceNote`, `hero {kicker,title: [string,string],lede,primary,secondary,trust,flow}`, `automations[] {id,icon: AutomationIcon,pain,fix}`, `steps[] {title,copy}`, `faq[] {q,a,link?}`, `TierId = "found"|"automate"|"connect"`, `tiers[id] {id,label,from,weeks,copy,includes}`, `tierOrder`, `featuredTier`, `formatBZ(n)`.

- [ ] **Step 1: Write the failing test**

```ts file=tests/clarity.test.ts
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { automations, faq, featuredTier, hero, navItems, steps, tierOrder, tiers } from "../lib/site.ts";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

function sources(dir: string): string[] {
  const base = new URL(dir, root);
  return readdirSync(base).flatMap((name) => {
    const path = `${dir}${name}`;
    if (statSync(new URL(path, root)).isDirectory()) return sources(`${path}/`);
    return /\.(ts|tsx|css)$/.test(name) ? [path] : [];
  });
}

test("the hero leads with the automation promise and the starting price", () => {
  assert.equal(hero.title.join(" "), "Stop doing the same work twice.");
  assert.match(hero.lede, /WhatsApp/);
  assert.match(hero.lede, /websites too/i);
  assert.match(hero.trust, /BZ\$500\*/);
  assert.equal(hero.primary, "See how it works");
});

test("six everyday problems, in the customer's words, ending with the website", () => {
  assert.equal(automations.length, 6);
  assert.ok(automations.some((a) => a.pain === "My sales and my accounts never match up."));
  assert.equal(automations[automations.length - 1].id, "website");
  for (const a of automations) {
    assert.ok(a.pain.endsWith("."), a.id);
    assert.ok(a.fix.length > 20, a.id);
  }
  assert.ok(!automations.some((a) => /talk to each other/i.test(a.pain)));
});

test("three outcome tiers at 500, 1,500 and 8,000 with automate featured", () => {
  assert.deepEqual([...tierOrder], ["found", "automate", "connect"]);
  assert.deepEqual(
    tierOrder.map((id) => tiers[id].from),
    [500, 1500, 8000],
  );
  assert.deepEqual(
    tierOrder.map((id) => tiers[id].label),
    ["Get found", "Automate one task", "Connect your business"],
  );
  assert.equal(featuredTier, "automate");
  for (const id of tierOrder) assert.ok(tiers[id].includes.length >= 3, id);
});

test("four steps, nine FAQs including the two automation questions", () => {
  assert.equal(steps.length, 4);
  assert.ok(faq.length >= 9);
  const questions = faq.map((f) => f.q);
  assert.ok(questions.includes("Do I have to change the software I already use?"));
  assert.ok(questions.includes("Is automation only for big companies?"));
  assert.match(faq.find((f) => f.q === "How much will my project cost?")!.a, /BZ\$1,500/);
});

test("the nav follows the page story", () => {
  assert.deepEqual(
    navItems.map((n) => n.id),
    ["how", "automate", "pricing", "faq", "contact"],
  );
});

test("forge styling and jargon are gone from the app", () => {
  const files = [...sources("app/"), ...sources("components/"), "lib/site.ts"];
  const banned = /\bmolten\b|\bember\b|whitehot|HeatText|SparkField|useSparks|font-display|chrome-text|hot-text|\bsoot\b|Strike while|Raw materials/;
  for (const file of files) assert.doesNotMatch(read(file), banned, file);
  for (const gone of ["components/forge", "components/builder", "components/sections/Doors.tsx", "components/sections/WhyUs.tsx", "components/visuals"]) {
    assert.equal(existsSync(new URL(gone, root)), false, gone);
  }
});

test("the homepage tells one story in order", () => {
  const page = read("app/page.tsx");
  const order = ["<Hero", "<Demo", "<Automate", "<HowItWorks", "<Pricing", "<Start", "<Faq", "<Contact"];
  const positions = order.map((tag) => page.indexOf(tag));
  for (const [i, pos] of positions.entries()) assert.ok(pos > -1, order[i]);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.match(page, /FAQPage/);
  assert.match(read("components/sections/Hero.tsx"), /<h1/);
});

test("prices carry the small-print note wherever they appear", () => {
  for (const file of ["components/sections/Pricing.tsx", "components/sections/StartCard.tsx"]) {
    assert.match(read(file), /priceNote\.text/, file);
  }
  assert.match(read("lib/site.ts"), /not final quotes/);
  assert.match(read("app/disclaimer/page.tsx"), /id: "estimates"/);
});

test("the demo is operable by keyboard and announces its result", () => {
  const demo = read("components/sections/Demo.tsx");
  assert.match(demo, /type="radio"/);
  assert.match(demo, /aria-live="polite"/);
  assert.match(demo, /prefers-reduced-motion/);
  assert.match(demo, /<noscript>/);
});
```

- [ ] **Step 2: Run** `node --experimental-strip-types --test tests/clarity.test.ts` — Expected: FAIL (`automations` not exported).

- [ ] **Step 3: Write the content**

```ts file=lib/site.ts
export const site = {
  name: "Vision Forge Studio",
  domain: "visionforgestudio.app",
  url: "https://visionforgestudio.app",
  title: "Business Automation & Websites in Belize | Vision Forge Studio",
  description:
    "Vision Forge Studio connects and automates the tools Belizean businesses already use, like WhatsApp, spreadsheets and accounting software, and builds websites. Prices from BZ$500. Free first consultation.",
  trustLine: "10+ years building software · Based in Belize · Real support after launch",
  whatsapp: {
    label: "WhatsApp",
    display: "+501 615-7575",
    href: "https://wa.me/5016157575",
  },
  phone: {
    label: "Call",
    display: "+501 613-9219",
    href: "tel:+5016139219",
  },
  sales: {
    label: "Sales",
    display: "sales@visionforgestudio.app",
    href: "mailto:sales@visionforgestudio.app",
  },
  support: {
    label: "Support",
    display: "support@visionforgestudio.app",
    href: "mailto:support@visionforgestudio.app",
  },
  projectMailto: "mailto:sales@visionforgestudio.app?subject=New%20project%20enquiry",
  legal: {
    registeredName: "Vision Forge",
    tradingName: "Vision Forge Studio",
    form: "partnership",
    registeredUnder: "Business Names Act, Chapter 247",
    registrationNumber: "000058528",
    jurisdiction: "Belize",
    lastUpdated: "6 October 2026",
    copyrightYear: 2026,
  },
} as const;

export const navItems = [
  { href: "/#how", id: "how", label: "How it works" },
  { href: "/#automate", id: "automate", label: "What we automate" },
  { href: "/#pricing", id: "pricing", label: "Pricing" },
  { href: "/#faq", id: "faq", label: "FAQ" },
  { href: "/#contact", id: "contact", label: "Contact" },
] as const;

export const legalItems = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/cookies", label: "Cookies" },
] as const;

/** Small-print reminder shown next to every price on the site. */
export const priceNote = {
  text: "Prices shown are typical starting points, not final quotes. Your final price is confirmed in a written quote after we discuss your project.",
  href: "/disclaimer#estimates",
  linkLabel: "Read more",
} as const;

export const hero = {
  kicker: "Automation and websites · Belize",
  title: ["Stop doing the", "same work twice."],
  lede: "We connect the tools your business already uses, like WhatsApp, spreadsheets and your accounting software, so orders, invoices and reports happen on their own. We build websites too.",
  primary: "See how it works",
  secondary: "WhatsApp us",
  trust: "Based in Belize · Prices from BZ$500* · Free first consultation",
  flow: ["WhatsApp order", "Spreadsheet", "Invoice", "Reminder"],
} as const;

export type AutomationIcon = "wallet" | "forms" | "bookings" | "reports" | "accounts" | "website";

export const automations = [
  {
    id: "payments",
    icon: "wallet",
    pain: "I chase people to pay every week.",
    fix: "Automatic payment reminders on WhatsApp or email.",
  },
  {
    id: "forms",
    icon: "forms",
    pain: "My staff still fill in paper forms.",
    fix: "Forms on a phone that go straight into a report.",
  },
  {
    id: "bookings",
    icon: "bookings",
    pain: "Bookings get lost in my messages.",
    fix: "Customers book themselves; you get reminders.",
  },
  {
    id: "reports",
    icon: "reports",
    pain: "Every Friday I rebuild the same report.",
    fix: "A live dashboard that updates itself.",
  },
  {
    id: "accounts",
    icon: "accounts",
    pain: "My sales and my accounts never match up.",
    fix: "Your sales flow straight into your books.",
  },
  {
    id: "website",
    icon: "website",
    pain: "People can't find us online.",
    fix: "A fast website set up on Google, with WhatsApp buttons.",
  },
] as const satisfies ReadonlyArray<{ id: string; icon: AutomationIcon; pain: string; fix: string }>;

export const steps = [
  { title: "Tell us what's slowing you down.", copy: "A free chat on WhatsApp, by phone or in person." },
  {
    title: "We map it and send a fixed quote.",
    copy: "You see exactly what we'll build and what it costs before anything starts.",
  },
  {
    title: "We build it and set it up with your team.",
    copy: "We test it with your real work and show everyone how it runs.",
  },
  { title: "We stay on for support.", copy: "Fixes, updates and the next idea when you're ready for it." },
] as const;

export const faq = [
  {
    q: "Do I need to know anything technical?",
    a: "No. Tell us how your business works in your own words; we handle the technical side and explain things plainly.",
  },
  {
    q: "Do I have to change the software I already use?",
    a: "Usually not. Most of the time we connect what you already have, like WhatsApp, your spreadsheets and your accounting software.",
  },
  {
    q: "Is automation only for big companies?",
    a: "No. Most first projects automate one task, like invoices or payment reminders, and start from BZ$1,500.",
  },
  {
    q: "How much will my project cost?",
    a: "It depends on what you need. Websites start from BZ$500 and automation from BZ$1,500, and every project gets a fixed written quote before work starts.",
  },
  {
    q: "How long does it take?",
    a: "Most websites and single automations take 2–4 weeks. Bigger projects take longer; your quote includes a timeline.",
  },
  {
    q: "Who owns what you build?",
    a: "You do, once it's paid for. See our Terms of Service for details.",
    link: { href: "/terms", label: "Terms of Service" },
  },
  {
    q: "Can you fix or improve my existing website?",
    a: "Yes. Send us the link and tell us what's not working.",
  },
  {
    q: "Do you handle hosting and the domain?",
    a: "We can set up and manage hosting and your domain, or work with what you already have.",
  },
  {
    q: "What happens after launch?",
    a: "We show your team how to use it and stay available for support, updates and new features.",
  },
] as const;

export type TierId = "found" | "automate" | "connect";

/** Starting points shown on the pricing cards and used by the "slowing you down" picker. */
export const tiers = {
  found: {
    id: "found",
    label: "Get found",
    from: 500,
    weeks: "2–4 weeks",
    copy: "A website or landing page, set up on Google, with WhatsApp and call buttons.",
    includes: ["Business website or landing page", "Set up on Google", "WhatsApp and call buttons", "Fast on any phone"],
  },
  automate: {
    id: "automate",
    label: "Automate one task",
    from: 1500,
    weeks: "2–4 weeks",
    copy: "One job taken off your plate, like orders into a sheet with automatic invoices, or payment reminders.",
    includes: ["Orders saved to a spreadsheet", "Automatic invoices", "Payment or booking reminders", "Works with WhatsApp"],
  },
  connect: {
    id: "connect",
    label: "Connect your business",
    from: 8000,
    weeks: "8+ weeks",
    copy: "Several tools working together, plus staff portals, digital forms and dashboards.",
    includes: ["Sales flowing into your books", "Staff portals and digital forms", "Live dashboards", "Several tools working together"],
  },
} as const;

export const tierOrder: readonly TierId[] = ["found", "automate", "connect"];
export const featuredTier: TierId = "automate";

export function formatBZ(amount: number): string {
  return `BZ$${amount.toLocaleString("en-US")}`;
}
```

- [ ] **Step 4: Run** the content tests: `node --experimental-strip-types --test --test-name-pattern="hero|six|tiers|steps|nav" tests/clarity.test.ts` — Expected: those 5 PASS (structure tests pass after Task 8).

- [ ] **Step 5: Commit** — `git commit -am "feat: automation-first content"`

---

### Task 3: Demo logic (`lib/demo.ts`)

**Files:** Create `lib/demo.ts`; Test `tests/demo.test.ts`

**Interfaces:**
- Produces: `type DemoMode = "manual" | "auto"`, `DEMO_STEPS: readonly {manual,auto,minutes}[]` (4), `MANUAL_MINUTES = 12`, `DEMO_ORDER: string`, `DEMO_REPLY: string`, `STEP_DELAY_MS: {manual: 1100, auto: 450}`, `minutesAfter(mode, completed): number`.

- [ ] **Step 1: Write the failing test**

```ts file=tests/demo.test.ts
import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_ORDER, DEMO_STEPS, MANUAL_MINUTES, minutesAfter, STEP_DELAY_MS } from "../lib/demo.ts";

test("four steps, each with a manual and an automated label", () => {
  assert.equal(DEMO_STEPS.length, 4);
  assert.deepEqual(
    DEMO_STEPS.map((s) => s.auto),
    ["Order saved to your sheet", "Invoice created", "Customer gets the total on WhatsApp", "Payment reminder sent on its own"],
  );
  assert.equal(DEMO_STEPS[0].manual, "Copy the order into a spreadsheet");
  assert.match(DEMO_ORDER, /WhatsApp|water/);
});

test("doing it by hand adds up to 12 minutes", () => {
  assert.equal(MANUAL_MINUTES, 12);
  assert.equal(minutesAfter("manual", 0), 0);
  assert.equal(minutesAfter("manual", 2), DEMO_STEPS[0].minutes + DEMO_STEPS[1].minutes);
  assert.equal(minutesAfter("manual", 4), 12);
});

test("automating counts down to zero minutes of your time", () => {
  assert.equal(minutesAfter("auto", 0), 12);
  assert.equal(minutesAfter("auto", 4), 0);
  assert.ok(minutesAfter("auto", 2) < 12);
});

test("out-of-range progress is clamped", () => {
  assert.equal(minutesAfter("manual", -3), 0);
  assert.equal(minutesAfter("manual", 99), 12);
  assert.equal(minutesAfter("auto", 99), 0);
});

test("automated replay takes about two seconds and is faster than manual", () => {
  assert.ok(STEP_DELAY_MS.auto * DEMO_STEPS.length <= 2000);
  assert.ok(STEP_DELAY_MS.manual > STEP_DELAY_MS.auto * 2);
});
```

- [ ] **Step 2: Run** `node --experimental-strip-types --test tests/demo.test.ts` — Expected: FAIL (module not found).

- [ ] **Step 3: Implement**

```ts file=lib/demo.ts
export type DemoMode = "manual" | "auto";

/** One WhatsApp order, handled by hand or automatically. Minutes are illustrative. */
export const DEMO_STEPS = [
  { manual: "Copy the order into a spreadsheet", auto: "Order saved to your sheet", minutes: 4 },
  { manual: "Write the invoice by hand", auto: "Invoice created", minutes: 4 },
  { manual: "Text the customer the total", auto: "Customer gets the total on WhatsApp", minutes: 2 },
  { manual: "Remind them to pay", auto: "Payment reminder sent on its own", minutes: 2 },
] as const;

export const MANUAL_MINUTES = DEMO_STEPS.reduce((sum, step) => sum + step.minutes, 0);

export const DEMO_ORDER = "Hi, can I get 2 cases of water and 1 bag of rice for Thursday?";
export const DEMO_REPLY = "Thanks Maria! Your total is BZ$46.00. Invoice attached.";

export const STEP_DELAY_MS = { manual: 1100, auto: 450 } as const;

/** Minutes of the owner's time shown on the counter after `completed` steps. */
export function minutesAfter(mode: DemoMode, completed: number): number {
  const count = Math.min(DEMO_STEPS.length, Math.max(0, Math.floor(completed)));
  const spent = DEMO_STEPS.slice(0, count).reduce((sum, step) => sum + step.minutes, 0);
  return mode === "manual" ? spent : MANUAL_MINUTES - spent;
}
```

- [ ] **Step 4: Run** — Expected: PASS (5 tests).
- [ ] **Step 5: Commit** — `git add lib/demo.ts tests/demo.test.ts && git commit -m "feat: demo timing logic"`

---

### Task 4: "What's slowing you down?" logic (`lib/project-builder.ts`)

**Files:** Rewrite `lib/project-builder.ts`; Test `tests/project-builder.test.ts`

**Interfaces:**
- Consumes: `tiers`, `tierOrder`, `formatBZ`, `site`, `TierId` (Task 2); `MAX_MESSAGE`, `mailtoHref`, `strictEncode` (`lib/safe-href.ts`).
- Produces: `Problem`, `Budget`, `StartState {problems: Problem[]; budget: Budget}`, `PROBLEMS`, `BUDGETS`, `EMPTY_STATE`, `toggleProblem`, `suggestedTier`, `budgetFit`, `canSend`, `suggestion(state): {tier, headline, budgetLine}`, `buildMessage`, `whatsappHref`, `emailHref`.

- [ ] **Step 1: Write the failing test**

```ts file=tests/project-builder.test.ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  budgetFit,
  buildMessage,
  canSend,
  emailHref,
  EMPTY_STATE,
  suggestedTier,
  suggestion,
  toggleProblem,
  whatsappHref,
  type StartState,
} from "../lib/project-builder.ts";
import { isSafeNavigationHref } from "../lib/safe-href.ts";

const base: StartState = { problems: ["orders", "payments"], budget: "to8000" };

test("each problem points to a tier and the highest wins", () => {
  assert.equal(suggestedTier(["website"]), "found");
  assert.equal(suggestedTier(["orders"]), "automate");
  assert.equal(suggestedTier(["website", "bookings"]), "automate");
  assert.equal(suggestedTier(["forms", "accounts"]), "connect");
  assert.equal(suggestedTier(["reports"]), "connect");
  assert.equal(suggestedTier(["unsure"]), null);
  assert.equal(suggestedTier([]), null);
});

test("'Not sure yet' is exclusive and order is canonical", () => {
  assert.deepEqual(toggleProblem([], "payments"), ["payments"]);
  assert.deepEqual(toggleProblem(["payments"], "orders"), ["orders", "payments"]);
  assert.deepEqual(toggleProblem(["orders", "payments"], "orders"), ["payments"]);
  assert.deepEqual(toggleProblem(["orders"], "unsure"), ["unsure"]);
  assert.deepEqual(toggleProblem(["unsure"], "website"), ["website"]);
  assert.deepEqual(toggleProblem(["unsure"], "unsure"), []);
});

test("budget fit: fits, a smaller first step, or unknown", () => {
  assert.deepEqual(budgetFit("found", "under1500"), { kind: "fits" });
  assert.deepEqual(budgetFit("automate", "under1500"), { kind: "smaller", startTier: "found" });
  assert.deepEqual(budgetFit("automate", "to8000"), { kind: "fits" });
  assert.deepEqual(budgetFit("connect", "to8000"), { kind: "fits" });
  assert.deepEqual(budgetFit("connect", "under1500"), { kind: "smaller", startTier: "found" });
  assert.deepEqual(budgetFit("connect", "over8000"), { kind: "fits" });
  assert.deepEqual(budgetFit("connect", "unsure"), { kind: "unknown" });
  assert.deepEqual(budgetFit(null, "to8000"), { kind: "unknown" });
});

test("the suggestion card reads plainly in every state", () => {
  assert.deepEqual(suggestion(EMPTY_STATE), {
    tier: null,
    headline: "Pick what's slowing you down and we'll suggest where to start.",
    budgetLine: null,
  });
  assert.deepEqual(suggestion({ problems: ["unsure"], budget: "unsure" }), {
    tier: null,
    headline: "No problem. Send it over and we'll suggest the right first step.",
    budgetLine: null,
  });
  assert.deepEqual(suggestion(base), {
    tier: "automate",
    headline: "Sounds like an “Automate one task” project.",
    budgetLine: "Your budget fits this.",
  });
  assert.deepEqual(suggestion({ problems: ["accounts"], budget: "under1500" }), {
    tier: "connect",
    headline: "Sounds like a “Connect your business” project.",
    budgetLine: "Your budget fits a smaller first step. We'd start with “Get found” and add the rest later.",
  });
  assert.equal(suggestion({ problems: ["website"], budget: "unsure" }).budgetLine, null);
});

test("the message lists the problems and budget, capped at 500 characters", () => {
  assert.equal(
    buildMessage(base),
    "Hi Vision Forge, here's what's slowing my business down: typing up orders and chasing payments. Budget: BZ$1,500–8,000. Can we talk?",
  );
  assert.equal(
    buildMessage({ problems: ["unsure"], budget: "unsure" }),
    "Hi Vision Forge, something's slowing my business down but I'm not sure where to start. Budget: Not sure. Can we talk?",
  );
  const all: StartState = { problems: ["orders", "payments", "forms", "bookings", "reports", "accounts", "website"], budget: "over8000" };
  assert.ok(buildMessage(all).length <= 500);
  assert.equal(buildMessage(EMPTY_STATE), "");
});

test("send links are safe and only exist once something is picked", () => {
  assert.equal(canSend(EMPTY_STATE), false);
  assert.equal(canSend(base), true);
  const wa = whatsappHref(base)!;
  assert.ok(wa.startsWith("https://wa.me/5016157575?text="));
  assert.equal(isSafeNavigationHref(wa), true);
  assert.equal(new URL(wa).searchParams.get("text"), buildMessage(base));
  const mail = emailHref(base)!;
  assert.ok(mail.startsWith("mailto:sales@visionforgestudio.app?subject=Project%20enquiry&body="));
  assert.equal(isSafeNavigationHref(mail), true);
  assert.equal(whatsappHref(EMPTY_STATE), undefined);
  assert.equal(emailHref(EMPTY_STATE), undefined);
});
```

- [ ] **Step 2: Run** `node --experimental-strip-types --test tests/project-builder.test.ts` — Expected: FAIL (`toggleProblem` not exported).

- [ ] **Step 3: Implement**

```ts file=lib/project-builder.ts
import { MAX_MESSAGE, mailtoHref, strictEncode } from "./safe-href.ts";
import { formatBZ, site, tierOrder, tiers, type TierId } from "./site.ts";

export type Problem = "orders" | "payments" | "forms" | "bookings" | "reports" | "accounts" | "website" | "unsure";
export type Budget = "under1500" | "to8000" | "over8000" | "unsure";

export type StartState = {
  problems: Problem[];
  budget: Budget;
};

export const PROBLEMS: ReadonlyArray<{ id: Problem; label: string; phrase: string; tier: TierId | null }> = [
  { id: "orders", label: "Typing up orders", phrase: "typing up orders", tier: "automate" },
  { id: "payments", label: "Chasing payments", phrase: "chasing payments", tier: "automate" },
  { id: "forms", label: "Paper forms", phrase: "paper forms", tier: "automate" },
  { id: "bookings", label: "Bookings", phrase: "keeping track of bookings", tier: "automate" },
  { id: "reports", label: "Weekly reports", phrase: "building weekly reports", tier: "connect" },
  { id: "accounts", label: "Sales and accounts don't match", phrase: "sales and accounts that don't match", tier: "connect" },
  { id: "website", label: "I need a website", phrase: "needing a website", tier: "found" },
  { id: "unsure", label: "Not sure yet", phrase: "not sure where to start", tier: null },
];

export const BUDGETS: ReadonlyArray<{ id: Budget; label: string; ceiling: number | null }> = [
  { id: "under1500", label: "Under BZ$1,500", ceiling: 1499 },
  { id: "to8000", label: "BZ$1,500–8,000", ceiling: 8000 },
  { id: "over8000", label: "BZ$8,000+", ceiling: Infinity },
  { id: "unsure", label: "Not sure", ceiling: null },
];

export const EMPTY_STATE: StartState = { problems: [], budget: "unsure" };

const problemOrder = PROBLEMS.map((p) => p.id);
const rank = (tier: TierId) => tierOrder.indexOf(tier);
const find = <T extends { id: string }>(list: ReadonlyArray<T>, id: string) => list.find((item) => item.id === id);
const article = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");
const quoted = (tier: TierId) => `“${tiers[tier].label}”`;

/** "Not sure yet" is exclusive; everything else toggles. Result keeps the canonical order. */
export function toggleProblem(selected: readonly Problem[], problem: Problem): Problem[] {
  if (problem === "unsure") return selected.includes("unsure") ? [] : ["unsure"];
  const next = new Set<Problem>(selected.filter((p) => p !== "unsure"));
  if (next.has(problem)) next.delete(problem);
  else next.add(problem);
  return problemOrder.filter((p) => next.has(p));
}

export function suggestedTier(problems: readonly Problem[]): TierId | null {
  let best: TierId | null = null;
  for (const problem of problems) {
    const tier = find(PROBLEMS, problem)?.tier ?? null;
    if (tier && (best === null || rank(tier) > rank(best))) best = tier;
  }
  return best;
}

export type Fit = { kind: "fits" } | { kind: "smaller"; startTier: TierId } | { kind: "unknown" };

export function budgetFit(tier: TierId | null, budget: Budget): Fit {
  const ceiling = find(BUDGETS, budget)?.ceiling ?? null;
  if (tier === null || ceiling === null) return { kind: "unknown" };
  if (ceiling >= tiers[tier].from) return { kind: "fits" };
  const affordable = tierOrder.filter((t) => tiers[t].from <= ceiling);
  return { kind: "smaller", startTier: affordable[affordable.length - 1] ?? "found" };
}

export function canSend(state: StartState): boolean {
  return state.problems.length > 0;
}

export type Suggestion = { tier: TierId | null; headline: string; budgetLine: string | null };

export function suggestion(state: StartState): Suggestion {
  if (!canSend(state)) {
    return { tier: null, headline: "Pick what's slowing you down and we'll suggest where to start.", budgetLine: null };
  }
  const tier = suggestedTier(state.problems);
  if (tier === null) {
    return { tier: null, headline: "No problem. Send it over and we'll suggest the right first step.", budgetLine: null };
  }
  const label = tiers[tier].label;
  const headline = `Sounds like ${article(label)} ${quoted(tier)} project.`;
  const fit = budgetFit(tier, state.budget);
  const budgetLine =
    fit.kind === "fits"
      ? "Your budget fits this."
      : fit.kind === "smaller"
        ? `Your budget fits a smaller first step. We'd start with ${quoted(fit.startTier)} and add the rest later.`
        : null;
  return { tier, headline, budgetLine };
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function buildMessage(state: StartState): string {
  if (!canSend(state)) return "";
  const budget = find(BUDGETS, state.budget)!.label;
  const body = state.problems.includes("unsure")
    ? "something's slowing my business down but I'm not sure where to start"
    : `here's what's slowing my business down: ${joinList(state.problems.map((p) => find(PROBLEMS, p)!.phrase))}`;
  const message = `Hi Vision Forge, ${body}. Budget: ${budget}. Can we talk?`;
  return message.length <= MAX_MESSAGE ? message : `${message.slice(0, MAX_MESSAGE - 1)}…`;
}

export function whatsappHref(state: StartState): string | undefined {
  if (!canSend(state)) return undefined;
  return `${site.whatsapp.href}?text=${strictEncode(buildMessage(state))}`;
}

export function emailHref(state: StartState): string | undefined {
  if (!canSend(state)) return undefined;
  return mailtoHref(site.sales.display, "Project enquiry", buildMessage(state));
}

export { formatBZ };
```

- [ ] **Step 4: Run** — Expected: PASS (6 tests).
- [ ] **Step 5: Commit** — `git commit -am "feat: slowing-you-down picker logic"`

---

### Task 5: UI primitives

**Files:** Rewrite `components/ui/CtaLink.tsx`, `components/ui/Label.tsx`, `components/ui/SectionHeading.tsx`, `components/ui/EmailLink.tsx` (Logo unchanged).

**Interfaces:**
- `CtaLink({href, children, variant?: "primary"|"secondary"|"link"|"linkDark", icon?: "none"|"right"|"down", external?, className?})`
- `Label({children, tone?: "light"|"dark", className?})`
- `SectionHeading({kicker?, title, lede?, align?: "center"|"left", tone?: "light"|"dark", id?, className?})` renders `<h2 id>`.
- `EmailLink({address, size?: "lg"|"md"|"sm", tone?: "link"|"muted", subject?, className?})` — server component.

- [ ] **Step 1: Write the components**

```tsx file=components/ui/CtaLink.tsx
import { ArrowDown, ChevronRight } from "lucide-react";
import { isSafeNavigationHref } from "@/lib/safe-href";

type CtaLinkProps = {
  href: string;
  children: string;
  variant?: "primary" | "secondary" | "link" | "linkDark";
  icon?: "none" | "right" | "down";
  external?: boolean;
  className?: string;
};

const looks = {
  primary: "min-h-11 rounded-full bg-accent px-6 text-white hover:bg-accent-hover",
  secondary: "min-h-11 rounded-full border border-ink/15 px-6 text-ink hover:border-ink/40",
  link: "min-h-11 text-link hover:underline underline-offset-4",
  linkDark: "min-h-11 text-link-dark hover:underline underline-offset-4",
} as const;

export function CtaLink({
  href,
  children,
  variant = "primary",
  icon = "none",
  external = false,
  className = "",
}: CtaLinkProps) {
  const destination = isSafeNavigationHref(href) ? href : undefined;
  const openInNewTab = external && destination?.startsWith("https://");
  const Icon = icon === "down" ? ArrowDown : icon === "right" ? ChevronRight : null;

  return (
    <a
      href={destination}
      {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center justify-center gap-1.5 text-[17px] font-medium whitespace-nowrap transition-[background-color,border-color,color] duration-200 active:scale-[0.98] ${looks[variant]} ${className}`}
    >
      {children}
      {Icon ? (
        <Icon
          aria-hidden
          strokeWidth={2}
          className={`h-4 w-4 transition-transform duration-200 ${icon === "down" ? "group-hover:translate-y-0.5" : "group-hover:translate-x-0.5"}`}
        />
      ) : null}
    </a>
  );
}
```

```tsx file=components/ui/Label.tsx
import type { ReactNode } from "react";

export function Label({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p className={`text-[15px] font-semibold tracking-[-0.01em] sm:text-[17px] ${tone === "dark" ? "text-link-dark" : "text-link"} ${className}`}>
      {children}
    </p>
  );
}
```

```tsx file=components/ui/SectionHeading.tsx
import type { ReactNode } from "react";
import { Label } from "./Label";

type SectionHeadingProps = {
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  id?: string;
  className?: string;
};

export function SectionHeading({
  kicker,
  title,
  lede,
  align = "center",
  tone = "light",
  id,
  className = "",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <header className={`max-w-3xl ${center ? "mx-auto text-center" : ""} ${className}`}>
      {kicker ? <Label tone={tone}>{kicker}</Label> : null}
      <h2
        id={id}
        className={`mt-3 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.07] font-semibold tracking-[-0.03em] text-balance ${dark ? "text-panel-ink" : "text-ink"}`}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={`mt-5 max-w-2xl text-[clamp(1.0625rem,1.6vw,1.3125rem)] leading-[1.45] ${center ? "mx-auto" : ""} ${dark ? "text-panel-ink-2" : "text-ink-2"}`}
        >
          {lede}
        </p>
      ) : null}
    </header>
  );
}
```

```tsx file=components/ui/EmailLink.tsx
import { mailtoHref } from "@/lib/safe-href";

type EmailLinkProps = {
  address: string;
  size?: "lg" | "md" | "sm";
  tone?: "link" | "muted";
  subject?: string;
  className?: string;
};

const sizes = {
  lg: "text-[clamp(1rem,4.2cqi,1.5rem)] whitespace-nowrap",
  md: "text-[17px]",
  sm: "text-[13px]",
} as const;

const tones = {
  link: "text-link",
  muted: "text-ink-2 hover:text-ink",
} as const;

/** A lowercase, clickable mailto link. */
export function EmailLink({ address, size = "md", tone = "link", subject, className = "" }: EmailLinkProps) {
  return (
    <a
      href={mailtoHref(address, subject)}
      className={`inline-flex min-h-11 items-center [overflow-wrap:anywhere] lowercase underline-offset-4 hover:underline ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {address.toLowerCase()}
    </a>
  );
}
```

- [ ] **Step 2: Type-check** `npx tsc --noEmit -p . 2>&1 | grep components/ui` — Expected: no errors in `components/ui`.
- [ ] **Step 3: Commit** — `git commit -am "feat: studio-light UI primitives"`

---

### Task 6: Navigation, footer, mobile bar, legal layout

**Files:** Rewrite `components/layout/{Navbar,Footer,MobileContactBar,LegalLayout}.tsx`; modify `tests/logo-assets.test.ts`.

**Interfaces:** Consumes `navItems`, `legalItems`, `site` (Task 2); `Logo`, `CtaLink`, `EmailLink`, `Label` (Task 5).

- [ ] **Step 1: Update the logo test (fails until the components change)**

```ts file=tests/logo-assets.test.ts
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
function sha256(url: URL): string {
  return createHash("sha256").update(readFileSync(url)).digest("hex");
}

function pngSize(url: URL): { width: number; height: number; colorType: number } {
  const buf = readFileSync(url);
  assert.equal(buf.subarray(12, 16).toString("ascii"), "IHDR");
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
    colorType: buf[25],
  };
}

test("the public logo, favicon, and apple icon are the supplied png", () => {
  const brand = new URL("./public/brand/vision-forge-logo.png", root);
  const icon = new URL("./app/icon.png", root);
  const apple = new URL("./app/apple-icon.png", root);
  const sourceHash = sha256(brand);

  assert.equal(sha256(icon), sourceHash);
  assert.equal(sha256(apple), sourceHash);
  assert.deepEqual(pngSize(brand), { width: 819, height: 819, colorType: 6 });
  assert.equal(existsSync(new URL("./public/brand/vision-forge-logo.jpg", root)), false);
  assert.equal(existsSync(new URL("./app/icon.jpg", root)), false);
  assert.equal(existsSync(new URL("./app/apple-icon.jpg", root)), false);
});

test("logo and page metadata use the png without cropping it", () => {
  const logo = readFileSync(new URL("./components/ui/Logo.tsx", root), "utf8");
  const layout = readFileSync(new URL("./app/layout.tsx", root), "utf8");
  const navbar = readFileSync(new URL("./components/layout/Navbar.tsx", root), "utf8");
  const footer = readFileSync(new URL("./components/layout/Footer.tsx", root), "utf8");

  assert.match(logo, /src="\/brand\/vision-forge-logo\.png"/);
  assert.match(logo, /object-contain/);
  assert.match(logo, /alt="Vision Forge Studio"/);
  assert.match(logo, /width=\{819\}/);
  assert.match(logo, /height=\{819\}/);
  assert.doesNotMatch(logo, /object-cover/);

  assert.match(navbar, /<Logo priority className="h-9 w-9" sizes="36px"/);
  assert.match(navbar, /aria-label="Vision Forge Studio, home"/);
  assert.match(footer, /className="h-14 w-14" sizes="56px"/);

  assert.equal(layout.match(/vision-forge-logo\.png/g)?.length, 4);
  assert.match(layout, /width: 819/);
  assert.match(layout, /height: 819/);
});
```

- [ ] **Step 2: Run** `node --experimental-strip-types --test tests/logo-assets.test.ts` — Expected: FAIL on the navbar assertion.

- [ ] **Step 3: Write the components**

```tsx file=components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";
import { navItems, site } from "@/lib/site";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

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
    const elements = navItems
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
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
      <div className="nav-shell border-b border-transparent transition-[background-color,border-color] duration-300">
        <div className="mx-auto flex h-[var(--nav-h)] max-w-[1120px] items-center px-4 sm:px-6">
          <Link href="/" className="flex min-h-11 items-center gap-2.5" aria-label="Vision Forge Studio, home">
            <Logo priority className="h-9 w-9" sizes="36px" />
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-ink">Vision Forge</span>
          </Link>

          <nav className="ml-auto hidden items-center gap-7 lg:flex" aria-label="Primary">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                data-active={active === item.id}
                aria-current={active === item.id ? "true" : undefined}
                className="py-2 text-[13px] text-ink/75 transition-colors hover:text-ink data-[active=true]:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-7 hidden min-h-9 items-center rounded-full bg-accent px-4 text-[13px] font-medium text-white transition-colors hover:bg-accent-hover lg:inline-flex"
          >
            WhatsApp us
          </a>

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
          className="fixed inset-0 z-[60] flex flex-col bg-page lg:hidden"
        >
          <div className="flex h-[var(--nav-h)] items-center justify-between px-4">
            <Link href="/" onClick={closeMenu} className="flex min-h-11 items-center" aria-label="Vision Forge Studio, home">
              <Logo className="h-9 w-9" sizes="36px" />
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

          <nav className="flex flex-1 flex-col px-6 pt-4" aria-label="Mobile">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="flex min-h-14 items-center border-b border-hairline text-[28px] font-semibold tracking-[-0.025em] text-ink"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-8">
              <CtaLink href={site.whatsapp.href} external className="w-full">
                Message us on WhatsApp
              </CtaLink>
            </div>
          </nav>

          <div className="grid border-t border-hairline px-6 py-4 text-[15px]">
            <a href={site.phone.href} className="flex min-h-12 items-center justify-between text-ink">
              <span className="text-ink-2">Call</span>
              <span>{site.phone.display}</span>
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}
```

```tsx file=components/layout/Footer.tsx
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { EmailLink } from "@/components/ui/EmailLink";
import { Logo } from "@/components/ui/Logo";
import { legalItems, navItems, site } from "@/lib/site";

function ColumnTitle({ children }: { children: string }) {
  return <h2 className="text-[13px] font-semibold text-ink">{children}</h2>;
}

const linkClass = "inline-flex min-h-10 items-center text-[13px] text-ink-2 transition-colors hover:text-ink hover:underline";

export function Footer() {
  const { legal } = site;
  return (
    <footer className="no-print bg-canvas">
      <div className="mx-auto max-w-[1120px] px-4 sm:px-6">
        <div className="grid gap-10 border-b border-hairline py-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1fr]">
          <div>
            <Link href="/" aria-label="Vision Forge Studio, home" className="inline-block">
              <Logo className="h-14 w-14" sizes="56px" />
            </Link>
            <p className="mt-4 max-w-xs text-[15px] leading-snug text-ink">Automation and websites for Belizean businesses.</p>
            <p className="mt-2 text-[13px] text-ink-2">Based in Belize</p>
          </div>

          <nav aria-label="Studio">
            <ColumnTitle>Studio</ColumnTitle>
            <ul className="mt-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <ColumnTitle>Contact</ColumnTitle>
            <ul className="mt-3">
              <li>
                <EmailLink address={site.sales.display} size="sm" tone="muted" />
              </li>
              <li>
                <EmailLink address={site.support.display} size="sm" tone="muted" />
              </li>
              <li>
                <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp {site.whatsapp.display}
                </a>
              </li>
              <li>
                <a href={site.phone.href} className={linkClass}>
                  Call {site.phone.display}
                </a>
              </li>
            </ul>
          </div>

          <nav aria-label="Legal">
            <ColumnTitle>Legal</ColumnTitle>
            <ul className="mt-3">
              {legalItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="max-w-3xl text-[12px] leading-relaxed text-ink-2">
            © {legal.copyrightYear} {legal.registeredName}. Registered in Belize under the Business Names Act, Cap. 247,
            Reg. No. {legal.registrationNumber}. Trading as {legal.tradingName}.
          </p>
          <a
            href="#main"
            aria-label="Back to top"
            className="flex h-11 w-11 shrink-0 items-center justify-center self-end rounded-full border border-hairline text-ink-2 transition-colors hover:border-ink/30 hover:text-ink md:self-auto"
          >
            <ArrowUp aria-hidden className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
```

```tsx file=components/layout/MobileContactBar.tsx
"use client";

import { MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/** Phone-only bottom bar so WhatsApp is always one tap away. Hides while the contact section is on screen. */
export function MobileContactBar() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    if (!contact) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), { threshold: 0.15 });
    io.observe(contact);
    return () => io.disconnect();
  }, []);

  return (
    <div
      className={`no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_auto] gap-2 border-t border-black/5 bg-white/85 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] backdrop-blur-xl transition-transform duration-300 md:hidden ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <a
        href={site.whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent text-[16px] font-medium text-white"
      >
        <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={2} />
        WhatsApp us
      </a>
      <a
        href={site.phone.href}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-5 text-[16px] font-medium text-ink"
      >
        <Phone aria-hidden className="h-4 w-4" strokeWidth={2} />
        Call
      </a>
    </div>
  );
}
```

```tsx file=components/layout/LegalLayout.tsx
import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";
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
    <article className="px-4 pt-14 pb-24 sm:px-6 lg:pt-20">
      <div className="mx-auto max-w-[1120px]">
        <header className="max-w-3xl border-b border-hairline pb-10">
          <Label>{kicker}</Label>
          <h1 className="mt-3 text-[clamp(2.5rem,6vw,4rem)] leading-[1.05] font-semibold tracking-[-0.035em]">{title}</h1>
          <p className="mt-5 text-[14px] text-ink-2">Last updated {site.legal.lastUpdated}</p>
          <div className="mt-5 text-[19px] leading-relaxed text-ink-2">{intro}</div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[15rem_1fr]">
          <nav aria-label="On this page" className="no-print lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
            <p className="text-[13px] font-semibold text-ink">On this page</p>
            <ol className="mt-3 space-y-0.5 border-l border-hairline">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="block py-1.5 pl-4 text-[14px] text-ink-2 transition-colors hover:text-ink">
                    <span className="mr-2 tabular-nums">{index + 1}.</span>
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
                  <span className="mr-3 text-[15px] font-medium text-ink-2 tabular-nums">{index + 1}.</span>
                  {section.heading}
                </h2>
                {section.body}
              </section>
            ))}
            <p className="mt-16 border-t border-hairline pt-6 text-[14px] text-ink-2">
              This page is provided for general information. It is not legal advice.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
```

- [ ] **Step 4: Run** `node --experimental-strip-types --test tests/logo-assets.test.ts tests/legal.test.ts tests/contacts.test.ts` — Expected: PASS.
- [ ] **Step 5: Commit** — `git commit -am "feat: studio-light navigation, footer and legal layout"`

---

### Task 7: Hero, Demo, Automate, How it works

**Files:** Rewrite `components/sections/Hero.tsx`, `components/sections/HowItWorks.tsx`; create `components/sections/Demo.tsx`, `components/sections/Automate.tsx`.

**Interfaces:** Consumes `hero`, `automations`, `steps`, `site` (Task 2); `DEMO_*`, `minutesAfter`, `STEP_DELAY_MS` (Task 3); `CtaLink`, `Label`, `SectionHeading` (Task 5). Section ids: `top`, `how`, `automate`, `steps`.

- [ ] **Step 1: Write the sections**

```tsx file=components/sections/Hero.tsx
import { Bell, ChevronRight, FileSpreadsheet, MessageCircle, Receipt, Zap } from "lucide-react";
import { CtaLink } from "@/components/ui/CtaLink";
import { Label } from "@/components/ui/Label";
import { hero, site } from "@/lib/site";

const flowIcons = [MessageCircle, FileSpreadsheet, Receipt, Bell];

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden px-4 pt-16 pb-20 text-center sm:px-6 md:pt-24 md:pb-28">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(0,113,227,0.09),transparent_70%)]"
      />
      <div className="mx-auto max-w-[1120px]">
        <Label>{hero.kicker}</Label>
        <h1
          id="hero-title"
          className="mx-auto mt-4 max-w-4xl text-[clamp(2.75rem,7.2vw,5.75rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance"
        >
          {hero.title[0]}
          <br />
          <span className="text-gradient">{hero.title[1]}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.125rem,1.9vw,1.5rem)] leading-[1.4] text-ink-2">{hero.lede}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <CtaLink href="#how" icon="down">
            {hero.primary}
          </CtaLink>
          <CtaLink href={site.whatsapp.href} external variant="link" icon="right">
            {hero.secondary}
          </CtaLink>
        </div>
        <p className="mt-6 text-[14px] text-ink-2">{hero.trust}</p>

        <ol aria-label="One order, handled automatically" className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-y-3">
          {hero.flow.map((step, i) => {
            const Icon = flowIcons[i];
            return (
              <li key={step} className="flex items-center">
                <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-page px-4 py-2 text-[14px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <Icon aria-hidden className="h-4 w-4 text-accent" strokeWidth={2} />
                  {step}
                </span>
                <ChevronRight aria-hidden className="mx-1.5 h-4 w-4 text-ink-2/60" />
              </li>
            );
          })}
          <li>
            <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-white">
              <Zap aria-hidden className="h-4 w-4 text-done" strokeWidth={2} />
              All on its own
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
}
```

```tsx file=components/sections/Demo.tsx
"use client";

import { ArrowDown, Check, Clock, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  DEMO_ORDER,
  DEMO_REPLY,
  DEMO_STEPS,
  MANUAL_MINUTES,
  minutesAfter,
  STEP_DELAY_MS,
  type DemoMode,
} from "@/lib/demo";

const modes: ReadonlyArray<{ id: DemoMode; label: string }> = [
  { id: "manual", label: "Manual" },
  { id: "auto", label: "Automate it" },
];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Phone({ mode, done }: { mode: DemoMode; done: number }) {
  const replied = done >= 3;
  return (
    <div
      aria-hidden
      className="mx-auto w-full max-w-[300px] rounded-[44px] border-[10px] border-panel-3 bg-[#0b141a] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
    >
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366]/20 text-[13px] font-semibold text-[#25d366]">
          MC
        </span>
        <div>
          <p className="text-[14px] font-semibold">Maria C.</p>
          <p className="text-[12px] text-panel-ink-2">Customer</p>
        </div>
      </div>
      <div className="flex min-h-[250px] flex-col gap-2 py-5">
        <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-[#202c33] px-3.5 py-2.5 text-[14px] leading-snug">
          {DEMO_ORDER}
          <span className="mt-1 block text-right text-[12px] text-panel-ink-2">9:41</span>
        </p>
        <p
          className={`ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-[#005c4b] px-3.5 py-2.5 text-[14px] leading-snug transition-[opacity,transform] duration-500 ${
            replied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {DEMO_REPLY}
          <span className="mt-1 block text-right text-[12px] text-panel-ink-2">{mode === "auto" ? "9:41" : "10:03"}</span>
        </p>
      </div>
      <div className="rounded-full bg-[#202c33] px-4 py-2.5 text-[13px] text-panel-ink-2">Message</div>
    </div>
  );
}

export function Demo() {
  const [mode, setMode] = useState<DemoMode>("manual");
  const [done, setDone] = useState(0);
  const timersRef = useRef<number[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const play = (next: DemoMode) => {
    const timers = timersRef.current;
    timers.splice(0).forEach((id) => window.clearTimeout(id));
    startedRef.current = true;
    setMode(next);
    if (prefersReducedMotion()) {
      setDone(DEMO_STEPS.length);
      return;
    }
    setDone(0);
    DEMO_STEPS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setDone(i + 1), STEP_DELAY_MS[next] * (i + 1)));
    });
  };
  const playRef = useRef(play);
  useEffect(() => {
    playRef.current = play;
  });

  useEffect(() => {
    const node = panelRef.current;
    const timers = timersRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          playRef.current("manual");
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      timers.splice(0).forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const total = DEMO_STEPS.length;
  const minutes = minutesAfter(mode, done);
  const finished = done >= total;

  return (
    <section id="how" aria-labelledby="demo-title" className="scroll-mt-14 px-3 py-4 sm:px-6">
      <div
        ref={panelRef}
        className="mx-auto max-w-[1180px] rounded-[32px] bg-panel px-5 py-16 text-panel-ink sm:px-10 md:py-24 lg:px-16"
      >
        <SectionHeading
          id="demo-title"
          tone="dark"
          kicker="See it work"
          title="One order, two ways."
          lede="Here's a normal WhatsApp order. Watch what happens to it."
        />

        <fieldset className="mx-auto mt-10 flex w-fit gap-1 rounded-full bg-panel-3 p-1">
          <legend className="sr-only">Choose how the order is handled</legend>
          {modes.map((m) => {
            const selected = mode === m.id;
            const Icon = m.id === "manual" ? Clock : Zap;
            return (
              <label
                key={m.id}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-[15px] font-medium transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-link-dark ${
                  selected ? "bg-panel-ink text-panel" : "text-panel-ink-2 hover:text-panel-ink"
                }`}
              >
                <input
                  type="radio"
                  name="demo-mode"
                  value={m.id}
                  checked={selected}
                  onChange={() => play(m.id)}
                  className="sr-only"
                />
                <Icon aria-hidden className="h-4 w-4" strokeWidth={2} />
                {m.label}
              </label>
            );
          })}
        </fieldset>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Phone mode={mode} done={done} />

          <div>
            <ol className="relative space-y-3">
              <span aria-hidden className="absolute top-8 bottom-8 left-8 w-px bg-white/10">
                <span
                  className="block h-full w-full origin-top bg-done transition-transform duration-500"
                  style={{ transform: `scaleY(${mode === "auto" ? done / total : 0})` }}
                />
              </span>
              {DEMO_STEPS.map((step, i) => {
                const complete = i < done;
                return (
                  <li
                    key={step.auto}
                    className={`relative flex items-center gap-4 rounded-[20px] bg-panel-2 p-4 transition-opacity duration-500 ${
                      complete ? "opacity-100" : "opacity-55"
                    }`}
                  >
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        complete
                          ? mode === "auto"
                            ? "border-done bg-done text-panel"
                            : "border-panel-ink-2 bg-panel-ink-2 text-panel"
                          : "border-white/20 bg-panel-2 text-transparent"
                      }`}
                    >
                      <Check aria-hidden className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <span className="flex-1 text-[17px] leading-snug">{mode === "manual" ? step.manual : step.auto}</span>
                    <span className="text-[13px] text-panel-ink-2 tabular-nums">
                      {mode === "manual" ? `${step.minutes} min` : "instant"}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
              <p aria-hidden="true" className="flex items-baseline gap-2">
                <span
                  className={`text-[clamp(3rem,7vw,4.5rem)] leading-none font-semibold tracking-[-0.04em] tabular-nums transition-colors duration-300 ${
                    mode === "auto" && finished ? "text-done" : "text-panel-ink"
                  }`}
                >
                  {minutes}
                </span>
                <span className="text-[17px] text-panel-ink-2">min of your time, for one order</span>
              </p>
              <p className="max-w-[16rem] text-[13px] text-panel-ink-2">Example for illustration. Your times will vary.</p>
            </div>
            <p className="sr-only" aria-live="polite">
              {finished
                ? mode === "manual"
                  ? `By hand: ${MANUAL_MINUTES} minutes of your time for one order.`
                  : "Automated: 0 minutes of your time for one order."
                : ""}
            </p>
            <noscript>
              <p className="mt-6 text-[17px] text-panel-ink">
                Automated, every step above happens on its own: 0 minutes of your time for each order.
              </p>
            </noscript>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold tracking-[-0.02em] text-balance">
            That&apos;s one order. Multiply it by every order, every day.
          </p>
          <a href="#automate" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[17px] text-link-dark hover:underline">
            See what else we automate
            <ArrowDown aria-hidden className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
```

```tsx file=components/sections/Automate.tsx
import { CalendarCheck, ChartColumn, ClipboardList, Globe, Scale, Wallet, type LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { automations, type AutomationIcon } from "@/lib/site";

const icons: Record<AutomationIcon, LucideIcon> = {
  wallet: Wallet,
  forms: ClipboardList,
  bookings: CalendarCheck,
  reports: ChartColumn,
  accounts: Scale,
  website: Globe,
};

export function Automate() {
  return (
    <section id="automate" aria-labelledby="automate-title" className="scroll-mt-14 px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          id="automate-title"
          kicker="What we automate"
          title="Same idea, everywhere you lose time."
          lede="If it sounds like your week, we can take it off your plate."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {automations.map((item) => {
            const Icon = icons[item.icon];
            return (
              <li
                key={item.id}
                className="reveal flex flex-col rounded-[24px] bg-canvas p-7 transition-transform duration-300 hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-page text-accent shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
                  <Icon aria-hidden className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <p className="mt-6 text-[21px] leading-[1.25] font-semibold tracking-[-0.02em] text-ink">“{item.pain}”</p>
                <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{item.fix}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
```

```tsx file=components/sections/HowItWorks.tsx
import { SectionHeading } from "@/components/ui/SectionHeading";
import { steps } from "@/lib/site";

export function HowItWorks() {
  return (
    <section id="steps" aria-labelledby="steps-title" className="scroll-mt-14 bg-canvas px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          id="steps-title"
          kicker="How it works"
          title="Four steps. No tech talk."
          lede="Tell us how your business runs in your own words. We handle the rest."
        />
        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="reveal rounded-[24px] bg-page p-7">
              <span className="text-[15px] font-semibold text-link tabular-nums">Step {i + 1}</span>
              <h3 className="mt-3 text-[21px] leading-[1.25] font-semibold tracking-[-0.02em] text-ink">{step.title}</h3>
              <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Type-check** `npx tsc --noEmit 2>&1 | grep -E "Hero|Demo|Automate|HowItWorks"` — Expected: nothing.
- [ ] **Step 3: Commit** — `git commit -am "feat: hero, order demo, automate tiles, steps"`

---

### Task 8: Pricing, Start, FAQ, Contact, page assembly, cleanup

**Files:** Rewrite `components/sections/{Pricing,Faq,Contact}.tsx`, `app/page.tsx`; create `components/sections/{Start,StartCard}.tsx`; delete `components/sections/{Doors,WhyUs}.tsx`, `components/builder/`, `components/visuals/`, `components/forge/`, `lib/heat.ts`, `tests/heat.test.ts`, `app/fonts/{big-shoulders-display,instrument-sans,martian-mono}.woff2`.

**Interfaces:** Consumes everything above. `StartCard({state: StartState, onReset(): void})`.

- [ ] **Step 1: Write the sections and page**

```tsx file=components/sections/Pricing.tsx
import { Check } from "lucide-react";
import Link from "next/link";
import { CtaLink } from "@/components/ui/CtaLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredTier, formatBZ, priceNote, tierOrder, tiers } from "@/lib/site";

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-14 px-3 py-4 sm:px-6">
      <div className="mx-auto max-w-[1180px] rounded-[32px] bg-panel px-5 py-16 text-panel-ink sm:px-10 md:py-24 lg:px-16">
        <SectionHeading
          id="pricing-title"
          tone="dark"
          kicker="Pricing"
          title="Start small. Add more when it pays off."
          lede="Every project gets a fixed written quote after a free chat. These are typical starting points."
        />

        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {tierOrder.map((id) => {
            const t = tiers[id];
            const featured = id === featuredTier;
            return (
              <li
                key={id}
                className={`relative flex flex-col rounded-[24px] bg-panel-2 p-7 ${featured ? "ring-2 ring-link-dark" : ""}`}
              >
                {featured ? (
                  <p className="absolute -top-3 left-7 rounded-full bg-link-dark px-3 py-1 text-[12px] font-semibold text-panel">
                    Where most start
                  </p>
                ) : null}
                <h3 className="text-[21px] font-semibold tracking-[-0.02em]">{t.label}</h3>
                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-[15px] text-panel-ink-2">from</span>
                  <span className="text-[2.75rem] leading-none font-semibold tracking-[-0.04em] tabular-nums">{formatBZ(t.from)}</span>
                  <span aria-hidden className="text-[17px] text-panel-ink-2">
                    *
                  </span>
                </p>
                <p className="mt-2 text-[15px] text-panel-ink-2">Usually {t.weeks}</p>
                <p className="mt-5 text-[17px] leading-relaxed text-panel-ink/85">{t.copy}</p>
                <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6 text-[15px] text-panel-ink-2">
                  {t.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-link-dark" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <p className="mx-auto mt-8 max-w-3xl text-center text-[12px] leading-relaxed text-panel-ink-2">
          <span aria-hidden>* </span>
          {priceNote.text}{" "}
          <Link href={priceNote.href} className="underline underline-offset-2 hover:text-panel-ink">
            {priceNote.linkLabel}
          </Link>
        </p>

        <div className="mt-10 text-center">
          <p className="text-[17px] text-panel-ink-2">Not sure which fits?</p>
          <CtaLink href="#start" variant="linkDark" icon="right">
            {"Tell us what's slowing you down"}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
```

```tsx file=components/sections/StartCard.tsx
"use client";

import { Mail, MessageCircle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { canSend, emailHref, suggestion, whatsappHref, type StartState } from "@/lib/project-builder";
import { isSafeNavigationHref } from "@/lib/safe-href";
import { formatBZ, priceNote, tiers } from "@/lib/site";

const btn =
  "inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-[17px] font-medium transition-colors duration-200";

export function StartCard({ state, onReset }: { state: StartState; onReset(): void }) {
  const s = suggestion(state);
  const ready = canSend(state);
  const wa = whatsappHref(state);
  const mail = emailHref(state);
  const touched = ready || state.budget !== "unsure";

  return (
    <div className="rounded-[28px] bg-panel p-7 text-panel-ink sm:p-9">
      <p className="text-[15px] font-semibold text-link-dark">Your starting point</p>

      <div aria-live="polite" aria-atomic="true">
        <p className="mt-4 text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15] font-semibold tracking-[-0.025em]">{s.headline}</p>
        {s.tier ? (
          <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-white/10 py-5">
            <div>
              <dt className="text-[13px] text-panel-ink-2">From</dt>
              <dd className="mt-1 text-[24px] font-semibold tabular-nums">
                {formatBZ(tiers[s.tier].from)}
                <span aria-hidden className="text-panel-ink-2">
                  *
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-[13px] text-panel-ink-2">Usually</dt>
              <dd className="mt-1 text-[24px] font-semibold">{tiers[s.tier].weeks}</dd>
            </div>
          </dl>
        ) : null}
        {s.budgetLine ? <p className="mt-5 text-[17px] leading-relaxed text-panel-ink-2">{s.budgetLine}</p> : null}
        {s.tier ? (
          <p className="mt-4 text-[12px] leading-relaxed text-panel-ink-2">
            <span aria-hidden>* </span>
            {priceNote.text}{" "}
            <Link href={priceNote.href} className="underline underline-offset-2 hover:text-panel-ink">
              {priceNote.linkLabel}
            </Link>
          </p>
        ) : null}
      </div>

      <div className="mt-7 grid gap-2.5">
        {ready && wa && isSafeNavigationHref(wa) ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className={`${btn} bg-accent text-white hover:bg-accent-hover`}>
            <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={2} />
            Send this on WhatsApp
          </a>
        ) : (
          <span aria-disabled="true" className={`${btn} cursor-not-allowed bg-white/10 text-panel-ink-2`}>
            <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={2} />
            Send this on WhatsApp
          </span>
        )}
        {ready && mail ? (
          <a href={mail} className={`${btn} border border-white/25 text-panel-ink hover:border-white/50`}>
            <Mail aria-hidden className="h-4 w-4" strokeWidth={2} />
            Email it instead
          </a>
        ) : (
          <span aria-disabled="true" className={`${btn} cursor-not-allowed border border-white/10 text-panel-ink-2`}>
            <Mail aria-hidden className="h-4 w-4" strokeWidth={2} />
            Email it instead
          </span>
        )}
      </div>

      {touched ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] text-panel-ink-2 hover:text-panel-ink"
        >
          <RotateCcw aria-hidden className="h-4 w-4" />
          Start over
        </button>
      ) : (
        <p className="mt-5 text-[13px] text-panel-ink-2">Your answers stay on this page until you choose to send them.</p>
      )}
    </div>
  );
}
```

```tsx file=components/sections/Start.tsx
"use client";

import { Check } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BUDGETS, EMPTY_STATE, PROBLEMS, toggleProblem, type StartState } from "@/lib/project-builder";
import { site } from "@/lib/site";
import { StartCard } from "./StartCard";

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick(): void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[15px] font-medium transition-[background-color,border-color,color] duration-200 active:scale-[0.98] ${
        pressed ? "border-accent bg-accent text-white" : "border-hairline bg-page text-ink hover:border-ink/40"
      }`}
    >
      {pressed ? <Check aria-hidden className="h-4 w-4" strokeWidth={2.5} /> : null}
      {children}
    </button>
  );
}

function ChipGroup({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  const id = useId();
  return (
    <div>
      <h3 id={id} className="flex items-baseline gap-3 text-[19px] font-semibold tracking-[-0.015em] text-ink">
        {title}
        <span className="text-[14px] font-normal text-ink-2">{note}</span>
      </h3>
      <div role="group" aria-labelledby={id} className="mt-4 flex flex-wrap gap-2.5">
        {children}
      </div>
    </div>
  );
}

export function Start() {
  const [state, setState] = useState<StartState>(EMPTY_STATE);

  return (
    <section id="start" aria-labelledby="start-title" className="scroll-mt-14 bg-canvas px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          id="start-title"
          kicker="Your turn"
          title="What's slowing your business down?"
          lede="Tap everything that sounds familiar. We'll suggest where to start, and you can send it to us in one tap. Nothing is sent until you press send."
        />

        <noscript>
          <p className="mt-8 text-center text-[17px] text-ink">
            Message us on{" "}
            <a className="text-link underline" href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>{" "}
            and tell us what&apos;s slowing you down.
          </p>
        </noscript>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div className="space-y-10 rounded-[28px] bg-page p-6 sm:p-10">
            <ChipGroup title="What's slowing you down?" note="Pick any">
              {PROBLEMS.map((p) => (
                <Chip
                  key={p.id}
                  pressed={state.problems.includes(p.id)}
                  onClick={() => setState((s) => ({ ...s, problems: toggleProblem(s.problems, p.id) }))}
                >
                  {p.label}
                </Chip>
              ))}
            </ChipGroup>
            <ChipGroup title="Your budget" note="Optional">
              {BUDGETS.map((b) => (
                <Chip
                  key={b.id}
                  pressed={state.budget === b.id}
                  onClick={() => setState((s) => ({ ...s, budget: s.budget === b.id ? "unsure" : b.id }))}
                >
                  {b.label}
                </Chip>
              ))}
            </ChipGroup>
          </div>

          <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
            <StartCard state={state} onReset={() => setState(EMPTY_STATE)} />
          </div>
        </div>
      </div>
    </section>
  );
}
```

```tsx file=components/sections/Faq.tsx
import { Plus } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq } from "@/lib/site";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-14 px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-[820px]">
        <SectionHeading id="faq-title" kicker="FAQ" title="Questions people ask." />
        <div className="mt-12 border-t border-hairline">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-hairline">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[19px] font-medium tracking-[-0.015em] text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-ink-2 transition-transform duration-300 group-open:rotate-45"
                  strokeWidth={1.75}
                />
              </summary>
              <p className="pr-10 pb-6 text-[17px] leading-relaxed text-ink-2">
                {item.a}
                {"link" in item ? (
                  <>
                    {" "}
                    <Link href={item.link.href} className="text-link underline underline-offset-4">
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

```tsx file=components/sections/Contact.tsx
import { Mail, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { EmailLink } from "@/components/ui/EmailLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { site } from "@/lib/site";

const iconProps = { "aria-hidden": true, className: "h-4 w-4", strokeWidth: 2 } as const;

const phoneClass =
  "inline-flex min-h-11 items-center text-[clamp(1rem,4.2cqi,1.5rem)] whitespace-nowrap text-link tabular-nums underline-offset-4 hover:underline";

function ContactTile({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <li className="@container flex min-h-36 flex-col justify-between gap-6 rounded-[24px] bg-canvas p-7">
      <p className="flex items-center gap-2 text-[14px] font-medium text-ink-2">
        {icon}
        {label}
      </p>
      <div>{children}</div>
    </li>
  );
}

export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="scroll-mt-14 px-4 pt-8 pb-24 sm:px-6 md:pb-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          id="contact-title"
          kicker="Contact"
          title="Ready to start? Let's talk."
          lede="Message us on WhatsApp, call or email. The first consultation is free."
        />
        <div className="mt-8 flex justify-center">
          <CtaLink href={site.whatsapp.href} external>
            Message us on WhatsApp
          </CtaLink>
        </div>

        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          <ContactTile icon={<Mail {...iconProps} />} label="Sales · new projects">
            <EmailLink address={site.sales.display} size="lg" subject="New project enquiry" />
          </ContactTile>
          <ContactTile icon={<Mail {...iconProps} />} label="Support · existing clients">
            <EmailLink address={site.support.display} size="lg" />
          </ContactTile>
          <ContactTile icon={<MessageCircle {...iconProps} />} label="WhatsApp">
            <a href={site.whatsapp.href} target="_blank" rel="noopener noreferrer" className={phoneClass}>
              {site.whatsapp.display}
            </a>
          </ContactTile>
          <ContactTile icon={<Phone {...iconProps} />} label="Call">
            <a href={site.phone.href} className={phoneClass}>
              {site.phone.display}
            </a>
          </ContactTile>
        </ul>

        <p className="mt-10 text-center text-[15px] text-ink-2">{site.trustLine}</p>
      </div>
    </section>
  );
}
```

```tsx file=app/page.tsx
import { Automate } from "@/components/sections/Automate";
import { Contact } from "@/components/sections/Contact";
import { Demo } from "@/components/sections/Demo";
import { Faq } from "@/components/sections/Faq";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { Start } from "@/components/sections/Start";
import { faq } from "@/lib/site";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function Home() {
  return (
    <>
      <Hero />
      <Demo />
      <Automate />
      <HowItWorks />
      <Pricing />
      <Start />
      <Faq />
      <Contact />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
```

- [ ] **Step 2: Remove obsolete files**

```bash
git rm -rq components/forge components/builder components/visuals components/sections/Doors.tsx components/sections/WhyUs.tsx lib/heat.ts tests/heat.test.ts app/fonts/big-shoulders-display.woff2 app/fonts/instrument-sans.woff2 app/fonts/martian-mono.woff2
grep -rn "textures/grain" app components lib || true
```

- [ ] **Step 3: Run the full suite** `npm test` — Expected: all PASS (clarity structure tests now pass).
- [ ] **Step 4: Lint and types** `npx tsc --noEmit && npx eslint .` — Expected: no output.
- [ ] **Step 5: Commit** — `git add -A && git commit -m "feat: pricing, slowing-you-down picker, FAQ, contact; remove forge"`

---

### Task 9: Verify in the Workers runtime and deliver

- [ ] **Step 1: Build** `npx @opennextjs/cloudflare build` — Expected: "OpenNext build complete."
- [ ] **Step 2: Preview** `npx wrangler dev --port 8801` in the background; `curl -s -o /dev/null -w "%{http_code}" localhost:8801/{,terms,privacy,disclaimer,cookies,nope}` — Expected: 200 ×5, 404.
- [ ] **Step 3: Browser checks** (Playwright from `/home/claude/scratch`): at 390×844 and 1440×900 assert `document.documentElement.scrollWidth <= innerWidth`; no CSP console errors; click "Automate it" and wait 2.5s → counter shows `0`; Tab to the radio and press ArrowLeft → mode returns to Manual; tap "Chasing payments" → card headline contains "Automate one task" and the WhatsApp link `text` param equals the built message; with `reducedMotion: "reduce"` the demo completes instantly; with JavaScript disabled the noscript line and all 9 FAQ summaries render.
- [ ] **Step 4: Screenshots** full-page desktop and mobile, plus demo after automating; review and send to the user.
- [ ] **Step 5: Deliver** changed and new files to `D:\Entrepreneur\Vision Forge Ltd\Documents\visionforgestudio.app` through a fresh `/mnt/user-data/outputs/fix7/` staging directory with `expectedMtimeMs` for modified files; re-stage and `cmp` to byte-verify; give the user the PowerShell `Remove-Item` command for removed files (including the 18 from the previous redesign if still present).
