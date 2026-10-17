import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const exists = (path: string) => existsSync(new URL(path, root));

test("the old pages and their parts are gone", () => {
  for (const gone of [
    "app/automation/page.tsx",
    "app/websites/page.tsx",
    "app/pricing/page.tsx",
    "app/contact/page.tsx",
    "components/sections/Demo.tsx",
    "components/sections/AutomationDetail.tsx",
    "components/sections/WorksWith.tsx",
    "components/sections/WebsiteKinds.tsx",
    "components/sections/SiteIncludes.tsx",
    "components/sections/PricingBuilder.tsx",
    "components/sections/WorkTicket.tsx",
    "components/sections/TierCards.tsx",
    "components/sections/Contact.tsx",
    "lib/project-builder.ts",
  ]) {
    assert.equal(exists(gone), false, gone);
  }
});

test("old URLs redirect permanently (301) to their new homes", () => {
  const config = read("next.config.ts");
  const pairs = [
    ["/pricing", "/get-started"],
    ["/contact", "/get-started"],
    ["/automation", "/services#improve"],
    ["/websites", "/services#build"],
  ];
  for (const [source, destination] of pairs) {
    assert.match(config, new RegExp(`source: "${source}", destination: "${destination}", statusCode: 301`), source);
  }
  assert.doesNotMatch(config, /permanent: true/);
});

test("the sitemap lists the new pages and none of the retired ones", () => {
  const sitemap = read("app/sitemap.ts");
  for (const route of ["/services", "/how-we-work", "/about", "/get-started"]) assert.match(sitemap, new RegExp(`"${route}"`), route);
  for (const route of ["/automation", "/websites", "/pricing", "/contact"]) assert.doesNotMatch(sitemap, new RegExp(`"${route}"`), route);
});
