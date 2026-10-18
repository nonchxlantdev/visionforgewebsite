import assert from "node:assert/strict";
import test from "node:test";
import {
  about,
  afterLaunch,
  closing,
  featuredIndustries,
  home,
  howWeWorkSteps,
  improveExamples,
  lanes,
  lanesNote,
  moreIndustries,
  pains,
  primaryNav,
  questions,
  replyPromise,
  stages,
  whyUs,
} from "../lib/site.ts";

const allCopy = JSON.stringify({
  about,
  afterLaunch,
  closing,
  featuredIndustries,
  home,
  howWeWorkSteps,
  improveExamples,
  lanes,
  lanesNote,
  moreIndustries,
  pains,
  primaryNav,
  questions,
  replyPromise,
  stages,
  whyUs,
});

test("the hero leads with partnership and points to the form", () => {
  assert.equal(home.headline, "Your local tech partner. We bring business ideas to life.");
  assert.match(home.lede, /^A Belizean-owned team/);
  assert.equal(home.primary.href, "/get-started");
  assert.equal(home.primary.label, "Tell us about your business");
  assert.equal(home.secondary.href, "/how-we-work");
  assert.deepEqual([...home.trust], ["Belizean-owned", "Projects from BZ$500", "Free first conversation"]);
});

test("four pains, one of them not about technology", () => {
  assert.equal(pains.length, 4);
  assert.ok(pains.some((p) => /falling through the cracks/.test(p.quote)));
});

test("four stages in order; support is the only optional one", () => {
  assert.deepEqual(
    stages.map((s) => s.id),
    ["understand", "improve", "build", "support"],
  );
  assert.deepEqual(
    stages.map((s) => s.optional),
    [false, false, false, true],
  );
  for (const stage of stages) {
    assert.ok(stage.needIf.length >= 2 && stage.needIf.length <= 4, stage.id);
    assert.ok(stage.weDo.length >= 2, stage.id);
  }
  assert.equal(improveExamples.length, 5);
});

test("two lanes: small businesses from BZ$500, bigger work starts with a conversation", () => {
  assert.deepEqual(
    lanes.map((l) => [l.id, l.title, l.price]),
    [
      ["small", "Small businesses", "From BZ$500"],
      ["growing", "Growing teams and established companies", "Let's talk"],
    ],
  );
  assert.equal(lanesNote.href, "/disclaimer#estimates");
});

test("how we work: four steps, then optional training and support", () => {
  assert.equal(howWeWorkSteps.length, 4);
  assert.match(howWeWorkSteps[3].title, /hand it over/);
  assert.match(afterLaunch.title, /^Optional/);
});

test("training and support are offered, never assumed", () => {
  assert.match(whyUs[2].copy, /if you want|when you'd like|if you'd like/i);
  const afterLaunchQ = questions.find((q) => q.q === "What happens after launch?");
  assert.ok(afterLaunchQ);
  assert.match(afterLaunchQ.a, /if you'd like/i);
  for (const step of howWeWorkSteps) assert.doesNotMatch(step.title, /train|support/i);
});

test("copy never states team size, names or roles", () => {
  assert.doesNotMatch(
    allCopy,
    /\b(two|2|three|3)[- ](person|people|man)\b|\bfounders?\b|\bco-?founder\b|\bour (boss|partner|developer|salesperson)\b|\bShamira\b|\bGlenrick\b|\bNonchalant\b/i,
  );
});

test("no phone, WhatsApp link or support address in the new copy", () => {
  assert.doesNotMatch(allCopy, /wa\.me|tel:|\+501|615-?7575|613-?9219|support@/);
});

test("nav, reply promise and closing", () => {
  assert.deepEqual(
    primaryNav.map((n) => n.href),
    ["/services", "/how-we-work", "/about"],
  );
  assert.equal(replyPromise, "We'll reply within one business day to set up a free conversation.");
  assert.equal(closing.cta.href, "/get-started");
});

test("FAQ covers the agreed questions", () => {
  const qs: string[] = questions.map((q) => q.q);
  for (const q of [
    "Do I need to be tech-savvy?",
    "We're a small business. Is this for us?",
    "Who owns what you build?",
    "What happens after launch?",
    "How long does a project take?",
  ]) {
    assert.ok(qs.includes(q), q);
  }
});

test("industries: six featured, the rest named in a sentence", () => {
  assert.equal(featuredIndustries.length, 6);
  assert.ok(moreIndustries.length >= 8);
  for (const name of moreIndustries) assert.equal(name, name.toLowerCase(), name);
});

test("about says Belizean-owned without the registration number", () => {
  assert.match(about.owned, /Belizean-owned/);
  assert.match(about.owned, /registered in Belize/);
  assert.doesNotMatch(about.owned, /000058528|Reg\. No/);
  assert.equal(about.beliefs.length, 3);
});
