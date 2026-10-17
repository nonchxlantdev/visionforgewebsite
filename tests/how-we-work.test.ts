import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

test("how we work: steps, the new FAQ with structured data, and the closing band", () => {
  const page = read("app/how-we-work/page.tsx");
  assert.match(page, /<ProcessSteps \/>/);
  assert.match(page, /<Faq items=\{questions\} \/>/);
  assert.match(page, /"FAQPage"/);
  assert.match(page, /questions\.map/);
  assert.match(page, /<ClosingBand \/>/);
  assert.match(page, /canonical: "\/how-we-work"/);
  assert.doesNotMatch(page, /Timeline|Promises/);
});

test("four numbered steps, then training and support set apart as optional", () => {
  const steps = read("components/sections/ProcessSteps.tsx");
  assert.match(steps, /<ol/);
  assert.match(steps, /howWeWorkSteps\.map/);
  assert.match(steps, /afterLaunch\.title/);
  assert.match(steps, /<aside/);
});

test("the old timeline and promises are gone", () => {
  for (const gone of ["components/sections/Timeline.tsx", "components/sections/Promises.tsx"]) {
    assert.equal(existsSync(new URL(gone, root)), false, gone);
  }
});
