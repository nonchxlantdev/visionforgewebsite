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
