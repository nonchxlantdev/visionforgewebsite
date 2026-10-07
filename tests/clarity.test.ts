import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { doors, faq, hero, steps, tiers } from "../lib/site.ts";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

test("the hero says what is sold, to whom, the starting price and how to start", () => {
  assert.match(hero.title, /websites, apps and business systems/i);
  assert.match(hero.title, /Belize/);
  assert.match(hero.trust, /BZ\$500/);
  assert.match(hero.primary, /WhatsApp/);
  assert.match(read("components/sections/Hero.tsx"), /as="h1"/);
});

test("both audiences get a door with plain problems and four things we build", () => {
  assert.deepEqual(
    doors.map((d) => d.id),
    ["small", "company"],
  );
  for (const door of doors) {
    assert.ok(door.problems.length >= 3);
    assert.equal(door.builds.length, 4);
    for (const item of door.builds) assert.ok(item.copy.length > 20, item.title);
  }
});

test("three tiers start at 500, 2,500 and 8,000 Belize dollars", () => {
  assert.deepEqual(
    Object.values(tiers).map((t) => t.from),
    [500, 2500, 8000],
  );
});

test("how it works has four steps and the FAQ answers at least six questions", () => {
  assert.equal(steps.length, 4);
  assert.ok(faq.length >= 6);
  assert.match(read("app/page.tsx"), /FAQPage/);
});

test("retired forge jargon is gone from the homepage", () => {
  const dir = new URL("components/sections/", root);
  const sources = [read("app/page.tsx"), read("lib/site.ts"), ...readdirSync(dir).map((f) => read(`components/sections/${f}`))].join(
    "\n",
  );
  for (const phrase of ["Heat. Shape.", "Raw materials", "Strike while", "metal:", "Six metals"]) {
    assert.ok(!sources.includes(phrase), phrase);
  }
});

test("a small-print note says prices are not final wherever prices appear", () => {
  for (const file of ["components/sections/Pricing.tsx", "components/builder/ProjectCard.tsx"]) {
    assert.match(read(file), /priceNote\.text/, file);
  }
  assert.match(read("lib/site.ts"), /not final quotes/);
  assert.match(read("app/disclaimer/page.tsx"), /id: "estimates"/);
});
