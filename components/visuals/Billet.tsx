"use client";

import { motion } from "motion/react";
import { heatColor } from "@/lib/heat";
import { useReducedMotionPref } from "@/components/forge/useHeat";

/** Eight-point outlines, one per process stage: a rough bar hammered into a finished blade. */
const SHAPES: Array<Array<[number, number]>> = [
  [[60, 38], [200, 35], [340, 39], [347, 60], [340, 82], [200, 85], [60, 81], [53, 60]],
  [[50, 44], [200, 41], [350, 46], [364, 60], [350, 74], [200, 79], [50, 76], [45, 60]],
  [[40, 50], [200, 46], [330, 50], [378, 58], [330, 70], [200, 74], [40, 70], [36, 60]],
  [[30, 52], [150, 48], [320, 50], [386, 58], [320, 68], [150, 72], [30, 68], [26, 60]],
  [[96, 53], [180, 48], [330, 50], [392, 58], [330, 66], [180, 70], [96, 67], [92, 60]],
];

const toPath = (points: Array<[number, number]>) =>
  `M${points.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;

export const stageHeat = (stage: number) => 1 - stage / 4;

export function Billet({ stage, className = "" }: { stage: number; className?: string }) {
  const reduce = useReducedMotionPref();
  const s = Math.max(0, Math.min(4, stage));
  const h = stageHeat(s);
  const color = heatColor(h);
  const done = s === 4;

  return (
    <svg viewBox="0 0 420 120" className={className} aria-hidden>
      <defs>
        <linearGradient id="blade-sheen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <motion.path
        initial={false}
        animate={{ d: toPath(SHAPES[s]), fill: color }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ filter: `drop-shadow(0 0 ${Math.round(6 + h * 26)}px rgb(255 100 30 / ${(h * 0.7).toFixed(2)}))` }}
      />
      <motion.path
        initial={false}
        animate={{ d: toPath(SHAPES[s]) }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        fill="url(#blade-sheen)"
      />
      <motion.g initial={false} animate={{ opacity: done ? 1 : 0 }} transition={{ duration: reduce ? 0 : 0.4 }}>
        <rect x="18" y="50" width="74" height="20" rx="4" fill="#3a2414" stroke="#6b4a2c" />
        <rect x="88" y="44" width="8" height="32" rx="2" fill="#c9c8c4" />
        <line x1="120" y1="59" x2="370" y2="58" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1" />
      </motion.g>
    </svg>
  );
}
