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

test("hero: short first screen (trust pill, one h1, one line, two buttons), then the hub panel", () => {
  const hero = read("components/sections/Hero.tsx");
  assert.match(hero, /home\.headline/);
  assert.match(hero, /<h1/);
  assert.match(hero, /home\.trust\.map/);
  assert.match(hero, /text-center/);
  assert.ok(hero.indexOf("<h1") < hero.indexOf("<HubPanel"));
  assert.match(hero, /home\.lede/);
  assert.match(hero, /home\.eyebrow\.map/);
  assert.doesNotMatch(hero, /home\.detail/, "the long copy lives in <Intro />");
  assert.doesNotMatch(hero, /Label|goldWord|emblem-glint|className="label|<Logo/);
});

test("intro: the hero's longer copy, with the three capabilities highlighted", () => {
  const intro = read("components/sections/Intro.tsx");
  assert.match(intro, /highlight\(home\.detail, home\.capabilities\)/);
  assert.match(intro, /home\.detailMore/);
  const page = read("app/page.tsx");
  assert.ok(page.indexOf("<Hero") < page.indexOf("<Intro") && page.indexOf("<Intro") < page.indexOf("<Pains"));
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

test("how-we-work summary uses the compact scroll-driven steps and links to the full page", () => {
  const src = read("components/sections/Stages.tsx");
  assert.match(src, /<ProcessScroll variant="compact" \/>/);
  assert.match(src, /href="\/how-we-work"/);
  const scroll = read("components/sections/process/ProcessScroll.tsx");
  assert.match(scroll, /<ol/);
  assert.match(scroll, /howWeWorkSteps\.map/);
  assert.match(scroll, /aria-current=\{isActive \? "step"/);
  assert.match(scroll, /IntersectionObserver/);
  assert.match(scroll, /lg:hidden/, "phones get a still picture per step");
  assert.match(scroll, /sticky/, "desktop pins the picture");
});

test("the process picture is decorative, eases between steps and respects reduced motion", () => {
  const scene = read("components/sections/process/ProcessScene.tsx");
  assert.match(scene, /aria-hidden className=\{`relative overflow-hidden/);
  assert.match(scene, /processScene\(step, HUB_TOOLS, shape\)/);
  assert.match(scene, /small \? "narrow" : "wide"/, "phone cards use the two-column pictures");
  assert.match(scene, /motion-reduce:transition-none/);
});

test("capabilities lead with automation and integration; workflows carry the feasibility note", () => {
  assert.match(read("components/sections/Capabilities.tsx"), /coreServices\.map/);
  const wf = read("components/sections/Workflows.tsx");
  assert.match(wf, /workflowExamples\.map/);
  assert.match(wf, /workflowNote/);
});

test("the hub visual stays in the hero: work flows from source tools, through Vision Forge, to target tools", () => {
  assert.match(read("components/sections/Hero.tsx"), /<HubPanel \/>/);
  const panel = read("components/sections/HubPanel.tsx");
  assert.match(panel, /FLOW_SOURCES/);
  assert.match(panel, /FLOW_TARGETS/);
  assert.match(panel, /<figcaption/);
  assert.match(panel, /prefers-reduced-motion: reduce/);
});

test("who we help: three audiences, sectors named in one sentence, no marquee", () => {
  const src = read("components/sections/Industries.tsx");
  assert.match(src, /audiences\.map/);
  assert.match(src, /featuredIndustries/);
  assert.match(src, /moreIndustries/);
  assert.doesNotMatch(src, /marquee/);
});
