import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import {
  automations,
  faq,
  featuredTier,
  hero,
  industries,
  industryRibbon,
  navItems,
  pageIndex,
  promises,
  steps,
  tierOrder,
  tiers,
  websiteKinds,
} from "../lib/site.ts";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const exists = (path: string) => existsSync(new URL(path, root));

function sources(dir: string): string[] {
  return readdirSync(new URL(dir, root)).flatMap((name) => {
    const path = `${dir}${name}`;
    if (statSync(new URL(path, root)).isDirectory()) return sources(`${path}/`);
    return /\.(ts|tsx|css)$/.test(name) ? [path] : [];
  });
}

const pages = {
  "/": "app/page.tsx",
  "/automation": "app/automation/page.tsx",
  "/websites": "app/websites/page.tsx",
  "/pricing": "app/pricing/page.tsx",
  "/how-we-work": "app/how-we-work/page.tsx",
  "/contact": "app/contact/page.tsx",
} as const;

test("the hero says 'Your business, minus the busywork.'", () => {
  assert.equal(`${hero.title.join(" ")} ${hero.goldWord}`, "Your business, minus the busywork.");
  assert.match(hero.lede, /WhatsApp/);
  assert.equal(hero.primary.href, "/pricing");
  assert.equal(hero.secondary.href, "/automation");
  assert.ok(hero.meta.includes("From BZ$500*"));
  assert.match(hero.stamp, /000058528/);
});

test("six pages, each with metadata and exactly one h1 path", () => {
  for (const [route, file] of Object.entries(pages)) {
    assert.ok(exists(file), route);
    const src = read(file);
    if (route !== "/") assert.match(src, /export const metadata/, route);
    assert.match(src, /canonical/, route);
  }
  assert.match(read("components/sections/Hero.tsx"), /<h1/);
  assert.match(read("components/layout/PageHeader.tsx"), /<h1/);
  const sitemap = read("app/sitemap.ts");
  for (const route of Object.keys(pages).filter((r) => r !== "/")) assert.match(sitemap, new RegExp(`"${route}"`), route);
});

test("the nav lists the five inner pages in order", () => {
  assert.deepEqual(
    navItems.map((n) => n.href),
    ["/automation", "/websites", "/pricing", "/how-we-work", "/contact"],
  );
  assert.match(read("components/layout/Navbar.tsx"), /usePathname/);
});

test("home tells the short story and points to the inner pages", () => {
  const page = read("app/page.tsx");
  const order = ["<Hero", "<Workbench", "<AutomateList", "<Industries", "<PageIndex", "<ClosingBand"];
  const positions = order.map((tag) => page.indexOf(tag));
  for (const [i, pos] of positions.entries()) assert.ok(pos > -1, order[i]);
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
  assert.deepEqual(
    pageIndex.map((p) => p.href),
    ["/automation", "/websites", "/pricing", "/how-we-work"],
  );
});

test("automation, websites and pricing pages carry their own content", () => {
  assert.match(read(pages["/automation"]), /<Demo/);
  assert.equal(automations.length, 6);
  assert.deepEqual(
    websiteKinds.map((k) => k.id),
    ["business", "ecommerce", "virtual", "booking"],
  );
  assert.match(read(pages["/pricing"]), /<PricingBuilder/);
  assert.match(read(pages["/pricing"]), /<TierCards/);
  assert.match(read(pages["/how-we-work"]), /FAQPage/);
  assert.equal(promises.length, 4);
  assert.equal(steps.length, 4);
});

test("prices: three outcome tiers, Get found without Google, small print everywhere", () => {
  assert.deepEqual(
    tierOrder.map((id) => tiers[id].from),
    [500, 1500, 8000],
  );
  assert.equal(featuredTier, "automate");
  assert.doesNotMatch(tiers.found.copy + tiers.found.includes.join(" "), /Google/);
  for (const file of ["components/sections/TierCards.tsx", "components/sections/WorkTicket.tsx"]) {
    assert.match(read(file), /priceNote\.text/, file);
  }
  assert.match(read("app/disclaimer/page.tsx"), /id: "estimates"/);
});

test("business types lead with e-commerce and virtual shops", () => {
  assert.equal(industries.length, 8);
  assert.deepEqual(
    industries.slice(0, 2).map((i) => i.id),
    ["ecommerce", "virtual"],
  );
  assert.ok(industryRibbon.length >= 10);
  assert.ok(faq.length >= 9);
});

test("interactive pieces are keyboard operable and announce results", () => {
  const demo = read("components/sections/Demo.tsx");
  assert.match(demo, /type="radio"/);
  assert.match(demo, /aria-live="polite"/);
  const bench = read("components/sections/Workbench.tsx");
  assert.match(bench, /<button/);
  assert.match(bench, /aria-live="polite"/);
  assert.match(bench, /prefers-reduced-motion/);
  assert.match(read("components/sections/PricingBuilder.tsx"), /aria-pressed/);
});

test("no leftovers from the light theme or the old forge build", () => {
  const files = [...sources("app/"), ...sources("components/")];
  const banned = /text-gradient|dot-grid|bg-canvas|text-ink-2|bg-panel|HeatText|SparkField|\bmolten\b|\bember\b|whitehot/;
  for (const file of files) assert.doesNotMatch(read(file), banned, file);
  for (const gone of ["components/forge", "components/builder", "components/sections/Doors.tsx", "components/sections/Start.tsx"]) {
    assert.equal(exists(gone), false, gone);
  }
});
