import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { LOGO_SIZE } from "../lib/logo-variants.ts";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

function pngSize(path: string): { width: number; height: number; colorType: number } {
  const buf = readFileSync(new URL(path, root));
  assert.equal(buf.subarray(12, 16).toString("ascii"), "IHDR");
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), colorType: buf[25] };
}

test("the brand png is the new transparent emblem and its size is recorded once", () => {
  assert.deepEqual(pngSize("public/brand/vision-forge-logo.png"), { ...LOGO_SIZE, colorType: 6 });
  assert.equal(existsSync(new URL("public/brand/vision-forge-logo.jpg", root)), false);
});

test("app icons are square", () => {
  for (const icon of ["app/icon.png", "app/apple-icon.png"]) {
    const { width, height } = pngSize(icon);
    assert.equal(width, height, icon);
  }
});

test("the logo component and metadata use the png without cropping", () => {
  const logo = read("components/ui/Logo.tsx");
  assert.match(logo, /src="\/brand\/vision-forge-logo\.png"/);
  assert.match(logo, /object-contain/);
  assert.match(logo, /alt="Vision Forge Studio"/);
  assert.match(logo, /LOGO_SIZE\.width/);
  assert.doesNotMatch(logo, /object-cover/);
  const layout = read("app/layout.tsx");
  assert.ok((layout.match(/vision-forge-logo\.png/g)?.length ?? 0) >= 3);
  assert.match(read("components/layout/Navbar.tsx"), /aria-label="Vision Forge Studio, home"/);
});
