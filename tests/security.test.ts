import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import test from "node:test";
import { isSafeNavigationHref, mailtoHref } from "../lib/safe-href.ts";
import { contentSecurityPolicy, securityHeaders } from "../lib/security-headers.ts";
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

test("production CSP stays restrictive", () => {
  const policy = contentSecurityPolicy(true);
  assert.match(policy, /default-src 'self'/);
  assert.match(policy, /object-src 'none'/);
  assert.match(policy, /base-uri 'self'/);
  assert.match(policy, /form-action 'self'/);
  assert.match(policy, /frame-ancestors 'none'/);
  assert.match(policy, /frame-src 'none'/);
  assert.match(policy, /upgrade-insecure-requests/);
  assert.doesNotMatch(policy, /unsafe-eval/);
  assert.doesNotMatch(policy, /script-src [^;]*\*/);
  assert.doesNotMatch(policy, /connect-src [^;]*\*/);
  assert.match(policy, /connect-src 'self'/);
  assert.match(policy, /font-src 'self'/);
});

test("development CSP allows the local dev server and omits HSTS", () => {
  const policy = contentSecurityPolicy(false);
  assert.match(policy, /unsafe-eval/);
  assert.match(policy, /ws:\/\/localhost:\*/);
  assert.doesNotMatch(policy, /upgrade-insecure-requests/);

  const names = securityHeaders(false).map((header) => header.key);
  assert.equal(names.includes("Strict-Transport-Security"), false);
  assert.equal(names.includes("Content-Security-Policy"), true);
  assert.equal(names.includes("X-Frame-Options"), true);
  assert.equal(names.includes("Access-Control-Allow-Origin"), false);
});

test("production headers cover transport, framing, sniffing, referrer, and permissions", () => {
  const headers = Object.fromEntries(securityHeaders(true).map((header) => [header.key, header.value]));
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.equal(headers["X-Frame-Options"], "DENY");
  assert.equal(headers["Referrer-Policy"], "strict-origin-when-cross-origin");
  assert.equal(headers["Cross-Origin-Opener-Policy"], "same-origin");
  assert.match(headers["Strict-Transport-Security"], /max-age=31536000/);
  assert.match(headers["Permissions-Policy"], /camera=\(\)/);
  assert.match(headers["Permissions-Policy"], /microphone=\(\)/);
  assert.match(headers["Permissions-Policy"], /geolocation=\(\)/);
});

test("published contact targets are the only external navigations", () => {
  assert.equal(isSafeNavigationHref(site.whatsapp.href), true);
  assert.equal(isSafeNavigationHref(site.phone.href), true);
  assert.equal(isSafeNavigationHref(site.sales.href), true);
  assert.equal(isSafeNavigationHref(site.support.href), true);
  assert.equal(isSafeNavigationHref(site.projectMailto), true);
  assert.equal(isSafeNavigationHref(site.url), true);
  assert.equal(isSafeNavigationHref("/terms"), true);
  assert.equal(isSafeNavigationHref("/#contact"), true);
  assert.equal(isSafeNavigationHref("#forge"), true);

  assert.equal(isSafeNavigationHref("javascript:alert(1)"), false);
  assert.equal(isSafeNavigationHref("http://visionforgestudio.app"), false);
  assert.equal(isSafeNavigationHref("https://evil.example"), false);
  assert.equal(isSafeNavigationHref("https://wa.me/19999999999"), false);
  assert.equal(isSafeNavigationHref("//evil.example"), false);
  assert.equal(isSafeNavigationHref("mailto:sales@visionforgestudio.app\r\nBcc:attacker@example.com"), false);
});

test("mailto helper rejects header injection and non-addresses", () => {
  assert.equal(mailtoHref("sales@visionforgestudio.app"), "mailto:sales@visionforgestudio.app");
  assert.equal(
    mailtoHref("sales@visionforgestudio.app", "New project enquiry"),
    "mailto:sales@visionforgestudio.app?subject=New%20project%20enquiry",
  );
  assert.equal(mailtoHref("not an email"), undefined);
  assert.equal(mailtoHref("sales@visionforgestudio.app", "hello\r\nBcc:a@b.c"), undefined);
});

test("every target=_blank anchor sets noopener and noreferrer", () => {
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(/target="_blank"/g)) {
      const window = text.slice(Math.max(0, match.index - 180), match.index + 180);
      assert.match(window, /rel="noopener noreferrer"/, file.pathname);
    }
  }
});

test("application source does not reference private environment variables", () => {
  for (const file of files) {
    const text = readFileSync(file, "utf8");
    assert.doesNotMatch(text, /NEXT_PUBLIC_/);
    assert.doesNotMatch(text, /process\.env/);
    assert.doesNotMatch(text, /-----BEGIN [A-Z ]*PRIVATE KEY-----/);
  }
});

test("wa.me links may carry only a short prefilled text", () => {
  const ok = `https://wa.me/5016157575?text=${encodeURIComponent("Hi Vision Forge! I run a shop.")}`;
  assert.equal(isSafeNavigationHref(ok), true);
  assert.equal(isSafeNavigationHref("https://wa.me/5016157575?text=hi&phone=19999999999"), false);
  assert.equal(isSafeNavigationHref("https://wa.me/5016157575?other=hi"), false);
  assert.equal(isSafeNavigationHref("https://wa.me/5016157575?text=hi#x"), false);
  assert.equal(isSafeNavigationHref(`https://wa.me/5016157575?text=${"a".repeat(501)}`), false);
  assert.equal(isSafeNavigationHref("https://wa.me/19999999999?text=hi"), false);
});

test("mailto body is encoded, length-capped and rejects header injection", () => {
  const href = mailtoHref("sales@visionforgestudio.app", "Project enquiry", "Hi Vision Forge! (shop) budget: BZ$500");
  assert.ok(href);
  assert.equal(isSafeNavigationHref(href), true);
  assert.equal(decodeURIComponent(href.split("&body=")[1]), "Hi Vision Forge! (shop) budget: BZ$500");
  assert.equal(mailtoHref("sales@visionforgestudio.app", "Project enquiry", "hi\r\nBcc:a@b.c"), undefined);
  assert.equal(mailtoHref("sales@visionforgestudio.app", "Project enquiry", "a".repeat(501)), undefined);
});
