import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { FROM_ADDRESS, RESEND_URL, sendWithResend, TURNSTILE_VERIFY_URL, verifyTurnstile } from "../lib/contact-delivery.ts";

type Call = { url: string; init: RequestInit };

function fakeFetch(status: number, json: unknown) {
  const calls: Call[] = [];
  const impl = async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    return new Response(JSON.stringify(json), { status, headers: { "Content-Type": "application/json" } });
  };
  return { calls, impl };
}

const email = { to: "sales@visionforgestudio.app", replyTo: "maria@example.bz", subject: "New enquiry from Chan's", text: "hi" };

test("turnstile: posts token, secret and ip, and trusts only success === true", async () => {
  const ok = fakeFetch(200, { success: true });
  assert.equal(await verifyTurnstile("tok", "sec", "1.2.3.4", ok.impl), true);
  assert.equal(ok.calls[0].url, TURNSTILE_VERIFY_URL);
  const body = new URLSearchParams(String(ok.calls[0].init.body));
  assert.equal(body.get("secret"), "sec");
  assert.equal(body.get("response"), "tok");
  assert.equal(body.get("remoteip"), "1.2.3.4");

  assert.equal(await verifyTurnstile("tok", "sec", undefined, fakeFetch(200, { success: false }).impl), false);
  assert.equal(await verifyTurnstile("tok", "sec", undefined, fakeFetch(200, { success: "true" }).impl), false);
  assert.equal(await verifyTurnstile("tok", "sec", undefined, fakeFetch(500, {}).impl), false);
});

test("turnstile: no secret configured means no pass, and no network call", async () => {
  const f = fakeFetch(200, { success: true });
  assert.equal(await verifyTurnstile("tok", undefined, undefined, f.impl), false);
  assert.equal(f.calls.length, 0);
});

test("resend: sends from the website address to sales with reply-to", async () => {
  const f = fakeFetch(200, { id: "abc" });
  assert.equal(await sendWithResend(email, "re_key", f.impl), true);
  assert.equal(f.calls[0].url, RESEND_URL);
  const headers = new Headers(f.calls[0].init.headers);
  assert.equal(headers.get("Authorization"), "Bearer re_key");
  assert.deepEqual(JSON.parse(String(f.calls[0].init.body)), {
    from: FROM_ADDRESS,
    to: ["sales@visionforgestudio.app"],
    reply_to: "maria@example.bz",
    subject: "New enquiry from Chan's",
    text: "hi",
  });
  assert.equal(FROM_ADDRESS, "Vision Forge Studio website <website@visionforgestudio.app>");
});

test("resend: missing key or error status is a failed send", async () => {
  const f = fakeFetch(200, {});
  assert.equal(await sendWithResend(email, undefined, f.impl), false);
  assert.equal(f.calls.length, 0);
  assert.equal(await sendWithResend(email, "re_key", fakeFetch(422, {}).impl), false);
});

test("the route reads secrets from the Cloudflare context and caps the body size", () => {
  const route = readFileSync(new URL("../app/api/contact/route.ts", import.meta.url), "utf8");
  assert.match(route, /export async function POST/);
  assert.match(route, /getCloudflareContext\(\)/);
  assert.match(route, /RESEND_API_KEY/);
  assert.match(route, /TURNSTILE_SECRET_KEY/);
  assert.match(route, /MAX_BODY_BYTES/);
  assert.match(route, /"Cache-Control": "no-store"/);
});
