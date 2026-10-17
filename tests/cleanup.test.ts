import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import * as siteModule from "../lib/site.ts";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

function sources(dir: string): string[] {
  return readdirSync(new URL(dir, root)).flatMap((name) => {
    const path = `${dir}${name}`;
    if (statSync(new URL(path, root)).isDirectory()) return sources(`${path}/`);
    return /\.(ts|tsx|css)$/.test(name) ? [path] : [];
  });
}

test("superseded copy exports are gone from lib/site.ts", () => {
  const exported = Object.keys(siteModule);
  for (const gone of [
    "hero",
    "automations",
    "industries",
    "industryRibbon",
    "websiteKinds",
    "websiteIncludes",
    "worksWith",
    "promises",
    "pageIndex",
    "steps",
    "faq",
    "tiers",
    "tierOrder",
    "featuredTier",
    "formatBZ",
    "priceNote",
    "navItems",
  ]) {
    assert.equal(exported.includes(gone), false, gone);
  }
  assert.equal("trustLine" in siteModule.site, false);
});

test("no dark-theme utilities, old fonts or all-caps labels survive in app or components", () => {
  const banned =
    /\b(?:text|bg|border|decoration|from|to|via)-(?:steel(?:-hi|-2)?|gold(?:-hi)?|on-gold|bg(?:-2|-3)?|line-2|paper-ink(?:-2)?|ink-red|done)\b|font-wide|font-hand|font-mono|className="label|emblem-|marquee/;
  for (const file of [...sources("app/"), ...sources("components/")]) {
    assert.doesNotMatch(read(file), banned, file);
  }
});

test("security docs describe the contact form and the sales address", () => {
  assert.doesNotMatch(read("SECURITY.md"), /support@/);
  const deployment = read("SECURITY-DEPLOYMENT.md");
  assert.match(deployment, /\/api\/contact/);
  assert.match(deployment, /Turnstile/);
  assert.doesNotMatch(deployment, /no contact form/);
});
