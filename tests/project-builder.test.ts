import assert from "node:assert/strict";
import test from "node:test";
import {
  budgetFit,
  buildMessage,
  cardMessage,
  emailHref,
  isComplete,
  projectTier,
  summarize,
  toggleNeed,
  whatsappHref,
  type BuilderState,
} from "../lib/project-builder.ts";
import { isSafeNavigationHref } from "../lib/safe-href.ts";

const base: BuilderState = { business: "health", needs: ["website", "bookings"], budget: "to2500", timing: "soon" };

test("each need maps to a tier and the project takes the highest", () => {
  assert.equal(projectTier(["website"]), "launch");
  assert.equal(projectTier(["orders"]), "grow");
  assert.equal(projectTier(["bookings", "website"]), "grow");
  assert.equal(projectTier(["website", "reports"]), "custom");
  assert.equal(projectTier(["integrations"]), "custom");
  assert.equal(projectTier(["unsure"]), null);
  assert.equal(projectTier([]), null);
});

test("budget fit: fits, phase-one with a starting tier, or unknown", () => {
  assert.deepEqual(budgetFit("launch", "under1k"), { kind: "fits" });
  assert.deepEqual(budgetFit("grow", "to2500"), { kind: "fits" }); // ceiling equals the starting price
  assert.deepEqual(budgetFit("grow", "under1k"), { kind: "phase-one", startTier: "launch" });
  assert.deepEqual(budgetFit("custom", "to2500"), { kind: "phase-one", startTier: "grow" });
  assert.deepEqual(budgetFit("custom", "to8000"), { kind: "fits" });
  assert.deepEqual(budgetFit("custom", "over8000"), { kind: "fits" });
  assert.deepEqual(budgetFit("custom", "unsure"), { kind: "unknown" });
  assert.deepEqual(budgetFit(null, "to2500"), { kind: "unknown" });
});

test("'not sure' is exclusive with the other needs", () => {
  assert.deepEqual(toggleNeed([], "website"), ["website"]);
  assert.deepEqual(toggleNeed(["website"], "bookings"), ["website", "bookings"]);
  assert.deepEqual(toggleNeed(["bookings", "website"], "website"), ["bookings"]);
  assert.deepEqual(toggleNeed(["website", "bookings"], "unsure"), ["unsure"]);
  assert.deepEqual(toggleNeed(["unsure"], "orders"), ["orders"]);
  assert.deepEqual(toggleNeed(["unsure"], "unsure"), []);
  // keeps the canonical order regardless of tap order
  assert.deepEqual(toggleNeed(["reports"], "website"), ["website", "reports"]);
});

test("summary reads as a plain sentence", () => {
  assert.equal(summarize({ ...base, needs: ["website"] }), "A website for your clinic or salon.");
  assert.equal(summarize(base), "A website and online bookings for your clinic or salon.");
  assert.equal(
    summarize({ ...base, business: "company", needs: ["forms", "reports", "integrations"] }),
    "Digital forms to replace paper, automatic reports and dashboards and connections between your systems for your organisation.",
  );
  assert.equal(summarize({ ...base, needs: ["unsure"] }), "Help choosing the right tools for your clinic or salon.");
  assert.equal(summarize({ ...base, business: null }), null);
  assert.equal(summarize({ ...base, needs: [] }), null);
});

test("completeness needs a business and at least one need", () => {
  assert.equal(isComplete(base), true);
  assert.equal(isComplete({ ...base, business: null }), false);
  assert.equal(isComplete({ ...base, needs: [] }), false);
});

test("card message explains price and budget fit", () => {
  assert.equal(
    cardMessage(base),
    "Your budget fits this. Typical Grow projects start from BZ$2,500 and take 4–8 weeks.",
  );
  assert.equal(
    cardMessage({ ...base, budget: "under1k" }),
    "Your budget fits a smaller first version. We'd start with a Launch project (from BZ$500) and add the rest in a second phase.",
  );
  assert.equal(cardMessage({ ...base, budget: "unsure" }), "Grow projects start from BZ$2,500 and usually take 4–8 weeks.");
  assert.equal(
    cardMessage({ ...base, needs: ["unsure"] }),
    "Tell us a bit about your business and we'll suggest the right starting point.",
  );
});

test("the message names the business, needs, budget and timing", () => {
  assert.equal(
    buildMessage(base),
    "Hi Vision Forge! I run a clinic or salon and I'm interested in a website and online bookings. Budget: BZ$1,000–2,500. Timing: Within 1–3 months. Can we talk?",
  );
  assert.match(buildMessage({ ...base, business: "company" }), /I run an organisation/);
  assert.match(buildMessage({ ...base, needs: ["unsure"] }), /interested in help choosing the right tools\./);
  const huge: BuilderState = { ...base, needs: ["website", "orders", "bookings", "staffApp", "forms", "reports", "integrations"] };
  assert.ok(buildMessage(huge).length <= 500);
});

test("whatsapp and email links are safe and carry the message", () => {
  const wa = whatsappHref(base);
  assert.ok(wa);
  assert.ok(wa.startsWith("https://wa.me/5016157575?text="));
  assert.equal(isSafeNavigationHref(wa), true);
  assert.equal(new URL(wa).searchParams.get("text"), buildMessage(base));

  const mail = emailHref(base);
  assert.ok(mail);
  assert.ok(mail.startsWith("mailto:sales@visionforgestudio.app?subject=Project%20enquiry&body="));
  assert.equal(isSafeNavigationHref(mail), true);
  assert.equal(decodeURIComponent(mail.split("&body=")[1]), buildMessage(base));

  assert.equal(whatsappHref({ ...base, business: null }), undefined);
  assert.equal(emailHref({ ...base, needs: [] }), undefined);
});
