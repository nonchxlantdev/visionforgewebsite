import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import { CONNECTED_MS, cameraDistance, DISCONNECTED_MS, HUB_BODY_Y, HUB_CABLE_Y, HUB_TOOLS, hubCableEnd, hubPhase, tileLayout } from "../lib/hub.ts";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

test("eight familiar tools, three of them marked as bottlenecks", () => {
  assert.deepEqual(
    HUB_TOOLS.map((t) => t.label),
    ["WhatsApp", "Spreadsheets", "Paper forms", "Bookings", "Accounting", "Website", "Payments", "Reports"],
  );
  assert.deepEqual(
    HUB_TOOLS.filter((t) => t.bottleneck).map((t) => t.id),
    ["forms", "accounting", "reports"],
  );
});

test("the loop starts disconnected, then connects, then repeats", () => {
  assert.deepEqual(hubPhase(0), { connected: false, progress: 0 });
  assert.equal(hubPhase(DISCONNECTED_MS - 1).connected, false);
  assert.equal(hubPhase(DISCONNECTED_MS).connected, true);
  assert.equal(hubPhase(DISCONNECTED_MS + CONNECTED_MS - 1).connected, true);
  assert.equal(hubPhase(DISCONNECTED_MS + CONNECTED_MS).connected, false);
  const mid = hubPhase(DISCONNECTED_MS / 2).progress;
  assert.ok(mid > 0.49 && mid < 0.51, String(mid));
  assert.deepEqual(hubPhase(-50), { connected: false, progress: 0 });
});

test("tiles sit on an ellipse around the hub, clear of it, left and right balanced", () => {
  const spots = tileLayout(8);
  assert.equal(spots.length, 8);
  for (const [x, z] of spots) assert.ok(Math.hypot(x, z) > 2.6, `${x},${z} too close to the hub`);
  const left = spots.filter(([x]) => x < 0).length;
  assert.equal(left, 4);
});

test("on portrait screens the tiles sit above and below the hub instead", () => {
  const spots = tileLayout(8, true);
  assert.equal(spots.length, 8);
  for (const [x, z] of spots) assert.ok(Math.hypot(x, z) > 2.6, `${x},${z} too close to the hub`);
  assert.equal(spots.filter(([, z]) => z < 0).length, 4);
  const widest = Math.max(...spots.map(([x]) => Math.abs(x)));
  const deepest = Math.max(...spots.map(([, z]) => Math.abs(z)));
  assert.ok(deepest > widest, "portrait layout should be taller than it is wide");
});

test("every cable runs under the hub block so the box sits in front of it", () => {
  const blockBottom = HUB_BODY_Y - 0.45;
  assert.ok(blockBottom > HUB_CABLE_Y + 0.05, "the block should clear the cable");
  for (const [x, z] of [...tileLayout(8), ...tileLayout(8, true)]) {
    const end = hubCableEnd(x, z);
    assert.ok(Math.hypot(end.x, end.z) < 0.4, `${end.x},${end.z} should end under the block`);
    assert.equal(end.y, HUB_CABLE_Y);
    const toward = end.x * x + end.z * z;
    assert.ok(toward > 0, "the contact should stay on the tile's side");
  }
});

test("narrow screens pull the camera back so every tile stays in view", () => {
  assert.ok(cameraDistance(0.7) > cameraDistance(1.8));
  assert.ok(cameraDistance(1.8) >= 11);
  assert.equal(cameraDistance(3), cameraDistance(2.4));
});

test("the 3D scene uses the real logo, loads three.js lazily and cleans up", () => {
  const src = read("components/sections/HubScene.tsx");
  assert.match(src, /^"use client";/);
  assert.match(src, /import\("three"\)/);
  assert.doesNotMatch(src, /^import \* as THREE from "three"/m);
  assert.match(src, /\/brand\/vision-forge-logo-512\.webp/);
  assert.match(src, /IntersectionObserver/);
  assert.match(src, /dispose\(\)/);
  assert.match(src, /forceContextLoss/);
  assert.ok(existsSync(new URL("public/brand/vision-forge-logo-512.webp", root)));
});

test("the scene is accessible: described, pausable, announced, and still for reduced motion", () => {
  const src = read("components/sections/HubScene.tsx");
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.match(src, /aria-live="polite"/);
  assert.match(src, /Pause animation/);
  assert.match(src, /Play animation/);
  assert.match(src, /className="sr-only"/);
  assert.match(src, /<canvas[^>]*aria-hidden/);
});

test("without WebGL the hero still shows the hub and the tools", () => {
  const src = read("components/sections/HubScene.tsx");
  assert.match(src, /fallback/);
  assert.match(src, /HUB_TOOLS\.map/);
});

test("every tool gets a status light that turns green once connected", () => {
  const src = read("components/sections/HubScene.tsx");
  assert.doesNotMatch(src, /if \(tool\.bottleneck\)/);
  assert.match(src, /hubCableEnd\(/);
  assert.match(src, /lerpColors\(coral, green, mix\)/);
  assert.doesNotMatch(src, /tool\.bottleneck \? COLORS\.coral/);
  assert.doesNotMatch(src, /opacity = t\.bottleneck/);
});

test("pulse positions are clamped so float error never runs off the end of a cable", () => {
  const src = read("components/sections/HubScene.tsx");
  assert.match(src, /getPointAt\(clamp\(/);
  assert.doesNotMatch(src, /getPointAt\(u\)/);
});

test("uses a shadow mode this three.js supports, and skips noisy shader logging", () => {
  const src = read("components/sections/HubScene.tsx");
  assert.doesNotMatch(src, /PCFSoftShadowMap/);
  assert.match(src, /shadowMap\.type = THREE\.PCFShadowMap/);
  assert.match(src, /debug\.checkShaderErrors = false/);
});
