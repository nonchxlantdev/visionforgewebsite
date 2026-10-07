import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const routes = ["terms", "privacy", "disclaimer", "cookies"] as const;

test("each legal page exists, names Belize and uses the legal layout", () => {
  for (const route of routes) {
    const path = `app/${route}/page.tsx`;
    assert.ok(existsSync(new URL(path, root)), path);
    const source = read(path);
    assert.match(source, /Belize/, path);
    assert.match(source, /LegalLayout/, path);
    assert.match(source, /export const metadata/, path);
  }
});

test("legal copy stays generic: no statute citations", () => {
  for (const route of routes) {
    assert.doesNotMatch(read(`app/${route}/page.tsx`), /\bAct\b|Chapter \d|Cap\. ?\d/, route);
  }
});

test("the footer links every legal page and shows the registration", () => {
  const footer = read("components/layout/Footer.tsx");
  const site = read("lib/site.ts");
  for (const route of routes) assert.match(site, new RegExp(`href: "/${route}"`));
  assert.match(footer, /legalItems/);
  assert.match(footer, /registrationNumber/);
  assert.match(site, /registrationNumber: "000058528"/);
});

test("the sitemap lists the legal pages", () => {
  const sitemap = read("app/sitemap.ts");
  for (const route of routes) assert.match(sitemap, new RegExp(`"/${route}"`));
});
