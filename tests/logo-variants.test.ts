import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import test from "node:test";
import { LOGO_SRC, LOGO_WIDTHS, logoVariant, resolveImage } from "../lib/logo-variants.ts";

const root = new URL("../", import.meta.url);

test("picks the smallest pre-made logo that is at least as wide as asked", () => {
  assert.equal(logoVariant(48), "/brand/vision-forge-logo-96.webp");
  assert.equal(logoVariant(96), "/brand/vision-forge-logo-96.webp");
  assert.equal(logoVariant(97), "/brand/vision-forge-logo-160.webp");
  assert.equal(logoVariant(416), "/brand/vision-forge-logo-512.webp");
  assert.equal(logoVariant(900), "/brand/vision-forge-logo-1080.webp");
  assert.equal(logoVariant(3840), "/brand/vision-forge-logo-1348.webp");
});

test("only the logo is remapped; other images pass through untouched", () => {
  assert.equal(resolveImage(LOGO_SRC, 256), "/brand/vision-forge-logo-256.webp");
  assert.equal(resolveImage("/textures/grain.png", 256), "/textures/grain.png");
});

test("every logo variant exists and is far lighter than the original png", () => {
  const png = statSync(new URL(`./public${LOGO_SRC}`, root)).size;
  for (const w of LOGO_WIDTHS) {
    const file = new URL(`./public/brand/vision-forge-logo-${w}.webp`, root);
    assert.ok(existsSync(file), `missing ${w}`);
    assert.ok(statSync(file).size < png / 5, `${w} too heavy`);
  }
});
