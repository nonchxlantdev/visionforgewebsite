import assert from "node:assert/strict";
import test from "node:test";
import { connectionStatus, TAP_PROMPT } from "../lib/connection-status.ts";

test("tap prompt is the permanent instruction", () => {
  assert.equal(TAP_PROMPT, "TAP A NODE TO CONNECT THE SYSTEM.");
});

test("status is empty until a node is selected", () => {
  assert.equal(connectionStatus(null), "");
});

test("status names the selected node and says it is linked to all", () => {
  assert.equal(
    connectionStatus({ id: "05", label: "DATA" }),
    "05 · DATA · LINKED TO ALL",
  );
});
