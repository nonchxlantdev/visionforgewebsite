# Loading Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Play a three-second navy intro with the Vision Forge logo and a gold line on every full page load, then remove it.

**Architecture:** `LoadingScreen` is a client component rendered by the root layout, so the overlay is in the first HTML and a refresh remounts it. CSS runs the line, the scale, and the fade. A timer removes the overlay and clears `inert` on `#site`. Client-side route changes do not remount the layout, so the intro does not replay.

**Tech Stack:** Next 16.3.8, React 19.3, Tailwind CSS 4, existing `Logo` component, `node --experimental-strip-types --test`.

**Spec:** `docs/superpowers/specs/2026-10-25-loading-screen-design.md`

## Global Constraints

- The intro plays on each full load. It does not play again when the menu changes pages.
- The sequence is 0.0–0.6s gold line, 0.5–1.6s logo scale, hold until 2.4s, fade until 3.0s.
- Navy is `#0b1626` (`bg-ink` / `--ink`). The line is `#e7b54a` (`var(--gold)`).
- The logo is `/brand/vision-forge-logo.png` through `Logo`, about 160px wide (`w-40`). Its accessible name is "Vision Forge Studio", read once.
- The overlay covers the skip link. `#site` (skip link, navigation, main, footer, Get started bar) is `inert` until the overlay is removed. Nothing calls `.focus()`.
- No skip control, no spinner, no extra wordmark.
- Reduced motion: no line, no scale. Logo holds 0.6s, then fades over 0.4s. The timer is 1000ms.
- The timer does not wait on the image. Nothing reads or writes `sessionStorage` or `localStorage`.
- Do not change the hub, the hero copy, or page content.
- Do not push, and do not run `npm run deploy`, unless the user asked to commit and push.

---

### Task 1: Loading screen

**Files:**
- Create: `tests/loading-screen.test.ts`
- Create: `components/layout/LoadingScreen.tsx`
- Modify: `app/globals.css` (append the intro block at the end of the file)
- Test: `tests/loading-screen.test.ts`

**Interfaces:**
- Consumes: `Logo` from `components/ui/Logo.tsx` (`className`, `priority`, `sizes`, `decorative`). Default `decorative` is false, so the image alt is "Vision Forge Studio".
- Produces: `export function LoadingScreen(): JSX.Element | null`. First render returns the overlay. After the timer it returns `null`. It looks up `document.getElementById("site")` and sets `inert`.

- [ ] **Step 1: Write the failing test**

Create `tests/loading-screen.test.ts`:

```ts
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

test("the intro is the logo on navy, with a gold line, and it leaves on a timer", () => {
  const screen = read("components/layout/LoadingScreen.tsx");
  const css = read("app/globals.css");
  assert.match(screen, /"use client"/);
  assert.match(screen, /<Logo/);
  assert.match(screen, /priority/);
  assert.match(screen, /w-40/);
  assert.match(screen, /sizes="160px"/);
  assert.doesNotMatch(screen, /decorative/);
  assert.doesNotMatch(screen, /Vision Forge Studio/);
  assert.match(screen, /bg-ink/);
  assert.match(screen, /z-\[80\]/);
  assert.match(screen, /vf-intro-line/);
  assert.match(screen, /vf-intro-logo/);
  assert.match(screen, /useState\(true\)/);
  assert.match(screen, /setTimeout\(/);
  assert.match(screen, /3000/);
  assert.match(screen, /1000/);
  assert.match(screen, /prefers-reduced-motion: reduce/);
  assert.match(screen, /getElementById\("site"\)/);
  assert.match(screen, /\.inert = true/);
  assert.match(screen, /\.inert = false/);
  assert.doesNotMatch(screen, /\.focus\(/);
  assert.doesNotMatch(screen, /sessionStorage|localStorage/);
  assert.doesNotMatch(screen, /usePathname|onLoad|onError|skip|spinner|animate-spin/);
  assert.match(css, /--ink: #0b1626/);
  assert.match(css, /--gold: #e7b54a/);
  assert.match(css, /@keyframes vf-line/);
  assert.match(css, /@keyframes vf-logo/);
  assert.match(css, /@keyframes vf-fade/);
  assert.match(css, /\.vf-intro-line[\s\S]*animation: vf-line 0\.6s ease-out forwards/);
  assert.match(css, /\.vf-intro-logo[\s\S]*animation: vf-logo 1\.1s ease-out 0\.5s forwards/);
  assert.match(css, /\.vf-intro[\s\S]*animation: vf-fade 0\.6s ease-out 2\.4s forwards/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.vf-intro-line[\s\S]*display: none/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.vf-intro-logo[\s\S]*transform: none/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.vf-intro[\s\S]*animation: vf-fade 0\.4s ease-out 0\.6s forwards/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test tests/loading-screen.test.ts`

Expected: FAIL because `components/layout/LoadingScreen.tsx` does not exist.

- [ ] **Step 3: Write the component and the keyframes**

