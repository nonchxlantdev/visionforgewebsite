# Hero Logo and Tap Prompt Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Invite a tap on the connected-system diagram, and show the supplied Vision Forge lockup large in the hero.

**Architecture:** A tiny pure helper owns the prompt string and the selected-node status. `ArchitectureDiagram` renders that helper and keeps its existing click-to-connect behavior. One unchanged PNG is copied into `public/brand` and `app` icons. `Logo` points at it, and the hero renders a larger instance above the existing mono line.

**Tech Stack:** Next.js 16.4 App Router, React 19, TypeScript, Tailwind CSS v4, Node 24 built-in test runner (`node:test`).

## Global Constraints

- Artwork is not redrawn, cropped, or recolored.
- Static prompt text is exactly `TAP A NODE TO CONNECT THE SYSTEM.`
- Status text after a tap is `` `${id} · ${label} · LINKED TO ALL` ``, for example `05 · DATA · LINKED TO ALL`.
- The status line is visually absent until a node is selected, and the live region stays in the page.
- Tapping a node links it to every other node. Tapping the origin again clears the links.
- Hero logo is 160px square below the `sm` breakpoint and 224px square from `sm` up.
- Nav logo classes stay `h-11 w-11 sm:h-12 sm:w-12` on the bar and `h-11 w-11` in the mobile dialog.
- Footer logo class stays `h-28 w-28`.
- Image alt stays `Vision Forge Studio`. Nav link label stays `Vision Forge Studio, home`.
- Open Graph, Twitter, and ProfessionalService image and logo use the PNG at 819×819.
- No change to node positions, link drawing, the process section, or copy outside the prompt.
- The git working tree already contains the uncommitted site. Each commit stages only the files listed in that task.

## File structure

- `lib/connection-status.ts` — prompt constant and status string. No React.
- `tests/connection-status.test.ts` — behavior of that helper.
- `tests/logo-assets.test.ts` — file identity, dimensions, and source wiring.
- `components/visuals/ArchitectureDiagram.tsx` — renders the prompt and status. Selection behavior stays.
- `components/ui/Logo.tsx` — PNG source, `object-contain`, caller-supplied `sizes`.
- `components/sections/Hero.tsx` — large logo above the mono line.
- `components/layout/Navbar.tsx` and `components/layout/Footer.tsx` — pass `sizes` only.
- `app/layout.tsx` — metadata and JSON-LD URLs.
- `public/brand/vision-forge-logo.png` — unchanged copy of the supplied file. Delete `public/brand/vision-forge-logo.jpg`.
- `app/icon.png` and `app/apple-icon.png` — same bytes. Delete `app/icon.jpg` and `app/apple-icon.jpg`.

---

### Task 1: Tap prompt

**Files:**
- Create: `lib/connection-status.ts`
- Create: `tests/connection-status.test.ts`
- Modify: `components/visuals/ArchitectureDiagram.tsx`
- Modify: `package.json` (add the `test` script)

**Interfaces:**
- Consumes: `architectureNodes` items `{ id: string; label: string }` from `lib/site.ts`. The selected value in the diagram is that item or `null`.
- Produces:
  - `export const TAP_PROMPT: string`
  - `export function connectionStatus(node: { id: string; label: string } | null): string`

- [ ] **Step 1: Write the failing test**

Create `tests/connection-status.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { connectionStatus, TAP_PROMPT } from "../lib/connection-status.ts";

test("tap prompt is the permanent instruction", () => {
  assert.equal(TAP_PROMPT, "TAP A NODE TO CONNECT THE SYSTEM.");
});

test("status is empty until a node is selected", () => {
  assert.equal(connectionStatus(null), "");
});

test("status names the selected node and says it is linked to all", () => {
  assert.equal(
    connectionStatus({ id: "05", label: "DATA" }),
    "05 · DATA · LINKED TO ALL",
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test tests/connection-status.test.ts`

Expected: FAIL because `../lib/connection-status.ts` cannot be resolved.

- [ ] **Step 3: Write the helper**

Create `lib/connection-status.ts`:

```ts
export const TAP_PROMPT = "TAP A NODE TO CONNECT THE SYSTEM.";

export function connectionStatus(node: { id: string; label: string } | null): string {
  if (!node) return "";
  return `${node.id} · ${node.label} · LINKED TO ALL`;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `node --experimental-strip-types --test tests/connection-status.test.ts`

Expected: 3 tests pass.

- [ ] **Step 5: Render the prompt in the diagram**

In `components/visuals/ArchitectureDiagram.tsx`, add this import beside the existing `architectureNodes` import:

```ts
import { connectionStatus, TAP_PROMPT } from "@/lib/connection-status";
```

Replace the single status paragraph (the element whose text is `SELECT A NODE` or `` `${origin.id} · ${origin.label} · LINKED TO ALL` ``) with:

```tsx
<div className="mb-4">
  <p className="font-mono text-[10px] tracking-[0.18em] text-faint">{TAP_PROMPT}</p>
  <p
    className={
      origin
        ? "mt-2 font-mono text-[10px] tracking-[0.18em] text-faint"
        : "sr-only"
    }
    aria-live="polite"
  >
    {connectionStatus(origin)}
  </p>
