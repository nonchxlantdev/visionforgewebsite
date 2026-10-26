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

test("logo-matched tokens: navy night, gold and silver, warm light sections", () => {
  assert.equal(token("ink").toLowerCase(), "#0b1626");
  assert.equal(token("gold").toLowerCase(), "#e7b54a");
  assert.equal(token("accent").toLowerCase(), "#8a5f0f");
  assert.equal(token("coral").toLowerCase(), "#b23a22");
  assert.equal(token("body").toLowerCase(), "#3f4756");
  assert.equal(token("muted").toLowerCase(), "#5a6372");
  assert.equal(token("cream").toLowerCase(), "#faf8f3");
  assert.equal(token("mist").toLowerCase(), "#f2eee5");
  assert.equal(token("paper").toLowerCase(), "#ffffff");
  for (const name of ["ink-hover", "gold-hover", "line", "on-ink-2", "success", "danger"]) token(name);
  for (const old of ["--glow", "--mahogany", "--bg:", "--steel", "--paper-ink", "color-scheme: dark", ".paper-torn", ".font-wide", ".strike"]) {
    assert.ok(!css.includes(old), old);
  }
  assert.match(css, /color-scheme: light/);
});

test("text colour pairs pass WCAG AA (4.5:1) on light and dark bands", () => {
  const pairs: Array<[string, string]> = [
    ["ink", "cream"],
    ["ink", "paper"],
    ["ink", "mist"],
    ["body", "cream"],
    ["body", "mist"],
    ["muted", "cream"],
    ["muted", "mist"],
    ["muted", "paper"],
    ["accent", "cream"],
    ["accent", "paper"],
    ["accent", "mist"],
    ["coral", "cream"],
    ["coral", "paper"],
    ["success", "cream"],
    ["danger", "paper"],
    ["paper", "ink"],
    ["paper", "ink-hover"],
    ["on-ink-2", "ink"],
    ["gold", "ink"],
    ["ink", "gold"],
    ["ink", "gold-hover"],
  ];
  for (const [fg, bg] of pairs) {
    const ratio = contrast(token(fg), token(bg));
    assert.ok(ratio >= 4.5, `${fg} on ${bg} is ${ratio.toFixed(2)}`);
  }
});

test("keyboard focus stays visible on dark bands", () => {
  assert.match(css, /\.on-dark :focus-visible\s*\{\s*outline-color: var\(--gold\)/);
});

test("one self-hosted face: Manrope for headings and body", () => {
  const layout = read("app/layout.tsx");
  const file = new URL("app/fonts/manrope-var.woff2", root);
  assert.ok(existsSync(file), "manrope-var");
  assert.equal(readFileSync(file).subarray(0, 4).toString("latin1"), "wOF2");
  assert.match(layout, /manrope-var\.woff2/);
  for (const gone of ["literata-var", "public-sans-var", "archivo-var", "instrument-sans-var", "plex-mono-500", "caveat-600"]) {
    assert.equal(existsSync(new URL(`app/fonts/${gone}.woff2`, root)), false, gone);
    assert.doesNotMatch(layout, new RegExp(gone));
  }
  assert.doesNotMatch(layout, /fonts\.googleapis/);
  assert.match(layout, /colorScheme: "light"/);
  assert.match(css, /--font-display: var\(--font-manrope\)/);
  assert.match(css, /--font-sans: var\(--font-manrope\)/);
});

test("body text is 17px on phones and 18px from tablet up", () => {
  assert.match(css, /font-size: 1\.0625rem/);
  assert.match(css, /@media \(min-width: 768px\)\s*\{\s*body\s*\{\s*font-size: 1\.125rem/);
  assert.match(css, /line-height: 1\.65/);
});

test("only the load-intro keyframes; reduced motion is handled", () => {
  assert.deepEqual(css.match(/@keyframes [\w-]+/g), ["@keyframes vf-line", "@keyframes vf-logo", "@keyframes vf-fade"]);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});