Create `components/layout/LoadingScreen.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

const FULL_MS = 3000;
const REDUCED_MS = 1000;

/** Full-load intro. The first render is the visible overlay; the timer removes it. */
export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const site = document.getElementById("site");
    if (site) site.inert = true;
    const timer = window.setTimeout(() => {
      if (site) site.inert = false;
      setShow(false);
    }, reduce ? REDUCED_MS : FULL_MS);
    return () => {
      window.clearTimeout(timer);
      if (site) site.inert = false;
    };
  }, []);

  if (!show) return null;

  return (
    <div className="vf-intro fixed inset-0 z-[80] flex items-center justify-center bg-ink" role="status">
      <span className="vf-intro-line" aria-hidden />
      <Logo priority className="vf-intro-logo h-auto w-40" sizes="160px" />
    </div>
  );
}
```

Append this to the end of `app/globals.css`:

```css
/* ---------- load intro ---------- */

@keyframes vf-line {
  from { transform: translate(-50%, -50%) scaleX(0); }
  to { transform: translate(-50%, -50%) scaleX(1); }
}

@keyframes vf-logo {
  from { transform: scale(0.86); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes vf-fade {
  from { opacity: 1; }
  to { opacity: 0; }
}

.vf-intro-line {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 6rem;
  height: 1px;
  background: var(--gold);
  transform: translate(-50%, -50%) scaleX(0);
  transform-origin: center;
}

.vf-intro-logo {
  position: relative;
  transform: scale(0.86);
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .vf-intro-line {
    animation: vf-line 0.6s ease-out forwards;
  }

  .vf-intro-logo {
    animation: vf-logo 1.1s ease-out 0.5s forwards;
  }

  .vf-intro {
    animation: vf-fade 0.6s ease-out 2.4s forwards;
  }
}

@media (prefers-reduced-motion: reduce) {
  .vf-intro-line {
    display: none;
  }

  .vf-intro-logo {
    transform: none;
    opacity: 1;
  }

  .vf-intro {
    animation: vf-fade 0.4s ease-out 0.6s forwards;
  }
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --experimental-strip-types --test tests/loading-screen.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add tests/loading-screen.test.ts components/layout/LoadingScreen.tsx app/globals.css
git commit -m @"
feat: add the mark-reveal loading screen

Play the logo and gold line on a navy field, then remove the overlay on a timer that does not wait for the image.
"@
```

---

### Task 2: Mount it on every page

**Files:**
- Modify: `app/layout.tsx`
- Modify: `tests/loading-screen.test.ts`
- Test: `tests/loading-screen.test.ts`, `tests/chrome.test.ts`, `tests/design.test.ts`, `tests/logo-assets.test.ts`

**Interfaces:**
- Consumes: `LoadingScreen` from Task 1.
- Produces: `#site` wrapping the skip link, `Navbar`, `main`, `Footer`, and `GetStartedBar`. `LoadingScreen` is a sibling after that wrapper. The JSON-LD script stays outside `#site`.

- [ ] **Step 1: Write the failing test**

Add this test to `tests/loading-screen.test.ts`:

```ts
test("every page mounts the intro above the site, which stays inert until it leaves", () => {
  const layout = read("app/layout.tsx");
  assert.match(layout, /<LoadingScreen \/>/);
  assert.match(layout, /id="site"/);
  const siteAt = layout.indexOf('id="site"');
  const screenAt = layout.indexOf("<LoadingScreen />");
  assert.ok(siteAt > -1 && screenAt > siteAt);
  assert.ok(layout.indexOf("<Navbar") > siteAt && layout.indexOf("<Navbar") < screenAt);
  assert.ok(layout.indexOf('id="main"') > siteAt && layout.indexOf('id="main"') < screenAt);
  assert.doesNotMatch(layout, /sessionStorage|localStorage/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test tests/loading-screen.test.ts`

Expected: FAIL on `<LoadingScreen />` missing from `app/layout.tsx`. The Task 1 test still passes.

- [ ] **Step 3: Mount the screen**

In `app/layout.tsx`, add:

```tsx
import { LoadingScreen } from "@/components/layout/LoadingScreen";
```

Replace the body contents so the chrome sits in `#site` and the intro is the next sibling. Leave the JSON-LD script where it is, after both:

```tsx
<body className="min-h-full bg-cream pb-[calc(4.75rem+env(safe-area-inset-bottom))] font-sans text-body antialiased md:pb-0">
  <div id="site">
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:rounded-md focus:bg-gold focus:px-4 focus:py-3 focus:text-ink"
    >
      Skip to content
    </a>
    <Navbar />
    <main id="main">{children}</main>
    <Footer />
    <GetStartedBar />
  </div>
  <LoadingScreen />
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
  />
</body>
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --experimental-strip-types --test tests/loading-screen.test.ts tests/chrome.test.ts tests/design.test.ts tests/logo-assets.test.ts`

Expected: PASS. `tests/logo-assets.test.ts` still finds at least three `vision-forge-logo.png` references in the layout, because the intro uses `Logo` rather than a new image path.

- [ ] **Step 5: Commit**

```powershell
git add app/layout.tsx tests/loading-screen.test.ts
git commit -m @"
feat: play the loading screen on every full load

Cover the site until the intro finishes, and leave client-side page changes alone.
"@
```
