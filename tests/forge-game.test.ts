import assert from "node:assert/strict";
import test from "node:test";
import {
  advance, COOLDOWN_MS, createGame, DURATION_MS, needleAt, rankFor, startGame, strike, zoneAt,
} from "../lib/forge-game.ts";

// needle reaches 0.5 at a quarter period: period(r) = 1600 * 0.86^r
const quarter = (r: number) => (1600 * Math.pow(0.86, r)) / 4;

test("zones narrow each round", () => {
  assert.equal(zoneAt(0.5, 0), "perfect");
  assert.equal(zoneAt(0.55, 0), "perfect");
  assert.equal(zoneAt(0.56, 0), "good");
  assert.equal(zoneAt(0.65, 0), "good");
  assert.equal(zoneAt(0.66, 0), "crack");
  assert.equal(zoneAt(0.53, 4), "good");
});

test("needle is a triangle wave starting cold", () => {
  const s = startGame();
  assert.equal(needleAt(s), 0);
  assert.ok(Math.abs(needleAt(advance(s, quarter(0))) - 0.5) < 1e-9);
  assert.ok(Math.abs(needleAt(advance(s, quarter(0) * 2)) - 1) < 1e-9);
});

test("perfect strike forges, scores 300 x combo, and advances", () => {
  let s = advance(startGame(), quarter(0));
  s = strike(s);
  assert.equal(s.lastZone, "perfect");
  assert.deepEqual(s.forged, ["WEB"]);
  assert.equal(s.combo, 1);
  assert.equal(s.score, 300);
  assert.equal(s.round, 1);
});

test("crack resets combo and repeats the round", () => {
  let s = startGame();
  s = strike(s); // needle at 0 → crack
  assert.equal(s.lastZone, "crack");
  assert.equal(s.combo, 0);
  assert.equal(s.round, 0);
  assert.deepEqual(s.forged, []);
});

test("strikes during cooldown are ignored", () => {
  let s = strike(startGame());
  const again = strike(advance(s, COOLDOWN_MS - 1));
  assert.equal(again.strikes, 1);
  s = advance(s, COOLDOWN_MS);
  assert.equal(s.phase, "playing");
});

test("five perfect strikes finish with combo scoring and a time bonus", () => {
  let s = startGame();
  for (let r = 0; r < 5; r += 1) {
    s = advance(s, COOLDOWN_MS * (r === 0 ? 0 : 1));
    s = advance(s, quarter(r));
    s = strike(s);
  }
  assert.equal(s.phase, "finished");
  assert.equal(s.forged.length, 5);
  assert.equal(s.bestCombo, 5);
  const base = 300 * (1 + 2 + 3 + 4 + 5);
  assert.equal(s.timeBonus, Math.floor((DURATION_MS - s.clockMs) / 1000) * 50);
  assert.equal(s.score, base + s.timeBonus);
});

test("timer ends the game without a bonus", () => {
  const s = advance(startGame(), DURATION_MS);
  assert.equal(s.phase, "finished");
  assert.equal(s.timeBonus, 0);
  assert.equal(s.remainingMs, 0);
});

test("idle and finished games ignore input and time", () => {
  const idle = createGame();
  assert.equal(strike(idle), idle);
  assert.equal(advance(idle, 1000), idle);
});

test("ranks", () => {
  assert.equal(rankFor(0), "Apprentice");
  assert.equal(rankFor(1200), "Smith");
  assert.equal(rankFor(2800), "Master Smith");
  assert.equal(rankFor(4500), "Forge Legend");
});