</div>
```

Leave `choose`, the SVG links, both node button groups, `ORIGIN`, and `LINKED` as they are.

- [ ] **Step 6: Add the test script and re-run**

In `package.json` scripts, add:

```json
"test": "node --experimental-strip-types --test"
```

Run: `npm test`

Expected: the three connection-status tests pass. No other test files exist yet.

- [ ] **Step 7: Commit**

```bash
git add -- lib/connection-status.ts tests/connection-status.test.ts components/visuals/ArchitectureDiagram.tsx package.json
git commit -m "Invite a tap before connecting the system nodes."
```

Do not stage other working-tree files.

---

### Task 2: Logo asset and hero placement

**Files:**
- Create: `public/brand/vision-forge-logo.png`
- Create: `app/icon.png`
- Create: `app/apple-icon.png`
- Create: `tests/logo-assets.test.ts`
- Delete: `public/brand/vision-forge-logo.jpg`
- Delete: `app/icon.jpg`
- Delete: `app/apple-icon.jpg`
- Modify: `components/ui/Logo.tsx`
- Modify: `components/sections/Hero.tsx`
- Modify: `components/layout/Navbar.tsx`
- Modify: `components/layout/Footer.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: the supplied PNG at `C:\Users\glenr\.cursor\projects\d-Entrepreneur-Vision-Forge-Ltd-Documents-visionforgestudio-app\assets\c__Users_glenr_AppData_Roaming_Cursor_User_workspaceStorage_a1a76169f928332a0b98f34352fb9885_images_logo-png-7f7be605-dc71-4ee8-93de-92bf17ef3b58.png`. Byte-for-byte. 819×819, PNG color type 6.
- Produces: `Logo({ className, priority, sizes })` rendering `next/image` with `src="/brand/vision-forge-logo.png"`, `alt="Vision Forge Studio"`, `width={819}`, `height={819}`, and `object-contain`.

- [ ] **Step 1: Write the failing test**

Create `tests/logo-assets.test.ts`:

```ts
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const sourcePng = new URL(
  "file:///C:/Users/glenr/.cursor/projects/d-Entrepreneur-Vision-Forge-Ltd-Documents-visionforgestudio-app/assets/c__Users_glenr_AppData_Roaming_Cursor_User_workspaceStorage_a1a76169f928332a0b98f34352fb9885_images_logo-png-7f7be605-dc71-4ee8-93de-92bf17ef3b58.png",
);

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
  const sourceHash = sha256(sourcePng);

  assert.equal(sha256(brand), sourceHash);
  assert.equal(sha256(icon), sourceHash);
  assert.equal(sha256(apple), sourceHash);
  assert.deepEqual(pngSize(brand), { width: 819, height: 819, colorType: 6 });
  assert.equal(existsSync(new URL("./public/brand/vision-forge-logo.jpg", root)), false);
  assert.equal(existsSync(new URL("./app/icon.jpg", root)), false);
  assert.equal(existsSync(new URL("./app/apple-icon.jpg", root)), false);
});

test("logo and page metadata use the png without cropping it", () => {
  const logo = readFileSync(new URL("./components/ui/Logo.tsx", root), "utf8");
  const hero = readFileSync(new URL("./components/sections/Hero.tsx", root), "utf8");
  const layout = readFileSync(new URL("./app/layout.tsx", root), "utf8");
  const navbar = readFileSync(new URL("./components/layout/Navbar.tsx", root), "utf8");
  const footer = readFileSync(new URL("./components/layout/Footer.tsx", root), "utf8");

  assert.match(logo, /src="\/brand\/vision-forge-logo\.png"/);
  assert.match(logo, /object-contain/);
  assert.match(logo, /alt="Vision Forge Studio"/);
  assert.match(logo, /width=\{819\}/);
  assert.match(logo, /height=\{819\}/);
  assert.doesNotMatch(logo, /vision-forge-logo\.jpg/);
  assert.doesNotMatch(logo, /object-cover/);

  const logoAt = hero.indexOf("<Logo");
  const labelAt = hero.indexOf("VISION FORGE / DIGITAL ENGINEERING");
  assert.ok(logoAt >= 0 && labelAt > logoAt);
  assert.match(hero, /h-40 w-40 sm:h-56 sm:w-56/);
  assert.match(hero, /sizes="\(min-width: 640px\) 224px, 160px"/);

  assert.match(navbar, /h-11 w-11 sm:h-12 sm:w-12/);
  assert.match(navbar, /sizes="48px"/);
  assert.match(navbar, /aria-label="Vision Forge Studio, home"/);
  assert.match(footer, /h-28 w-28/);
  assert.match(footer, /sizes="112px"/);

  assert.equal(layout.match(/vision-forge-logo\.png/g)?.length, 4);
  assert.doesNotMatch(layout, /vision-forge-logo\.jpg/);
  assert.match(layout, /width: 819/);
  assert.match(layout, /height: 819/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node --experimental-strip-types --test tests/logo-assets.test.ts`

