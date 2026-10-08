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

test("workshop tokens exist and the light theme is gone", () => {
  for (const name of ["bg", "bg-2", "bg-3", "line", "steel-hi", "steel", "steel-2", "gold", "on-gold", "paper", "paper-ink", "paper-ink-2", "ink-red", "done"]) {
    token(name);
  }
  for (const old of ["--canvas", "--panel-ink", "--accent:", ".text-gradient", ".dot-grid", "--molten", "--ember"]) {
    assert.ok(!css.includes(old), old);
  }
  assert.match(css, /color-scheme: dark/);
});

test("text colour pairs pass WCAG AA (4.5:1)", () => {
  const pairs: Array<[string, string]> = [
    ["steel-hi", "bg"],
    ["steel", "bg"],
    ["steel", "bg-2"],
    ["steel-2", "bg"],
    ["steel-2", "bg-2"],
    ["steel-2", "bg-3"],
    ["gold", "bg"],
    ["gold", "bg-2"],
    ["on-gold", "gold"],
    ["paper-ink", "paper"],
    ["paper-ink-2", "paper"],
    ["ink-red", "paper"],
    ["done", "bg-2"],
  ];
  for (const [fg, bg] of pairs) {
    const ratio = contrast(token(fg), token(bg));
    assert.ok(ratio >= 4.5, `${fg} on ${bg} is ${ratio.toFixed(2)}`);
  }
});

test("four self-hosted faces: wide display, body, mono labels, handwriting", () => {
  const layout = read("app/layout.tsx");
  for (const font of ["archivo-var", "instrument-sans-var", "plex-mono-500", "caveat-600"]) {
    assert.ok(existsSync(new URL(`app/fonts/${font}.woff2`, root)), font);
    assert.match(layout, new RegExp(`${font}\\.woff2`));
  }
  assert.doesNotMatch(layout, /inter-variable|fonts\.googleapis/);
  assert.match(layout, /colorScheme: "dark"/);
});

test("signature motion is CSS-only and switched off for reduced motion", () => {
  for (const name of ["glint", "marquee", "stamp", "reveal"]) assert.match(css, new RegExp(`@keyframes ${name}`), name);
  const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  for (const cls of [".emblem-glint", ".marquee-track", ".stamp-in", ".strike"]) assert.ok(reduced.includes(cls), cls);
});
