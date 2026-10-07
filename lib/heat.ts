export type RGB = [number, number, number];
const STOPS: ReadonlyArray<readonly [number, RGB]> = [
  [0, [230, 228, 223]],
  [0.35, [255, 90, 31]],
  [0.7, [242, 179, 61]],
  [1, [255, 244, 214]],
];
export const HALF_LIFE_MS = 600;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export function heatRgb(h: number): RGB {
  const t = clamp01(h);
  for (let i = 1; i < STOPS.length; i += 1) {
    const [p1, c1] = STOPS[i];
    if (t <= p1) {
      const [p0, c0] = STOPS[i - 1];
      const k = (t - p0) / (p1 - p0);
      return [0, 1, 2].map((j) => Math.round(c0[j] + (c1[j] - c0[j]) * k)) as RGB;
    }
  }
  return STOPS[STOPS.length - 1][1];
}
export function heatColor(h: number): string {
  const [r, g, b] = heatRgb(h);
  return `rgb(${r} ${g} ${b})`;
}
export function heatWeight(h: number): number {
  return Math.round(400 + clamp01(h) * 500);
}
export function coolDown(h: number, dtMs: number): number {
  const next = h * Math.pow(0.5, dtMs / HALF_LIFE_MS);
  return next < 0.01 ? 0 : next;
}
