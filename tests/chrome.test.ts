import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const exists = (path: string) => existsSync(new URL(path, root));

test("navbar: services, how we work, about and a Get started button", () => {
  const nav = read("components/layout/Navbar.tsx");
  assert.match(nav, /primaryNav/);
  assert.match(nav, /href="\/get-started"/);
  assert.match(nav, /usePathname/);
  assert.doesNotMatch(nav, /whatsapp|phone/i);
  assert.match(nav, /aria-label="Vision Forge Studio, home"/);
});

test("footer: sales email, pages, legal links and the registration line", () => {
  const footer = read("components/layout/Footer.tsx");
  assert.match(footer, /site\.sales\.display/);
  assert.match(footer, /primaryNav/);
  assert.match(footer, /legalItems/);
  assert.match(footer, /registrationNumber/);
  assert.doesNotMatch(footer, /whatsapp|phone/i);
});

test("the phone bar is now a single Get started button", () => {
  assert.equal(exists("components/layout/MobileContactBar.tsx"), false);
  const bar = read("components/layout/GetStartedBar.tsx");
  assert.match(bar, /href="\/get-started"/);
  assert.match(bar, /md:hidden/);
  const layout = read("app/layout.tsx");
  assert.match(layout, /<GetStartedBar \/>/);
  assert.doesNotMatch(layout, /MobileContactBar/);
});

test("structured data lists the sales email and no telephone", () => {
  const layout = read("app/layout.tsx");
  assert.doesNotMatch(layout, /telephone/);
  assert.match(layout, /contactType: "sales"/);
  assert.match(layout, /\/get-started/);
});

test("closing band sends people to the form", () => {
  const band = read("components/layout/ClosingBand.tsx");
  assert.match(band, /closing\.cta\.href/);
  assert.doesNotMatch(band, /whatsapp/i);
});

test("legal pages: no WhatsApp, and the privacy policy describes the form truthfully", () => {
  for (const page of ["terms", "privacy", "cookies", "disclaimer"]) {
    assert.doesNotMatch(read(`app/${page}/page.tsx`), /WhatsApp/, page);
  }
  const privacy = read("app/privacy/page.tsx");
  assert.doesNotMatch(privacy, /no contact forms/);
  assert.match(privacy, /contact form/);
  assert.match(privacy, /Turnstile/);
  assert.match(privacy, /Resend/);
});

test("primitives: no all-caps labels, kickers or appended arrows", () => {
  assert.doesNotMatch(read("components/ui/CtaLink.tsx"), /ArrowRight|uppercase/);
  assert.match(read("components/ui/CtaLink.tsx"), /export function ctaClassName/);
  assert.doesNotMatch(read("components/ui/SectionHeading.tsx"), /kicker|Label/);
  assert.doesNotMatch(read("components/layout/PageHeader.tsx"), /kicker|Label/);
  assert.doesNotMatch(read("components/layout/Footer.tsx"), /className="label/);
  assert.match(read("components/layout/PageHeader.tsx"), /<h1/);
});
