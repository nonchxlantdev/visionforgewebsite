import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const pkg = JSON.parse(readFileSync(new URL("package.json", root), "utf8"));

test("next is pinned exactly to a version the Cloudflare adapter supports", () => {
  // @opennextjs/cloudflare 1.20.9 crashes on next 16.4.0 ("Unexpected loadManifest(preview-props.json)").
  // Only bump next after confirming a newer adapter supports it (npm run preview must serve pages).
  assert.equal(pkg.dependencies.next, "16.3.8");
  assert.equal(pkg.devDependencies["eslint-config-next"], "16.3.8");
  assert.ok(pkg.dependencies["@opennextjs/cloudflare"]);
  assert.ok(pkg.devDependencies.wrangler);
});

test("cloudflare config files are present and point at the OpenNext output", () => {
  const wrangler = readFileSync(new URL("wrangler.jsonc", root), "utf8");
  assert.match(wrangler, /"main": ".open-next\/worker.js"/);
  assert.match(wrangler, /"nodejs_compat"/);
  assert.ok(existsSync(new URL("open-next.config.ts", root)));
  assert.match(pkg.scripts.deploy, /opennextjs-cloudflare build && opennextjs-cloudflare deploy/);
});

test("images use the static loader, so no paid optimizer is needed", () => {
  const config = readFileSync(new URL("next.config.ts", root), "utf8");
  assert.match(config, /loaderFile: ".\/lib\/image-loader.ts"/);
  assert.doesNotMatch(config, /cacheComponents: true/);
});
