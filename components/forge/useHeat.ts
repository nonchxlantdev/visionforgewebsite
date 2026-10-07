"use client";

import { useEffect, useState } from "react";

export type Pointer = { x: number; y: number; active: boolean };

const pointer: Pointer = { x: -9999, y: -9999, active: false };
const listeners = new Set<(p: Pointer) => void>();
let attached = false;
let queued = false;

function flush() {
  queued = false;
  listeners.forEach((fn) => fn(pointer));
}

function onMove(event: PointerEvent) {
  if (event.pointerType === "touch") return;
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
  if (!queued) {
    queued = true;
    requestAnimationFrame(flush);
  }
}

function onLeave() {
  pointer.active = false;
  if (!queued) {
    queued = true;
    requestAnimationFrame(flush);
  }
}

/** Subscribe to the shared, rAF-batched pointer. Returns an unsubscribe. */
export function subscribePointer(fn: (p: Pointer) => void): () => void {
  if (!attached && typeof window !== "undefined") {
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    attached = true;
  }
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function getPointer(): Pointer {
  return pointer;
}

/** True when the device has a fine pointer and the user allows motion. */
export function useFineMotion(): boolean {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOk(fine.matches && !motion.matches);
    update();
    fine.addEventListener("change", update);
    motion.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      motion.removeEventListener("change", update);
    };
  }, []);
  return ok;
}

/** True when the user asked for reduced motion. */
export function useReducedMotionPref(): boolean {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(motion.matches);
    update();
    motion.addEventListener("change", update);
    return () => motion.removeEventListener("change", update);
  }, []);
  return reduce;
}
