import assert from "node:assert/strict";
import test from "node:test";
import { DEMO_ORDER, DEMO_STEPS, MANUAL_MINUTES, minutesAfter, STEP_DELAY_MS } from "../lib/demo.ts";

test("four steps, each with a manual and an automated label", () => {
  assert.equal(DEMO_STEPS.length, 4);
  assert.deepEqual(
    DEMO_STEPS.map((s) => s.auto),
    ["Order saved to your sheet", "Invoice created", "Customer gets the total on WhatsApp", "Payment reminder sent on its own"],
  );
  assert.equal(DEMO_STEPS[0].manual, "Copy the order into a spreadsheet");
  assert.match(DEMO_ORDER, /WhatsApp|water/);
});

test("doing it by hand adds up to 12 minutes", () => {
  assert.equal(MANUAL_MINUTES, 12);
  assert.equal(minutesAfter("manual", 0), 0);
  assert.equal(minutesAfter("manual", 2), DEMO_STEPS[0].minutes + DEMO_STEPS[1].minutes);
  assert.equal(minutesAfter("manual", 4), 12);
});

test("automating counts down to zero minutes of your time", () => {
  assert.equal(minutesAfter("auto", 0), 12);
  assert.equal(minutesAfter("auto", 4), 0);
  assert.ok(minutesAfter("auto", 2) < 12);
});

test("out-of-range progress is clamped", () => {
  assert.equal(minutesAfter("manual", -3), 0);
  assert.equal(minutesAfter("manual", 99), 12);
  assert.equal(minutesAfter("auto", 99), 0);
});

test("automated replay takes about two seconds and is faster than manual", () => {
  assert.ok(STEP_DELAY_MS.auto * DEMO_STEPS.length <= 2000);
  assert.ok(STEP_DELAY_MS.manual > STEP_DELAY_MS.auto * 2);
});
