import assert from "node:assert/strict";
import test from "node:test";
import { coolDown, heatColor, heatRgb, heatWeight, HALF_LIFE_MS } from "../lib/heat.ts";

test("heat colour hits each stop", () => {
  assert.deepEqual(heatRgb(0), [230, 228, 223]);
  assert.deepEqual(heatRgb(0.35), [255, 90, 31]);
  assert.deepEqual(heatRgb(0.7), [242, 179, 61]);
  assert.deepEqual(heatRgb(1), [255, 244, 214]);
  assert.equal(heatColor(1), "rgb(255 244 214)");
});

test("heat is clamped", () => {
  assert.deepEqual(heatRgb(-2), heatRgb(0));
  assert.deepEqual(heatRgb(9), heatRgb(1));
});

test("weight runs 400 to 900", () => {
  assert.equal(heatWeight(0), 400);
  assert.equal(heatWeight(1), 900);
  assert.equal(heatWeight(0.5), 650);
});

test("cooling halves every half-life and floors at zero", () => {
  assert.ok(Math.abs(coolDown(1, HALF_LIFE_MS) - 0.5) < 1e-9);
  assert.equal(coolDown(0.015, HALF_LIFE_MS), 0);
});
