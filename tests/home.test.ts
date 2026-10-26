import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const exists = (path: string) => existsSync(new URL(path, root));

test("home follows the brief's order", () => {
  const page = read("app/page.tsx");
  const order = ["<Hero", "<Pains", "<Capabilities", "<Workflows", "<Stages", "<Industries", "<MoreServices", "<Lanes", "<ContactSection"];
  const positions = order.map((tag) => page.indexOf(tag));
  for (const [i, pos] of positions.entries()) assert.ok(pos > -1, order[i]);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.doesNotMatch(page, /<ClosingBand|<PageIndex|<AutomateList|<Workbench/);
});

test("hero: centred copy, one h1, then the 3D hub", () => {
  const hero = read("components/sections/Hero.tsx");
  assert.match(hero, /home\.headline/);
  assert.match(hero, /<h1/);
  assert.match(hero, /home\.trust\.map/);
  assert.match(hero, /text-center/);
  assert.ok(hero.indexOf("<h1") < hero.indexOf("<HubScene"));
  assert.match(hero, /home\.lede/);
  assert.match(hero, /home\.eyebrow\.map/);
  assert.match(hero, /home\.detailMore/);
  assert.match(hero, /highlight\(home\.detail, home\.capabilities\)/);
  assert.match(hero, /bg-clip-text/);
  assert.doesNotMatch(hero, /Label|goldWord|emblem-glint|className="label|<Logo/);
});

test("retired home parts are gone", () => {
  for (const gone of [
    "components/sections/AutomateList.tsx",
    "components/sections/PageIndex.tsx",
    "components/ui/Label.tsx",
    "components/sections/Workbench.tsx",
    "lib/demo.ts",
  ]) {
    assert.equal(exists(gone), false, gone);
  }
});

test("how-we-work summary is numbered and links to the full page", () => {
  const src = read("components/sections/Stages.tsx");
  assert.match(src, /howWeWorkSteps\.map/);
  assert.match(src, /href="\/how-we-work"/);
  assert.match(src, /<ol/);
});

test("capabilities lead with automation and integration; workflows carry the feasibility note", () => {
  assert.match(read("components/sections/Capabilities.tsx"), /coreServices\.map/);
  const wf = read("components/sections/Workflows.tsx");
  assert.match(wf, /workflowExamples\.map/);
  assert.match(wf, /workflowNote/);
});

test("the hub visual stays in the hero", () => {
  assert.match(read("components/sections/Hero.tsx"), /<HubScene \/>/);
});

test("who we help: three audiences, sectors named in one sentence, no marquee", () => {
  const src = read("components/sections/Industries.tsx");
  assert.match(src, /audiences\.map/);
  assert.match(src, /featuredIndustries/);
  assert.match(src, /moreIndustries/);
  assert.doesNotMatch(src, /marquee/);
});
