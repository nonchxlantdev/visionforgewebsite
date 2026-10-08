import assert from "node:assert/strict";
import test from "node:test";
import {
  budgetFit,
  buildMessage,
  canSend,
  emailHref,
  EMPTY_STATE,
  suggestedTier,
  suggestion,
  toggleProblem,
  whatsappHref,
  type StartState,
} from "../lib/project-builder.ts";
import { isSafeNavigationHref } from "../lib/safe-href.ts";

const base: StartState = { problems: ["orders", "payments"], budget: "to8000" };

test("each problem points to a tier and the highest wins", () => {
  assert.equal(suggestedTier(["website"]), "found");
  assert.equal(suggestedTier(["orders"]), "automate");
  assert.equal(suggestedTier(["website", "bookings"]), "automate");
  assert.equal(suggestedTier(["forms", "accounts"]), "connect");
  assert.equal(suggestedTier(["reports"]), "connect");
  assert.equal(suggestedTier(["unsure"]), null);
  assert.equal(suggestedTier([]), null);
});

test("'Not sure yet' is exclusive and order is canonical", () => {
  assert.deepEqual(toggleProblem([], "payments"), ["payments"]);
  assert.deepEqual(toggleProblem(["payments"], "orders"), ["orders", "payments"]);
  assert.deepEqual(toggleProblem(["orders", "payments"], "orders"), ["payments"]);
  assert.deepEqual(toggleProblem(["orders"], "unsure"), ["unsure"]);
  assert.deepEqual(toggleProblem(["unsure"], "website"), ["website"]);
  assert.deepEqual(toggleProblem(["unsure"], "unsure"), []);
});

test("budget fit: fits, a smaller first step, or unknown", () => {
  assert.deepEqual(budgetFit("found", "under1500"), { kind: "fits" });
  assert.deepEqual(budgetFit("automate", "under1500"), { kind: "smaller", startTier: "found" });
  assert.deepEqual(budgetFit("automate", "to8000"), { kind: "fits" });
  assert.deepEqual(budgetFit("connect", "to8000"), { kind: "fits" });
  assert.deepEqual(budgetFit("connect", "under1500"), { kind: "smaller", startTier: "found" });
  assert.deepEqual(budgetFit("connect", "over8000"), { kind: "fits" });
  assert.deepEqual(budgetFit("connect", "unsure"), { kind: "unknown" });
  assert.deepEqual(budgetFit(null, "to8000"), { kind: "unknown" });
});

test("the suggestion card reads plainly in every state", () => {
  assert.deepEqual(suggestion(EMPTY_STATE), {
    tier: null,
    headline: "Pick what's slowing you down and we'll suggest where to start.",
    budgetLine: null,
  });
  assert.deepEqual(suggestion({ problems: ["unsure"], budget: "unsure" }), {
    tier: null,
    headline: "No problem. Send it over and we'll suggest the right first step.",
    budgetLine: null,
  });
  assert.deepEqual(suggestion(base), {
    tier: "automate",
    headline: "Sounds like an “Automate one task” project.",
    budgetLine: "Your budget fits this.",
  });
  assert.deepEqual(suggestion({ problems: ["accounts"], budget: "under1500" }), {
    tier: "connect",
    headline: "Sounds like a “Connect your business” project.",
    budgetLine: "Your budget fits a smaller first step. We'd start with “Get found” and add the rest later.",
  });
  assert.equal(suggestion({ problems: ["website"], budget: "unsure" }).budgetLine, null);
});

test("the message lists the problems and budget, capped at 500 characters", () => {
  assert.equal(
    buildMessage(base),
    "Hi Vision Forge, here's what's slowing my business down: typing up orders and chasing payments. Budget: BZ$1,500–8,000. Can we talk?",
  );
  assert.equal(
    buildMessage({ problems: ["unsure"], budget: "unsure" }),
    "Hi Vision Forge, something's slowing my business down but I'm not sure where to start. Budget: Not sure. Can we talk?",
  );
  const all: StartState = { problems: ["orders", "payments", "forms", "bookings", "reports", "accounts", "website"], budget: "over8000" };
  assert.ok(buildMessage(all).length <= 500);
  assert.equal(buildMessage(EMPTY_STATE), "");
});

test("send links are safe and only exist once something is picked", () => {
  assert.equal(canSend(EMPTY_STATE), false);
  assert.equal(canSend(base), true);
  const wa = whatsappHref(base)!;
  assert.ok(wa.startsWith("https://wa.me/5016157575?text="));
  assert.equal(isSafeNavigationHref(wa), true);
  assert.equal(new URL(wa).searchParams.get("text"), buildMessage(base));
  const mail = emailHref(base)!;
  assert.ok(mail.startsWith("mailto:sales@visionforgestudio.app?subject=Project%20enquiry&body="));
  assert.equal(isSafeNavigationHref(mail), true);
  assert.equal(whatsappHref(EMPTY_STATE), undefined);
  assert.equal(emailHref(EMPTY_STATE), undefined);
});
