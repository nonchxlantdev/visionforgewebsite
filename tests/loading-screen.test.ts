import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

test("the intro is a hammer striking an anvil, then the logo, on white; it leaves on a timer", () => {
  const screen = read("components/layout/LoadingScreen.tsx");
  const css = read("app/globals.css");
  assert.match(screen, /"use client"/);
  assert.match(screen, /<Logo/);
  assert.match(screen, /priority/);
  assert.match(screen, /w-40/);
  assert.match(screen, /sizes="160px"/);
  assert.doesNotMatch(screen, /decorative/);
  assert.doesNotMatch(screen, /Vision Forge Studio/);
  assert.match(screen, /bg-paper/);
  assert.match(read("components/layout/ForgeIntro.tsx"), /w-28/, "hammer and anvil are smaller than the w-40 logo");
  assert.match(screen, /z-\[80\]/);
  assert.match(screen, /<ForgeIntro \/>/);
  assert.doesNotMatch(screen, /vf-intro-line/);
  assert.ok(screen.indexOf("<ForgeIntro") < screen.indexOf("<Logo"), "logo sits on top of the forge");
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
  assert.match(css, /--ink: #0a0f1c/);
  assert.doesNotMatch(css, /vf-line|vf-intro-line/);
  for (const name of ["vf-forge-in", "vf-hammer", "vf-jolt", "vf-spark", "vf-flash", "vf-forge-out", "vf-logo", "vf-fade"]) {
    assert.match(css, new RegExp(`@keyframes ${name} `), name);
  }
  assert.match(css, /\.vf-hammer[\s\S]*transform-origin: 220px 96px/, "the hammer pivots on its handle end");
  assert.match(css, /\.vf-sparks-tap1 \.vf-spark \{[^}]*0\.55s/);
  assert.match(css, /\.vf-sparks-tap2 \.vf-spark \{[^}]*0\.95s/);
  assert.match(css, /\.vf-sparks-strike \.vf-spark \{[^}]*1\.5s/);
  assert.match(css, /\.vf-flash \{[^}]*1\.5s/);
  assert.match(css, /\.vf-intro-logo[\s\S]*animation: vf-logo 0\.7s ease-out 1\.6s forwards/);
  assert.match(css, /\.vf-intro[\s\S]*animation: vf-fade 0\.6s ease-out 2\.4s forwards/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.vf-forge \{\s*display: none/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.vf-intro-logo[\s\S]*transform: none/);
  assert.match(css, /prefers-reduced-motion: reduce[\s\S]*\.vf-intro[\s\S]*animation: vf-fade 0\.4s ease-out 0\.6s forwards/);
});

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

test("the forge drawing is decorative, pure SVG, and has two taps and a strike", () => {
  const forge = read("components/layout/ForgeIntro.tsx");
  assert.doesNotMatch(forge, /"use client"|useEffect|useState/);
  assert.match(forge, /<svg aria-hidden/);
  for (const part of ["vf-anvil", "vf-hammer", "vf-sparks-tap1", "vf-sparks-tap2", "vf-sparks-strike", "vf-flash"]) {
    assert.match(forge, new RegExp(part), part);
  }
  assert.equal((forge.match(/\{ dx: -?\d/g) ?? []).length, 13, "3 tap sparks (used twice) and 10 strike sparks");
});
