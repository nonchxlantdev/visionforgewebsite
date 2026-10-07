export const ROUNDS = ["WEB", "APP", "AUTOMATION", "DATA", "CLOUD"] as const;
export type Piece = (typeof ROUNDS)[number];
export type Zone = "perfect" | "good" | "crack";
export type Phase = "idle" | "playing" | "striking" | "finished";
export type Rank = "Apprentice" | "Smith" | "Master Smith" | "Forge Legend";

export const DURATION_MS = 30_000;
export const COOLDOWN_MS = 350;
const BASE_PERIOD_MS = 1600;
const SPEEDUP = 0.86;
const POINTS: Record<Exclude<Zone, "crack">, number> = { perfect: 300, good: 100 };

export type GameState = {
  phase: Phase; clockMs: number; round: number; roundStartMs: number;
  forged: Piece[]; score: number; combo: number; bestCombo: number;
  strikes: number; lastStrikeMs: number; lastZone: Zone | null;
  remainingMs: number; timeBonus: number;
};

export function createGame(): GameState {
  return { phase: "idle", clockMs: 0, round: 0, roundStartMs: 0, forged: [], score: 0,
    combo: 0, bestCombo: 0, strikes: 0, lastStrikeMs: -Infinity, lastZone: null,
    remainingMs: DURATION_MS, timeBonus: 0 };
}
export function startGame(): GameState {
  return { ...createGame(), phase: "playing" };
}
export function periodFor(round: number): number {
  return BASE_PERIOD_MS * Math.pow(SPEEDUP, round);
}
export function needleAt(s: GameState): number {
  const t = Math.max(0, s.clockMs - s.roundStartMs);
  const x = (t % periodFor(s.round)) / periodFor(s.round);
  return x < 0.5 ? x * 2 : 2 - x * 2;
}
export function zoneAt(p: number, round: number): Zone {
  const d = Math.abs(p - 0.5);
  const hot = 0.05 - 0.006 * round;
  if (d <= hot + 1e-9) return "perfect";
  if (d <= hot + 0.1 + 1e-9) return "good";
  return "crack";
}
export function advance(s: GameState, dtMs: number): GameState {
  if (s.phase === "idle" || s.phase === "finished") return s;
  const clockMs = s.clockMs + dtMs;
  if (clockMs >= DURATION_MS) {
    return { ...s, clockMs: DURATION_MS, remainingMs: 0, phase: "finished" };
  }
  const phase = s.phase === "striking" && clockMs - s.lastStrikeMs >= COOLDOWN_MS ? "playing" : s.phase;
  return { ...s, clockMs, phase, remainingMs: DURATION_MS - clockMs };
}
export function strike(s: GameState): GameState {
  if (s.phase !== "playing") return s;
  const zone = zoneAt(needleAt(s), s.round);
  const base = { ...s, strikes: s.strikes + 1, lastStrikeMs: s.clockMs, lastZone: zone,
    roundStartMs: s.clockMs + COOLDOWN_MS };
  if (zone === "crack") return { ...base, combo: 0, phase: "striking" };
  const combo = s.combo + 1;
  const forged = [...s.forged, ROUNDS[s.round]];
  const score = s.score + POINTS[zone] * combo;
  const next = { ...base, combo, bestCombo: Math.max(s.bestCombo, combo), forged, score, round: s.round + 1 };
  if (forged.length === ROUNDS.length) {
    const timeBonus = Math.floor((DURATION_MS - s.clockMs) / 1000) * 50;
    return { ...next, round: ROUNDS.length - 1, phase: "finished", timeBonus, score: score + timeBonus };
  }
  return { ...next, phase: "striking" };
}
export function rankFor(score: number): Rank {
  if (score >= 4500) return "Forge Legend";
  if (score >= 2800) return "Master Smith";
  if (score >= 1200) return "Smith";
  return "Apprentice";
}
