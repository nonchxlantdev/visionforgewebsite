import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

test("services page: one section per service, then the closing band", () => {
  const page = read("app/services/page.tsx");
  assert.match(page, /export const metadata/);
  assert.match(page, /canonical: "\/services"/);
  assert.match(page, /services\.map/);
  assert.match(page, /<ServiceStage/);
  assert.match(page, /<ImproveExamples/);
  assert.match(page, /<ClosingBand/);
  assert.match(page, /<PageHeader/);
});

test("each stage section carries its anchor and both lists", () => {
  const stage = read("components/sections/ServiceStage.tsx");
  assert.match(stage, /id=\{stage\.id\}/);
  assert.match(stage, /You might need this if/);
  assert.match(stage, /What we do/);
  assert.match(stage, /stage\.optional/);
});

test("improve examples come from the copy file", () => {
  assert.match(read("components/sections/ImproveExamples.tsx"), /automationExamples\.map/);
});
