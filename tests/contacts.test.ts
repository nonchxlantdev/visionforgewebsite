import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { site } from "../lib/site.ts";

const root = new URL("../", import.meta.url);

function sourceFiles(dir: URL): URL[] {
  return readdirSync(dir).flatMap((name) => {
    const url = new URL(name, dir);
    if (statSync(url).isDirectory()) return sourceFiles(new URL(`${name}/`, dir));
    return /\.(ts|tsx)$/.test(name) ? [url] : [];
  });
}

const files = ["app/", "components/", "lib/"].flatMap((dir) => sourceFiles(new URL(dir, root)));

test("every visionforgestudio.app email in source is lowercase", () => {
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/[A-Za-z0-9._-]+@visionforgestudio\.app/gi)) {
      assert.equal(match[0], match[0].toLowerCase(), `${file.pathname}: ${match[0]}`);
    }
  }
});

test("every mailto link is lowercase", () => {
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/mailto:[^"'`\s)}?]+/g)) {
      assert.equal(match[0], match[0].toLowerCase(), `${file.pathname}: ${match[0]}`);
    }
  }
});

test("sales is the only published contact", () => {
  assert.equal(site.sales.display, "sales@visionforgestudio.app");
  assert.equal(site.sales.href, "mailto:sales@visionforgestudio.app");
  for (const gone of ["support", "whatsapp", "phone", "projectMailto"]) assert.equal(gone in site, false, gone);
});

test("no phone numbers, WhatsApp links or support address anywhere in source", () => {
  const banned = /615-?7575|613-?9219|5016157575|5016139219|wa\.me|\btel:|support@visionforgestudio|site\.(whatsapp|phone|support)\b/;
  for (const file of files) assert.doesNotMatch(readFileSync(file, "utf8"), banned, file.pathname);
});

test("the business is never called a limited company", () => {
  for (const file of files) {
    assert.doesNotMatch(readFileSync(file, "utf8"), /\bLtd\b|\bLimited\b/, file.pathname);
  }
  assert.equal(site.legal.registeredName, "Vision Forge");
  assert.equal("registrationNumber" in site.legal, false);
});
