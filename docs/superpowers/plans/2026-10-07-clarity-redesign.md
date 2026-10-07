# Clarity Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage so a first-time visitor understands what Vision Forge sells, to whom, from what price, and how to start. The project builder replaces the game.

**Architecture:** Pure, tested logic in `lib/project-builder.ts`, plus content data in `lib/site.ts`. Server-rendered sections, with client islands only for the doors tabs, the builder and the mobile contact bar. The existing forge visual system (tokens, HeatText, SparkField) is reused.

**Tech Stack:** Next.js 16.3.8 (pinned), React 19, Motion, Tailwind 4, OpenNext Cloudflare.

**Spec:** `docs/superpowers/specs/2026-10-07-clarity-redesign-design.md`

## Global Constraints
- All prices are written `BZ$`. Tiers start at 500, 2500 and 8000.
- Every email is lowercase. Every link passes `isSafeNavigationHref`.
- No new runtime dependencies. No storage or network calls from the builder.
- Plain-English copy exactly as the spec gives it.
- The reduced-motion and no-JS fallbacks in the spec are mandatory.
- `next` stays pinned at 16.3.8, and Cache Components stays off.

### Task 1: Builder logic (TDD)
- Files: `lib/project-builder.ts`, `tests/project-builder.test.ts`, `lib/site.ts` (`tiers`).
- Write the tests from the spec's Testing section and watch them fail. Implement the spec's Rules, then watch them pass. Commit.

### Task 2: Safe links for wa.me `?text=` and mailto body (TDD)
- Files: `lib/safe-href.ts`, `tests/security.test.ts`.
- Add the failing cases: wa.me with `text` only, a hash rejected, another param rejected, more than 500 characters rejected, CR/LF in the body rejected. Implement, watch them pass, commit.

### Task 3: Content data and clarity test
- Files: `lib/site.ts` (doors, steps, faq, tiers, principles, nav), `tests/clarity.test.ts`.
- Write the clarity assertions, then the content, until the tests pass.

### Task 4: Sections and chrome
- Create `components/sections/{Hero,Doors,HowItWorks,Pricing,WhyUs,Faq,Contact}.tsx`, `components/builder/{ProjectBuilder,ProjectCard}.tsx`, `components/visuals/{PhoneExample,LaptopExample}.tsx` and `components/layout/MobileContactBar.tsx`.
- Modify `app/page.tsx`, `app/layout.tsx` (no Ignition or ignition script; metadata; FAQ JSON-LD), `components/layout/Navbar.tsx` and `Footer.tsx`.
- Build, lint, commit.

### Task 5: Remove the retired pieces; update legal copy
- Delete the components, lib files and tests listed in the spec's Removed section.
- Update `app/cookies/page.tsx`, `app/disclaimer/page.tsx` and `tests/legal.test.ts`.
- Run the tests and commit.

### Task 6: Verify and deliver
- Run tests, lint and the OpenNext build. Screenshots at 390 and 1440 with the builder empty and filled. Keyboard pass. First-timer test.
- Write the changed files to the user's folder and byte-verify them. List the deletions for the user, since files on the device can't be deleted from here.