Expected: FAIL because `public/brand/vision-forge-logo.png` does not exist, and `Logo.tsx` still references the JPG and `object-cover`.

- [ ] **Step 3: Copy the PNG unchanged and remove the JPGs**

From the repo root in PowerShell:

```powershell
Copy-Item -LiteralPath "C:\Users\glenr\.cursor\projects\d-Entrepreneur-Vision-Forge-Ltd-Documents-visionforgestudio-app\assets\c__Users_glenr_AppData_Roaming_Cursor_User_workspaceStorage_a1a76169f928332a0b98f34352fb9885_images_logo-png-7f7be605-dc71-4ee8-93de-92bf17ef3b58.png" -Destination "public\brand\vision-forge-logo.png"
Copy-Item -LiteralPath "public\brand\vision-forge-logo.png" -Destination "app\icon.png"
Copy-Item -LiteralPath "public\brand\vision-forge-logo.png" -Destination "app\apple-icon.png"
Remove-Item -LiteralPath "public\brand\vision-forge-logo.jpg","app\icon.jpg","app\apple-icon.jpg"
```

Do not open the PNG in an editor or recompress it.

- [ ] **Step 4: Point Logo, the hero, nav, footer, and metadata at the PNG**

Replace `components/ui/Logo.tsx` with:

```tsx
import Image from "next/image";

type LogoProps = {
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function Logo({
  className = "h-12 w-12",
  priority = false,
  sizes = "48px",
}: LogoProps) {
  return (
    <Image
      src="/brand/vision-forge-logo.png"
      alt="Vision Forge Studio"
      width={819}
      height={819}
      priority={priority}
      sizes={sizes}
      className={`object-contain ${className}`}
    />
  );
}
```

In `components/sections/Hero.tsx`, make the logo the first child of the left column. The mono line stays, with `mt-6` so it sits below the lockup. The headline and everything after it stay.

```tsx
<div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:px-12 xl:px-16">
  <Logo
    priority
    className="h-40 w-40 sm:h-56 sm:w-56"
    sizes="(min-width: 640px) 224px, 160px"
  />
  <p className="mt-6 font-mono text-[11px] tracking-[0.22em] text-cyan">
    VISION FORGE / DIGITAL ENGINEERING
  </p>
```

Add `import { Logo } from "@/components/ui/Logo";` to that file.

In `components/layout/Navbar.tsx`, pass `sizes="48px"` on the bar logo. Leave its class `h-11 w-11 sm:h-12 sm:w-12`. Pass `sizes="44px"` on the mobile-dialog logo. Leave its class `h-11 w-11`. Leave both `aria-label="Vision Forge Studio, home"` values.

In `components/layout/Footer.tsx`, pass `sizes="112px"` on the logo. Leave its class `h-28 w-28`.

In `app/layout.tsx`, replace every `/brand/vision-forge-logo.jpg` with `/brand/vision-forge-logo.png`. There are four: Open Graph `images[0].url`, Twitter `images[0]`, JSON-LD `image`, and JSON-LD `logo`. Set the Open Graph image `width` and `height` to `819`.

- [ ] **Step 5: Run the tests**

Run: `npm test`

Expected: connection-status tests and both logo-asset tests pass.

- [ ] **Step 6: Check the page**

With the dev server already running, open the site. If it is not running, start `npm run dev -- --port 3460`.

At a desktop width of at least 1280px:

- The hero lockup is the first thing in the left column, above `VISION FORGE / DIGITAL ENGINEERING` and the headline.
- `TAP A NODE TO CONNECT THE SYSTEM.` is visible above the diagram.
- Activate the `DATA` node. Lines connect it to the other five nodes. The status reads `05 · DATA · LINKED TO ALL`. The prompt is still visible.
- Activate `DATA` again. The lines clear and the status is not visible. The prompt remains.
- `document.documentElement.scrollWidth === document.documentElement.clientWidth`.

Repeat the prompt, selection, clear, and overflow checks at 390px width. The hero logo is in the left stack above the mono line.

- [ ] **Step 7: Commit**

```bash
git add -- public/brand/vision-forge-logo.png public/brand/vision-forge-logo.jpg app/icon.png app/apple-icon.png app/icon.jpg app/apple-icon.jpg components/ui/Logo.tsx components/sections/Hero.tsx components/layout/Navbar.tsx components/layout/Footer.tsx app/layout.tsx tests/logo-assets.test.ts
git commit -m "Show the supplied lockup in the hero and site icons."
```

`git add` of the deleted JPGs records the deletions. Do not stage other working-tree files.
