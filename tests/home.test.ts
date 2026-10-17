import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const exists = (path: string) => existsSync(new URL(path, root));

test("home tells the partner story in the agreed order", () => {
  const page = read("app/page.tsx");
  const order = ["<Hero", "<Pains", "<Stages", "<Workbench", "<Industries", "<WhyUs", "<Lanes", "<ContactSection"];
  const positions = order.map((tag) => page.indexOf(tag));
  for (const [i, pos] of positions.entries()) assert.ok(pos > -1, order[i]);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.doesNotMatch(page, /<ClosingBand|<PageIndex|<AutomateList/);
});

test("hero uses the new copy, one h1 and no all-caps label", () => {
  const hero = read("components/sections/Hero.tsx");
  assert.match(hero, /home\.headline/);
  assert.match(hero, /<h1/);
  assert.match(hero, /home\.trust\.map/);
  assert.doesNotMatch(hero, /Label|goldWord|emblem-glint|className="label/);
});

test("retired home parts are gone", () => {
  for (const gone of ["components/sections/AutomateList.tsx", "components/sections/PageIndex.tsx", "components/ui/Label.tsx"]) {
    assert.equal(exists(gone), false, gone);
  }
});

test("workbench still works: a real button, a live region, reduced motion", () => {
  const bench = read("components/sections/Workbench.tsx");
  assert.match(bench, /<button/);
  assert.match(bench, /aria-live="polite"/);
  assert.match(bench, /prefers-reduced-motion/);
  assert.doesNotMatch(bench, /font-hand|paper-torn|text-gold/);
});

test("stages section marks support as optional and links to services", () => {
  const src = read("components/sections/Stages.tsx");
  assert.match(src, /stage\.optional/);
  assert.match(src, /href="\/services"/);
  assert.match(src, /<ol/);
});

test("industries: six featured, the rest named in one sentence, no marquee", () => {
  const src = read("components/sections/Industries.tsx");
  assert.match(src, /featuredIndustries\.map/);
  assert.match(src, /moreIndustries/);
  assert.doesNotMatch(src, /marquee/);
});
