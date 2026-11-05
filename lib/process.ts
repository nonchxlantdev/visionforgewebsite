/**
 * Data for the "How we work" picture: what a business's tools look like at
 * each of the seven steps. Positions are percentages of the panel (tile centres).
 * Type-only import, so node --test can load this file on its own.
 */
import type { HubTool } from "./hub";

export const PROCESS_STEP_COUNT = 7;

export type SceneTile = {
  id: string;
  label: string;
  /** Centre of the tile, 0–100 across the panel. */
  x: number;
  /** Centre of the tile, 0–100 down the panel. */
  y: number;
  /** Degrees; only the first step tilts tiles. */
  rotate: number;
  /** Amber "slow spot" marker (Map step only). */
  flagged: boolean;
  /** Green check badge (Test step onward). */
  checked: boolean;
};

export type ProcessScene = {
  step: number;
  tiles: SceneTile[];
  hub: "none" | "outline" | "solid";
  lines: "none" | "flow" | "connected";
  /** Tiles drawn as dashed outlines (Design step). */
  blueprint: boolean;
  /** "Live" badge on the hub (Deploy onward). */
  live: boolean;
  /** Small rising chart beside Reports (Improve). */
  chart: boolean;
  icon: "chat" | "plan" | "loop" | null;
};

type Spot = readonly [x: number, y: number, rotate: number];

/** Step 1: loose and tilted, centre left clear for the chat icon. */
const SCATTER: readonly Spot[] = [
  [17, 17, -8],
  [46, 13, 6],
  [77, 20, -5],
  [85, 49, 9],
  [16, 54, 7],
  [38, 85, -6],
  [66, 82, 5],
  [86, 84, -9],
];

/** Step 2: two rows, so the flow between neighbours reads left to right. */
const GRID: readonly Spot[] = [
  [15, 32, 0],
  [38, 32, 0],
  [62, 32, 0],
  [85, 32, 0],
  [15, 70, 0],
  [38, 70, 0],
  [62, 70, 0],
  [85, 70, 0],
];

/** Steps 3–7: four tools either side of the hub. */
const AROUND_HUB: readonly Spot[] = [
  [16, 17, 0],
  [16, 39, 0],
  [16, 61, 0],
  [16, 83, 0],
  [84, 17, 0],
  [84, 39, 0],
  [84, 61, 0],
  [84, 83, 0],
];

/** Phone cards are narrow, so the same pictures use two columns. */
const SCATTER_NARROW: readonly Spot[] = [
  [27, 12, -8],
  [72, 16, 6],
  [23, 36, 5],
  [77, 40, -7],
  [27, 62, -5],
  [73, 64, 8],
  [25, 88, 6],
  [71, 86, -6],
];

const GRID_NARROW: readonly Spot[] = [
  [27, 13, 0],
  [73, 13, 0],
  [27, 38, 0],
  [73, 38, 0],
  [27, 62, 0],
  [73, 62, 0],
  [27, 87, 0],
  [73, 87, 0],
];

const AROUND_HUB_NARROW: readonly Spot[] = [
  [20, 14, 0],
  [20, 38, 0],
  [20, 62, 0],
  [20, 86, 0],
  [80, 14, 0],
  [80, 38, 0],
  [80, 62, 0],
  [80, 86, 0],
];

export type SceneShape = "wide" | "narrow";

const LAYOUTS: Record<SceneShape, readonly [readonly Spot[], readonly Spot[], readonly Spot[]]> = {
  wide: [SCATTER, GRID, AROUND_HUB],
  narrow: [SCATTER_NARROW, GRID_NARROW, AROUND_HUB_NARROW],
};

/** Which tiles the Map step joins with dashed "flow" lines (by index into the tool list). */
export function flowPairs(shape: SceneShape = "wide"): ReadonlyArray<readonly [number, number]> {
  return shape === "wide"
    ? [
        [0, 1],
        [1, 2],
        [2, 3],
        [4, 5],
        [5, 6],
        [6, 7],
      ]
    : [
        [0, 1],
        [2, 3],
        [4, 5],
        [6, 7],
        [0, 2],
        [2, 4],
        [4, 6],
      ];
}

export function clampStep(step: number): number {
  if (!Number.isFinite(step)) return 0;
  return Math.min(PROCESS_STEP_COUNT - 1, Math.max(0, Math.floor(step)));
}

const ICONS: Record<number, ProcessScene["icon"]> = { 0: "chat", 2: "plan", 6: "loop" };

/** The picture for one step (0 = Discover … 6 = Improve). */
export function processScene(rawStep: number, tools: readonly HubTool[], shape: SceneShape = "wide"): ProcessScene {
  const step = clampStep(rawStep);
  const [scatter, grid, aroundHub] = LAYOUTS[shape];
  const layout = step === 0 ? scatter : step === 1 ? grid : aroundHub;
  return {
    step,
    tiles: tools.map((tool, i) => {
      const [x, y, rotate] = layout[i % layout.length];
      return {
        id: tool.id,
        label: tool.label,
        x,
        y,
        rotate,
        flagged: step === 1 && tool.bottleneck,
        checked: step >= 4,
      };
    }),
    hub: step < 2 ? "none" : step === 2 ? "outline" : "solid",
    lines: step === 1 ? "flow" : step >= 3 ? "connected" : "none",
    blueprint: step === 2,
    live: step >= 5,
    chart: step === 6,
    icon: ICONS[step] ?? null,
  };
}
