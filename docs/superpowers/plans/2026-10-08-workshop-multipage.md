# Workshop Multipage Implementation Plan

> Executed inline (executing-plans). Spec: `docs/superpowers/specs/2026-10-08-workshop-multipage-design.md`.

**Goal:** Rebuild visionforgestudio.app as a six-page Workshop-style site around the new logo.
**Architecture:** App Router pages per route; content in `lib/site.ts`; pure logic in `lib/demo.ts` and
`lib/project-builder.ts`; shared chrome (Navbar with `usePathname`, Footer, ClosingBand, PageHeader). Server
components except Navbar, MobileContactBar, Workbench, Demo, PricingBuilder.
**Tech:** Next 16.3.8, React 19.3, Tailwind 4, lucide-react, node --test, OpenNext/Cloudflare.

## Global constraints
- Pinned `next`/`eslint-config-next` 16.3.8; lowercase mailto emails; never "Ltd"; registration line in footer.
- Every `target="_blank"` has `rel="noopener noreferrer"`; links pass `isSafeNavigationHref`; messages ≤ 500 chars.
- Prices: Get found BZ$500 · Automate one task BZ$1,500 · Connect your business BZ$8,000, always with `*` + `priceNote`.
- Self-hosted fonts only; contrast ≥ 4.5:1; 44px targets; reduced motion respected; no horizontal scroll at 390px.

## Tasks
1. **Brand assets** — replace logo PNG, regenerate WebP widths (96…1369), square favicon/apple icon; update
   `lib/logo-variants.ts`, `Logo` (1369×1149); tests `logo-assets`, `logo-variants`.
2. **Tokens + fonts + layout** — `app/globals.css` Workshop tokens, Archivo/Instrument/Plex/Caveat woff2,
   `app/layout.tsx`; test `design` (tokens, contrast pairs, fonts).
3. **Content + logic** — `lib/site.ts` (hero, nav routes, websiteKinds, websiteIncludes, promises, worksWith,
   pageIndex), `lib/demo.ts` notes, `lib/project-builder.ts` business; tests `clarity`, `demo`, `project-builder`.
4. **Shared UI** — Label, SectionHeading, PageHeader, CtaLink, EmailLink, ClosingBand, Navbar, Footer,
   MobileContactBar, LegalLayout.
5. **Home** — Hero (emblem + glint), Workbench, AutomateList, Industries, PageIndex.
6. **Inner pages** — `/automation` (Demo, AutomationDetail, WorksWith), `/websites`, `/pricing`
   (TierCards, PricingBuilder + WorkTicket), `/how-we-work` (Timeline, Promises, Faq + JSON-LD), `/contact`;
   sitemap; delete superseded section files.
7. **Verify + deliver** — tests, tsc, eslint, OpenNext build, Workers preview of every route, Playwright checks
   (overflow, CSP, workbench, demo keyboard, builder message, reduced motion, JS off), screenshots, deliver via
   fresh staging dir with mtime guards, byte-verify, delete command for removed files.
