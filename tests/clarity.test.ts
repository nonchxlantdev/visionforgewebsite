import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { automations, faq, featuredTier, hero, navItems, steps, tierOrder, tiers } from "../lib/site.ts";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

function sources(dir: string): string[] {
  const base = new URL(dir, root);
  return readdirSync(base).flatMap((name) => {
    const path = `${dir}${name}`;
    if (statSync(new URL(path, root)).isDirectory()) return sources(`${path}/`);
    return /\.(ts|tsx|css)$/.test(name) ? [path] : [];
  });
}

test("the hero leads with the automation promise and the starting price", () => {
  assert.equal(hero.title.join(" "), "Stop doing the same work twice.");
  assert.match(hero.lede, /WhatsApp/);
  assert.match(hero.lede, /websites too/i);
  assert.match(hero.trust, /BZ\$500\*/);
  assert.equal(hero.primary, "See how it works");
});

test("six everyday problems, in the customer's words, ending with the website", () => {
  assert.equal(automations.length, 6);
  assert.ok(automations.some((a) => a.pain === "My sales and my accounts never match up."));
  assert.equal(automations[automations.length - 1].id, "website");
  for (const a of automations) {
    assert.ok(a.pain.endsWith("."), a.id);
    assert.ok(a.fix.length > 20, a.id);
  }
  assert.ok(!automations.some((a) => /talk to each other/i.test(a.pain)));
});

test("three outcome tiers at 500, 1,500 and 8,000 with automate featured", () => {
  assert.deepEqual([...tierOrder], ["found", "automate", "connect"]);
  assert.deepEqual(
    tierOrder.map((id) => tiers[id].from),
    [500, 1500, 8000],
  );
  assert.deepEqual(
    tierOrder.map((id) => tiers[id].label),
    ["Get found", "Automate one task", "Connect your business"],
  );
  assert.equal(featuredTier, "automate");
  for (const id of tierOrder) assert.ok(tiers[id].includes.length >= 3, id);
});

test("four steps, nine FAQs including the two automation questions", () => {
  assert.equal(steps.length, 4);
  assert.ok(faq.length >= 9);
  const questions = faq.map((f) => f.q);
  assert.ok(questions.includes("Do I have to change the software I already use?"));
  assert.ok(questions.includes("Is automation only for big companies?"));
  assert.match(faq.find((f) => f.q === "How much will my project cost?")!.a, /BZ\$1,500/);
});

test("the nav follows the page story", () => {
  assert.deepEqual(
    navItems.map((n) => n.id),
    ["how", "automate", "pricing", "faq", "contact"],
  );
});

test("forge styling and jargon are gone from the app", () => {
  const files = [...sources("app/"), ...sources("components/"), "lib/site.ts"];
  const banned = /\bmolten\b|\bember\b|whitehot|HeatText|SparkField|useSparks|font-display|chrome-text|hot-text|\bsoot\b|Strike while|Raw materials/;
  for (const file of files) assert.doesNotMatch(read(file), banned, file);
  for (const gone of ["components/forge", "components/builder", "components/sections/Doors.tsx", "components/sections/WhyUs.tsx", "components/visuals"]) {
    assert.equal(existsSync(new URL(gone, root)), false, gone);
  }
});

test("the homepage tells one story in order", () => {
  const page = read("app/page.tsx");
  const order = ["<Hero", "<Demo", "<Automate", "<HowItWorks", "<Pricing", "<Start", "<Faq", "<Contact"];
  const positions = order.map((tag) => page.indexOf(tag));
  for (const [i, pos] of positions.entries()) assert.ok(pos > -1, order[i]);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.match(page, /FAQPage/);
  assert.match(read("components/sections/Hero.tsx"), /<h1/);
});

test("prices carry the small-print note wherever they appear", () => {
  for (const file of ["components/sections/Pricing.tsx", "components/sections/StartCard.tsx"]) {
    assert.match(read(file), /priceNote\.text/, file);
  }
  assert.match(read("lib/site.ts"), /not final quotes/);
  assert.match(read("app/disclaimer/page.tsx"), /id: "estimates"/);
});

test("the demo is operable by keyboard and announces its result", () => {
  const demo = read("components/sections/Demo.tsx");
  assert.match(demo, /type="radio"/);
  assert.match(demo, /aria-live="polite"/);
  assert.match(demo, /prefers-reduced-motion/);
  assert.match(demo, /<noscript>/);
});
