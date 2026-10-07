import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
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
  // The originally supplied PNG is the brand file; the icons must be byte-identical copies.
  const sourceHash = sha256(brand);

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

  assert.match(hero, /<Logo\s+priority/);
  assert.match(hero, /sizes="\(min-width: 1024px\) 352px/);

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
