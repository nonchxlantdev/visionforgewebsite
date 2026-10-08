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
