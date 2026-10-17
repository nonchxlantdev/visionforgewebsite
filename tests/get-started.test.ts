import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

test("get started page: lanes first, then the form, with its own metadata", () => {
  const page = read("app/get-started/page.tsx");
  assert.match(page, /export const metadata/);
  assert.match(page, /canonical: "\/get-started"/);
  assert.ok(page.indexOf("<Lanes") > -1 && page.indexOf("<Lanes") < page.indexOf("<ContactSection"));
  assert.match(page, /<PageHeader/);
});

test("the form posts JSON to /api/contact and shares validation with the server", () => {
  const form = read("components/sections/ContactForm.tsx");
  assert.match(form, /^"use client";/);
  assert.match(form, /fetch\("\/api\/contact"/);
  assert.match(form, /validateContact/);
  assert.match(form, /HONEYPOT_FIELD/);
  assert.match(form, /TURNSTILE_SITE_KEY/);
  assert.match(form, /render=explicit/);
  assert.match(form, /noValidate/);
});

test("form states: inline errors, sending, sent, failed", () => {
  const form = read("components/sections/ContactForm.tsx");
  assert.match(form, /aria-invalid/);
  assert.match(form, /aria-describedby/);
  assert.match(form, /role="alert"/);
  assert.match(form, /role="status"/);
  assert.match(form, /Sending…/);
  assert.match(form, /Send message/);
  assert.match(form, /Message sent/);
  assert.match(form, /Your message didn't send\. Try again, or email /);
});

test("every field has a visible label, and lanes are a labelled radio group", () => {
  const form = read("components/sections/ContactForm.tsx");
  for (const name of ["name", "business", "email", "whatTheyDo", "slowingDown"]) {
    assert.match(form, new RegExp(`name: "${name}"`), name);
  }
  assert.match(form, /htmlFor=\{fieldId\}/);
  assert.match(form, /<legend[^>]*>Which fits you best\?<\/legend>/);
  assert.match(form, /type="radio"/);
});

test("contact section shows the sales email; the form shows the reply promise", () => {
  const section = read("components/sections/ContactSection.tsx");
  assert.match(section, /id="contact"/);
  assert.match(section, /site\.sales\.display/);
  assert.match(read("components/sections/ContactForm.tsx"), /replyPromise/);
});

test("lanes render both lanes and the small-print link", () => {
  const lanesSrc = read("components/sections/Lanes.tsx");
  assert.match(lanesSrc, /lanes\.map/);
  assert.match(lanesSrc, /lanesNote\.href/);
});

test("lanes always have an h2, so headings never skip a level", () => {
  const lanesSrc = read("components/sections/Lanes.tsx");
  assert.match(lanesSrc, /<h2 id="lanes-title" className="sr-only">Ways to start<\/h2>/);
  assert.doesNotMatch(lanesSrc, /aria-label=\{title \? undefined/);
});
