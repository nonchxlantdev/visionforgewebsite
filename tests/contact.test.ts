import assert from "node:assert/strict";
import test from "node:test";
import {
  buildEnquiryEmail,
  CONTACT_FIELDS,
  handleContact,
  HONEYPOT_FIELD,
  isLikelyBot,
  LANE_OPTIONS,
  SALES_INBOX,
  validateContact,
  type OutgoingEmail,
} from "../lib/contact.ts";

const good = {
  name: "  Maria Chan ",
  business: "Chan's Hardware",
  email: "Maria@ChansHardware.BZ",
  whatTheyDo: "Hardware store in Belmopan",
  slowingDown: "We take orders on WhatsApp\r\nand copy them into a sheet every night.",
  lane: "small",
  token: "tok",
};

test("fields and lanes match the spec", () => {
  assert.deepEqual([...CONTACT_FIELDS], ["name", "business", "email", "whatTheyDo", "slowingDown", "lane"]);
  assert.deepEqual(
    LANE_OPTIONS.map((o) => o.label),
    ["Small business", "Growing team or established company", "Not sure yet"],
  );
  assert.equal(SALES_INBOX, "sales@visionforgestudio.app");
});

test("valid input is trimmed, email lowercased, newlines normalised", () => {
  const result = validateContact(good);
  assert.ok(result.ok);
  assert.equal(result.data.name, "Maria Chan");
  assert.equal(result.data.email, "maria@chanshardware.bz");
  assert.equal(result.data.slowingDown, "We take orders on WhatsApp\nand copy them into a sheet every night.");
  assert.equal(result.data.lane, "small");
});

test("every missing field gets its own plain message", () => {
  const result = validateContact({});
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.deepEqual(result.errors, {
    name: "Enter your name.",
    business: "Enter your business name.",
    email: "Enter your email so we can reply.",
    whatTheyDo: "Tell us what your business does.",
    slowingDown: "Tell us what's slowing you down.",
    lane: "Choose the option that fits you best.",
  });
});

test("bad email, unknown lane and over-long text are rejected", () => {
  const result = validateContact({ ...good, email: "maria@", lane: "enterprise", whatTheyDo: "x".repeat(301) });
  assert.equal(result.ok, false);
  if (result.ok) return;
  assert.equal(result.errors.email, "Enter a valid email address, like name@business.com.");
  assert.equal(result.errors.lane, "Choose the option that fits you best.");
  assert.equal(result.errors.whatTheyDo, "Keep this under 300 characters.");
});

test("single-line fields can't smuggle line breaks or control characters", () => {
  const result = validateContact({ ...good, business: "Chan's\r\nBcc: x@y.z\u0007" });
  assert.ok(result.ok);
  assert.equal(result.data.business, "Chan's Bcc: x@y.z");
});

test("non-string and non-object input is handled", () => {
  assert.equal(validateContact(null).ok, false);
  assert.equal(validateContact("hello").ok, false);
  assert.equal(validateContact({ ...good, name: 42 }).ok, false);
});

test("the honeypot flags bots", () => {
  assert.equal(isLikelyBot(good), false);
  assert.equal(isLikelyBot({ ...good, [HONEYPOT_FIELD]: "http://spam.example" }), true);
  assert.equal(isLikelyBot({ ...good, [HONEYPOT_FIELD]: "   " }), false);
  assert.equal(isLikelyBot(null), false);
});

test("the enquiry email goes to sales with reply-to set to the visitor", () => {
  const result = validateContact(good);
  assert.ok(result.ok);
  const email = buildEnquiryEmail(result.data);
  assert.equal(email.to, "sales@visionforgestudio.app");
  assert.equal(email.replyTo, "maria@chanshardware.bz");
  assert.equal(email.subject, "New enquiry from Chan's Hardware");
  assert.match(email.text, /Which fits best: Small business/);
  assert.match(email.text, /What's slowing them down:\nWe take orders/);
});

function deps(overrides: Partial<{ verify: boolean; send: boolean | "throw" }> = {}) {
  const sent: OutgoingEmail[] = [];
  return {
    sent,
    deps: {
      verifyToken: async () => overrides.verify ?? true,
      send: async (email: OutgoingEmail) => {
        if (overrides.send === "throw") throw new Error("network");
        sent.push(email);
        return overrides.send ?? true;
      },
    },
  };
}

test("handler: success sends one email", async () => {
  const d = deps();
  assert.deepEqual(await handleContact(good, d.deps), { status: 200, body: { ok: true } });
  assert.equal(d.sent.length, 1);
});

test("handler: bots get a quiet success and nothing is sent", async () => {
  const d = deps();
  assert.deepEqual(await handleContact({ ...good, website: "spam" }, d.deps), { status: 200, body: { ok: true } });
  assert.equal(d.sent.length, 0);
});

test("handler: invalid input returns field errors", async () => {
  const d = deps();
  const result = await handleContact({ ...good, email: "" }, d.deps);
  assert.equal(result.status, 400);
  assert.deepEqual(result.body, { ok: false, reason: "invalid", errors: { email: "Enter your email so we can reply." } });
  assert.equal(d.sent.length, 0);
});

test("handler: missing or rejected verification token returns 403", async () => {
  assert.equal((await handleContact({ ...good, token: "" }, deps().deps)).status, 403);
  const rejected = await handleContact(good, deps({ verify: false }).deps);
  assert.deepEqual(rejected, { status: 403, body: { ok: false, reason: "verification" } });
});

test("handler: a failed or crashing send returns 502", async () => {
  assert.deepEqual(await handleContact(good, deps({ send: false }).deps), { status: 502, body: { ok: false, reason: "failed" } });
  assert.deepEqual(await handleContact(good, deps({ send: "throw" }).deps), { status: 502, body: { ok: false, reason: "failed" } });
});
