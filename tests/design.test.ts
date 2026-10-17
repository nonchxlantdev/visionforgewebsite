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
