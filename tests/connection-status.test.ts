import assert from "node:assert/strict";
import test from "node:test";
import { isOnline, seams, weld, weldStatus, WELD_PROMPT } from "../lib/connection-status.ts";

const nodes = [
  { id: "01", label: "YOUR BUSINESS" },
  { id: "02", label: "DIGITAL EXPERIENCE" },
  { id: "03", label: "APPLICATIONS" },
] as const;

test("the prompt tells people what to do", () => {
  assert.equal(WELD_PROMPT, "TAP THE PARTS TO WELD YOUR SYSTEM TOGETHER.");
});

test("welding adds a part once, in tap order", () => {
  assert.deepEqual(weld([], 2, 3), [2]);
  assert.deepEqual(weld([2], 0, 3), [2, 0]);
  assert.deepEqual(weld([2, 0], 0, 3), [2, 0]);
  assert.deepEqual(weld([2, 0], 7, 3), [2, 0]);
});

test("seams join each part to the one before, and close the loop when online", () => {
  assert.deepEqual(seams([], 3), []);
  assert.deepEqual(seams([1], 3), []);
  assert.deepEqual(seams([1, 0], 3), [[1, 0]]);
  assert.deepEqual(seams([1, 0, 2], 3), [[1, 0], [0, 2], [2, 1]]);
  assert.equal(isOnline([1, 0], 3), false);
  assert.equal(isOnline([1, 0, 2], 3), true);
});

test("status is empty until the first part is heated", () => {
  assert.equal(weldStatus([], nodes), "");
});

test("status follows the chain and announces when the system is online", () => {
  assert.equal(weldStatus([2], nodes), "03 · APPLICATIONS · HOT. TAP THE NEXT PART.");
  assert.equal(weldStatus([2, 0], nodes), "WELDED 2/3 · 01 · YOUR BUSINESS JOINED");
  assert.equal(weldStatus([2, 0, 1], nodes), "SYSTEM ONLINE · 3/3 WELDED");
});
