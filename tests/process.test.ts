import assert from "node:assert/strict";
import test from "node:test";
import { HUB_TOOLS } from "../lib/hub.ts";
import { PROCESS_STEP_COUNT, clampStep, flowPairs, processScene } from "../lib/process.ts";

const scenes = Array.from({ length: PROCESS_STEP_COUNT }, (_, i) => processScene(i, HUB_TOOLS));

test("one picture per step, each with every hub tool in order", () => {
  assert.equal(PROCESS_STEP_COUNT, 7);
  for (const [i, scene] of scenes.entries()) {
    assert.equal(scene.step, i);
    assert.deepEqual(
      scene.tiles.map((t) => t.id),
      HUB_TOOLS.map((t) => t.id),
    );
    assert.deepEqual(
      scene.tiles.map((t) => t.label),
      HUB_TOOLS.map((t) => t.label),
    );
  }
});

const narrow = Array.from({ length: PROCESS_STEP_COUNT }, (_, i) => processScene(i, HUB_TOOLS, "narrow"));

test("tiles stay inside the panel, wide and narrow", () => {
  for (const scene of [...scenes, ...narrow]) {
    for (const t of scene.tiles) {
      assert.ok(t.x >= 8 && t.x <= 92, `${scene.step} ${t.id} x=${t.x}`);
      assert.ok(t.y >= 8 && t.y <= 92, `${scene.step} ${t.id} y=${t.y}`);
    }
  }
});

test("1 Discover: scattered and tilted, no hub, a chat icon", () => {
  const s = scenes[0];
  assert.equal(s.hub, "none");
  assert.equal(s.lines, "none");
  assert.equal(s.icon, "chat");
  assert.ok(s.tiles.some((t) => t.rotate !== 0));
});

test("2 Map: dashed flows, and only the bottleneck tools are flagged", () => {
  assert.equal(scenes[1].lines, "flow");
  assert.equal(scenes[1].hub, "none");
  assert.deepEqual(
    scenes[1].tiles.filter((t) => t.flagged).map((t) => t.id),
    HUB_TOOLS.filter((t) => t.bottleneck).map((t) => t.id),
  );
  for (const [i, scene] of scenes.entries()) {
    if (i !== 1) assert.ok(scene.tiles.every((t) => !t.flagged), `step ${i}`);
  }
});

test("3 Design: a blueprint with an outlined hub and the plan icon", () => {
  const s = scenes[2];
  assert.equal(s.blueprint, true);
  assert.equal(s.hub, "outline");
  assert.equal(s.icon, "plan");
  assert.ok(scenes.every((scene, i) => scene.blueprint === (i === 2)));
});

test("4 onward: solid hub, every tool connected; the hub area stays clear", () => {
  for (const scene of scenes.slice(3)) {
    assert.equal(scene.hub, "solid");
    assert.equal(scene.lines, "connected");
  }
  for (const scene of [...scenes.slice(2), ...narrow.slice(2)]) {
    for (const t of scene.tiles) assert.ok(Math.abs(t.x - 50) > 20 || Math.abs(t.y - 50) > 20, `${scene.step} ${t.id}`);
  }
});

test("5 Test adds checks, 6 Deploy goes live, 7 Improve adds the chart and loop", () => {
  scenes.forEach((s, i) => {
    assert.equal(s.tiles.every((t) => t.checked), i >= 4, `checks at ${i}`);
    assert.equal(s.tiles.some((t) => t.checked), i >= 4, `checks at ${i}`);
    assert.equal(s.live, i >= 5, `live at ${i}`);
    assert.equal(s.chart, i === 6, `chart at ${i}`);
  });
  assert.equal(scenes[6].icon, "loop");
  assert.equal(scenes[3].icon, null);
});

test("out-of-range steps clamp", () => {
  assert.equal(clampStep(-3), 0);
  assert.equal(clampStep(99), 6);
  assert.equal(clampStep(Number.NaN), 0);
  assert.equal(clampStep(2.7), 2);
  assert.deepEqual(processScene(42, HUB_TOOLS), scenes[6]);
});

test("narrow pictures tell the same story in two columns", () => {
  for (const [i, n] of narrow.entries()) {
    const { tiles: wt, ...wideRest } = scenes[i];
    const { tiles: nt, ...narrowRest } = n;
    assert.deepEqual(narrowRest, wideRest, `step ${i}`);
    const meaning = (t: (typeof nt)[number]) => ({ id: t.id, label: t.label, flagged: t.flagged, checked: t.checked });
    assert.deepEqual(nt.map(meaning), wt.map(meaning));
  }
  for (const n of narrow.slice(1)) assert.equal(new Set(n.tiles.map((t) => t.x)).size, 2, "two columns");
});

test("flow lines only join real tiles", () => {
  for (const shape of ["wide", "narrow"] as const) {
    for (const [a, b] of flowPairs(shape)) {
      assert.ok(a >= 0 && a < HUB_TOOLS.length && b >= 0 && b < HUB_TOOLS.length && a !== b);
    }
  }
});
