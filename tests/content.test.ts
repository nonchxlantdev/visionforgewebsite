import assert from "node:assert/strict";
import test from "node:test";
import {
  about,
  afterLaunch,
  closing,
  featuredIndustries,
  home,
  audiences,
  additionalServices,
  automationExamples,
  howWeWorkSteps,
  keyMessage,
  lanes,
  lanesNote,
  moreIndustries,
  pains,
  primaryNav,
  questions,
  replyPromise,
  services,
  whyUs,
  workflowExamples,
  workflowNote,
} from "../lib/site.ts";

const allCopy = JSON.stringify({
  about,
  afterLaunch,
  closing,
  featuredIndustries,
  home,
  audiences,
  additionalServices,
  automationExamples,
  howWeWorkSteps,
  keyMessage,
  lanes,
  lanesNote,
  moreIndustries,
  pains,
  primaryNav,
  questions,
  replyPromise,
  services,
  whyUs,
  workflowExamples,
  workflowNote,
});

test("the hero leads with automation and integration and keeps the headline and CTAs", () => {
  assert.deepEqual([...home.eyebrow], ["Business automation", "Systems integration", "Digital solutions"]);
  assert.equal(home.headline, "We turn ideas into technology that moves business forward.");
  assert.equal(home.lede, "Automate the work. Connect your systems. Unlock your potential.");
  assert.match(home.detail, /^We help businesses eliminate manual processes/);
  assert.match(home.detailMore, /AI-powered solutions/);
  for (const capability of home.capabilities) assert.ok(home.detail.includes(capability), capability);
  assert.equal(home.primary.href, "/get-started");
  assert.equal(home.primary.label, "Tell us about your business");
  assert.equal(home.secondary.label, "See how we work");
  assert.equal(home.secondary.href, "/how-we-work");
  assert.deepEqual([...home.trust], ["Belizean-owned", "Projects from BZ$500", "Free first conversation"]);
  assert.equal(keyMessage, "Vision Forge helps businesses automate the work, connect their systems, and build technology that works for them.");
});

test("problems we solve: the six pain points from the brief", () => {
  assert.deepEqual(
    pains.map((p) => p.id),
    ["repetitive", "disconnected", "duplicate", "approvals", "reports", "followups"],
  );
});

test("core services in the agreed order, then consultation and optional support", () => {
  assert.deepEqual(
    services.map((s) => s.id),
    ["automation", "integration", "ai", "build", "consult", "support"],
  );
  assert.deepEqual(
    services.map((s) => s.core),
    [true, true, true, true, false, false],
  );
  assert.deepEqual(
    services.map((s) => s.optional),
    [false, false, false, false, false, true],
  );
  for (const service of services) {
    assert.ok(service.needIf.length >= 2 && service.needIf.length <= 4, service.id);
    assert.ok(service.weDo.length >= 2, service.id);
  }
  assert.equal(automationExamples.length, 5);
});

test("workflow examples are framed as what we can build, not out-of-the-box", () => {
  assert.deepEqual(
    workflowExamples.map((w) => w.id),
    ["sales", "payments", "operations", "service"],
  );
  for (const w of workflowExamples) assert.ok(w.steps.length >= 3, w.id);
  assert.match(workflowNote, /not ready-made/);
  assert.match(workflowNote, /discovery/);
  assert.doesNotMatch(allCopy, /seamless|everything connected|out of the box|works with any system|connects? to anything/i);
});

test("who we help and additional services", () => {
  assert.deepEqual(
    audiences.map((a) => a.id),
    ["small", "growing", "established"],
  );
  assert.ok(additionalServices.some((s) => /websites/i.test(s)));
});

test("two lanes: smaller projects from BZ$500, complex work starts with a consultation", () => {
  assert.deepEqual(
    lanes.map((l) => [l.id, l.price]),
    [
      ["small", "From BZ$500"],
      ["growing", "Let's talk"],
    ],
  );
  assert.match(lanes[1].copy, /consultation/);
  assert.equal(lanesNote.href, "/disclaimer#estimates");
});

test("how we work: the seven steps from the brief, then optional training and support", () => {
  assert.deepEqual(
    howWeWorkSteps.map((s) => s.title),
    ["Discover", "Map the workflow", "Design the solution", "Integrate and automate", "Test", "Deploy", "Improve"],
  );
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
    "Can you connect any system?",
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
