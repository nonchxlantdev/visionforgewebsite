import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const page = () => readFileSync(new URL("../app/about/page.tsx", import.meta.url), "utf8");

test("about: why we exist, what we believe, Belizean-owned, then the closing band", () => {
  const src = page();
  assert.match(src, /export const metadata/);
  assert.match(src, /canonical: "\/about"/);
  assert.match(src, /about\.story\.map/);
  assert.match(src, /about\.beliefs\.map/);
  assert.match(src, /about\.owned/);
  assert.match(src, /<ClosingBand \/>/);
  assert.ok(src.indexOf("about.story") < src.indexOf("about.beliefs"));
});
