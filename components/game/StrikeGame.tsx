"use client";

import { AnimatePresence, motion } from "motion/react";
import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useSparks } from "@/components/forge/SparkField";
import {
  advance,
  createGame,
  DURATION_MS,
  needleAt,
  ROUNDS,
  startGame,
  strike,
  type GameState,
} from "@/lib/forge-game";
import { heatColor, heatRgb } from "@/lib/heat";
import { readStore, writeStore } from "@/lib/storage";
import { createClang, type Clang } from "./clang";
import { GameHud } from "./GameHud";
import { ResultCard } from "./ResultCard";
import { useReducedMotionPref } from "@/components/forge/useHeat";

const BEST_KEY = "vf-best";

const STAMPS = {
  perfect: { text: "Perfect", tone: "hot-text" },
  good: { text: "Good", tone: "text-molten" },
  crack: { text: "Cracked · strike again", tone: "text-ash" },
} as const;

function readBest(): number | null {
  const raw = readStore("local", BEST_KEY);
  const n = raw === null ? NaN : Number(raw);
  return Number.isFinite(n) ? n : null;
}

function formatClock(ms: number) {
  const s = Math.ceil(Math.max(0, ms) / 1000);
  return `0:${String(s).padStart(2, "0")}`;
}

const noop = () => () => {};
const nullSnapshot = () => null;
const falseSnapshot = () => false;
const hasAudio = () => "AudioContext" in window || "webkitAudioContext" in window;

function restartClass(el: Element | null, className: string, reduce: boolean | null) {
  if (!el || reduce) return;
  el.classList.remove(className);
  void (el as HTMLElement).getBoundingClientRect();
  el.classList.add(className);
}

/** Billet colour: dull steel when cold, then the shared heat ramp from ember up. */
function billetColor(h: number): string {
  if (h >= 0.35) return heatColor(h);
  const k = h / 0.35;
  const [r, g, b] = heatRgb(0.35);
  const cold = [74, 68, 64];
  return `rgb(${Math.round(cold[0] + (r - cold[0]) * k)} ${Math.round(cold[1] + (g - cold[1]) * k)} ${Math.round(cold[2] + (b - cold[2]) * k)})`;
}

/** Heat of the billet for a needle position: white-hot at centre, cold at the ends. */
const billetHeat = (p: number) => 1 - Math.abs(p - 0.5) * 2;

export function StrikeGame() {
  const reduce = useReducedMotionPref();
  const { emit } = useSparks();

  const [snap, setSnap] = useState<GameState>(createGame);
  const stateRef = useRef<GameState>(snap);
  const storedBest = useSyncExternalStore(noop, readBest, nullSnapshot);
  const [bestOverride, setBest] = useState<number | null | undefined>(undefined);
  const best = bestOverride === undefined ? storedBest : bestOverride;
  const [newBest, setNewBest] = useState(false);
  const [stamp, setStamp] = useState<{ id: number; zone: keyof typeof STAMPS } | null>(null);
  const [announce, setAnnounce] = useState("");
  const [sound, setSound] = useState(false);
  const canSound = useSyncExternalStore(noop, hasAudio, falseSnapshot);

  const stageRef = useRef<HTMLDivElement>(null);
  const strikeRef = useRef<HTMLButtonElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const billetRef = useRef<SVGRectElement>(null);
  const hammerRef = useRef<SVGGElement>(null);
  const timeRef = useRef<HTMLSpanElement>(null);
  const clangRef = useRef<Clang | null>(null);
  const visible = useRef(true);
  const frame = useRef(0);
  const last = useRef(0);

  useEffect(() => () => clangRef.current?.close(), []);

  const paint = useCallback(
    (s: GameState) => {
      let p = s.phase === "idle" ? 0.5 : needleAt(s);
      if (reduce) p = Math.round(p * 40) / 40;
      const needle = needleRef.current;
      if (needle) needle.style.transform = `translateX(${(p * 100).toFixed(3)}%)`;
      const billet = billetRef.current;
      if (billet) {
        const h = s.phase === "idle" ? 0.55 : billetHeat(p);
        billet.style.fill = billetColor(h);
        billet.style.filter = `drop-shadow(0 0 ${Math.round(4 + h * 22)}px rgb(255 110 40 / ${(0.15 + h * 0.6).toFixed(2)}))`;
      }
      if (timeRef.current) timeRef.current.textContent = formatClock(s.remainingMs);
    },
    [reduce],
  );

  const finish = useCallback((s: GameState) => {
    const previous = readBest();
    const isBest = previous === null || s.score > previous;
    if (isBest) writeStore("local", BEST_KEY, String(s.score));
    setBest(isBest ? s.score : previous);
    setNewBest(isBest && s.score > 0);
    setAnnounce(
      s.forged.length === ROUNDS.length
        ? `System forged. Final score ${s.score}.`
        : `Time's up. The metal cooled with ${s.forged.length} of 5 pieces forged. Score ${s.score}.`,
    );
  }, []);

  const loopRef = useRef<(time: number) => void>(() => {});
  useEffect(() => {
    loopRef.current = (time: number) => {
      const dt = last.current ? Math.min(64, time - last.current) : 16;
      last.current = time;
      const prev = stateRef.current;
      const next = advance(prev, dt);
      stateRef.current = next;
      paint(next);
      if (next.phase === "finished" && prev.phase !== "finished") {
        frame.current = 0;
        setSnap(next);
        finish(next);
        return;
      }
      if (visible.current && document.visibilityState === "visible") {
        frame.current = requestAnimationFrame(loopRef.current);
      } else {
        last.current = 0;
        frame.current = 0;
      }
    };
  }, [finish, paint]);

  const kick = useCallback(() => {
    const phase = stateRef.current.phase;
    if (frame.current || (phase !== "playing" && phase !== "striking")) return;
    if (!visible.current || document.visibilityState !== "visible") return;
    last.current = 0;
    frame.current = requestAnimationFrame((t) => loopRef.current(t));
  }, []);

  useEffect(() => {
    paint(stateRef.current);
    const stage = stageRef.current;
    if (!stage) return;
    const io = new IntersectionObserver(([entry]) => {
      visible.current = entry.isIntersecting;
      if (visible.current) kick();
    });
    io.observe(stage);
    const onVis = () => {
      if (document.visibilityState === "visible") kick();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(frame.current);
      frame.current = 0;
    };
  }, [kick, paint]);

  const begin = useCallback(() => {
    const s = startGame();
    stateRef.current = s;
    setSnap(s);
    setStamp(null);
    setNewBest(false);
    setAnnounce("Forging started. Strike when the bar is white-hot. Round 1: Web.");
    paint(s);
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    kick();
    requestAnimationFrame(() => strikeRef.current?.focus({ preventScroll: true }));
  }, [kick, paint]);

  const act = useCallback(() => {
    const s = stateRef.current;
    if (s.phase === "idle" || s.phase === "finished") return;
    const next = strike(s);
    if (next === s) return;
    stateRef.current = next;
    setSnap(next);
    const zone = next.lastZone ?? "crack";

    restartClass(hammerRef.current, "hammer-swing", reduce);
    const rect = billetRef.current?.getBoundingClientRect();
    if (rect) {
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height * 0.2;
      if (zone === "perfect") emit({ x, y, count: 80, power: 1.45 });
      else if (zone === "good") emit({ x, y, count: 34, power: 1 });
      else emit({ x, y, count: 18, palette: "dust" });
    }
    if (zone === "perfect") restartClass(stageRef.current, "stage-shake", reduce);
    if (sound) clangRef.current?.play(zone, next.combo);
    setStamp({ id: next.strikes, zone });

    const piece = ROUNDS[s.round];
    const pieceName = piece.charAt(0) + piece.slice(1).toLowerCase();
    if (zone === "crack") setAnnounce(`Cracked. Strike ${pieceName} again. Combo reset.`);
    else if (next.phase === "finished") {
      setAnnounce(`${zone === "perfect" ? "Perfect" : "Good"}. ${pieceName} forged.`);
      finish(next);
    } else {
      const upcoming = ROUNDS[next.round];
      setAnnounce(
        `${zone === "perfect" ? "Perfect" : "Good"}. ${pieceName} forged. Combo ${next.combo}. Next: ${upcoming.charAt(0)}${upcoming.slice(1).toLowerCase()}.`,
      );
    }
  }, [emit, finish, reduce, sound]);

  const toggleSound = () => {
    if (!sound && !clangRef.current) clangRef.current = createClang();
    setSound((on) => !on);
  };

  const hot = 0.05 - 0.006 * snap.round;
  const playing = snap.phase === "playing" || snap.phase === "striking";

  return (
    <div
      ref={stageRef}
      className="brushed relative min-h-[37rem] overflow-hidden border border-line shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:min-h-0"
    >
      <div className="relative z-10 px-4 pt-4 sm:px-8 sm:pt-6">
        <div className="flex items-start justify-between gap-4">
          <GameHud score={snap.score} combo={snap.combo} forged={snap.forged} best={best} timeRef={timeRef} />
          {canSound ? (
            <button
              type="button"
              onClick={toggleSound}
              aria-pressed={sound}
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-line text-ash transition-colors hover:border-molten hover:text-whitehot"
            >
              {sound ? <Volume2 aria-hidden className="h-4 w-4" /> : <VolumeX aria-hidden className="h-4 w-4" />}
              <span className="sr-only">{sound ? "Turn sound off" : "Turn sound on"}</span>
            </button>
          ) : null}
        </div>

        <div className="relative mt-5 h-9" aria-hidden>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg,#24201d 0%,#4a2414 18%,#ff5a1f 33%,#f2b33d 42%,#fff4d6 50%,#f2b33d 58%,#ff5a1f 67%,#4a2414 82%,#24201d 100%)",
            }}
          />
          <div
            className="absolute inset-y-0 border-x border-dashed border-chrome/40"
            style={{ left: `${(0.5 - hot - 0.1) * 100}%`, right: `${(0.5 - hot - 0.1) * 100}%` }}
          />
          <div
            className="absolute -inset-y-1 border-2 border-whitehot shadow-[0_0_18px_rgba(255,244,214,0.75)]"
            style={{ left: `${(0.5 - hot) * 100}%`, right: `${(0.5 - hot) * 100}%` }}
          />
          <div ref={needleRef} className="absolute inset-y-0 left-0 w-full will-change-transform">
            <div className="absolute -top-2 -bottom-2 -left-[2px] w-[4px] bg-forge shadow-[0_0_0_1px_rgba(230,228,223,0.85)]" />
            <div className="absolute -top-3 -left-[6px] h-0 w-0 border-x-[6px] border-t-[7px] border-x-transparent border-t-chrome" />
          </div>
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] tracking-[0.16em] text-ash uppercase" aria-hidden>
          <span>Cold</span>
          <span className="text-whitehot">White-hot</span>
          <span>Cold</span>
        </div>
      </div>

      <button
        ref={strikeRef}
        type="button"
        disabled={!playing}
        aria-label={`Strike the anvil. Round ${Math.min(snap.round + 1, 5)} of 5: ${ROUNDS[snap.round]}.`}
        aria-describedby="strike-howto"
        onPointerDown={(event) => {
          event.preventDefault();
          act();
        }}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            if (!event.repeat) act();
          }
        }}
        className="relative block w-full cursor-pointer touch-manipulation select-none focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_rgba(242,179,61,0.7),inset_0_0_40px_rgba(255,90,31,0.15)] disabled:cursor-default"
      >
        <svg viewBox="0 -50 600 350" className="mx-auto block h-auto w-full max-w-3xl" aria-hidden>
          <defs>
            <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9a9da3" />
              <stop offset="0.12" stopColor="#5d5f63" />
              <stop offset="0.5" stopColor="#2c2a28" />
              <stop offset="1" stopColor="#141210" />
            </linearGradient>
            <linearGradient id="steel-face" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#cfd1d4" />
              <stop offset="0.5" stopColor="#f2f1ee" />
              <stop offset="1" stopColor="#a7a9ad" />
            </linearGradient>
            <linearGradient id="handle" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#5a3b22" />
              <stop offset="1" stopColor="#2e1d10" />
            </linearGradient>
            <radialGradient id="floor-glow" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0" stopColor="rgb(255 90 31 / 0.35)" />
              <stop offset="1" stopColor="rgb(255 90 31 / 0)" />
            </radialGradient>
          </defs>

          <ellipse cx="300" cy="278" rx="230" ry="18" fill="url(#floor-glow)" />
          <ellipse cx="300" cy="282" rx="170" ry="8" fill="rgb(0 0 0 / 0.6)" />

          {/* anvil */}
          <path
            d="M70 150 C 120 150 150 140 190 136 L 470 136 L 470 176 L 420 176 C 400 196 392 210 392 228 L 430 252 L 430 276 L 170 276 L 170 252 L 208 228 C 208 210 200 196 180 184 C 140 180 100 170 70 150 Z"
            fill="url(#steel)"
            stroke="rgb(230 228 223 / 0.18)"
            strokeWidth="1.5"
          />
          <rect x="190" y="132" width="280" height="8" fill="url(#steel-face)" />

          {/* billet */}
          <rect ref={billetRef} x="250" y="112" width="120" height="20" rx="3" />

          {/* hammer, drawn in strike pose and rotated up at rest */}
          <g ref={hammerRef} className="hammer">
            <rect x="330" y="56" width="230" height="12" rx="6" fill="url(#handle)" transform="rotate(-8 330 62)" />
            <rect x="274" y="52" width="72" height="56" rx="4" fill="url(#steel)" stroke="rgb(230 228 223 / 0.3)" />
            <rect x="274" y="100" width="72" height="8" fill="url(#steel-face)" />
          </g>
        </svg>

        <AnimatePresence>
          {stamp && playing ? (
            <motion.span
              key={stamp.id}
              initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.6, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.22, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-none absolute top-[8%] left-1/2 -translate-x-1/2 font-display text-[clamp(2rem,6vw,4rem)] font-black whitespace-nowrap uppercase ${STAMPS[stamp.zone].tone}`}
              aria-hidden
            >
              {STAMPS[stamp.zone].text}
            </motion.span>
          ) : null}
        </AnimatePresence>
      </button>

      <p id="strike-howto" className="sr-only">
        Press Space, Enter, or tap the anvil when the needle is in the white-hot zone. Five good strikes forge a full
        system. You have {DURATION_MS / 1000} seconds.
      </p>
      <p className="sr-only" aria-live="assertive" aria-atomic="true">
        {announce}
      </p>

      {snap.phase === "idle" ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-forge/75 p-6 text-center backdrop-blur-[2px]">
          <p className="font-mono text-[11px] tracking-[0.2em] text-molten uppercase">30 seconds · 5 strikes</p>
          <p className="mt-3 max-w-md font-display text-[clamp(2rem,5vw,3.25rem)] leading-[0.92] font-bold uppercase">
            Hit the <span className="hot-text">white-hot</span> zone.
            <br />
            Forge a whole system.
          </p>
          <p className="mt-4 max-w-sm text-sm text-ash sm:text-base">
            Tap the anvil, click, or press Space. Misses crack the metal. The needle speeds up every round.
          </p>
          <button
            type="button"
            onClick={begin}
            className="mt-6 inline-flex min-h-12 items-center bg-molten px-8 font-mono text-[12px] tracking-[0.16em] text-on-molten uppercase transition-[background-color,box-shadow] duration-300 hover:bg-whitehot hover:shadow-[0_0_34px_rgba(255,90,31,0.55)]"
          >
            Light the forge
          </button>
        </div>
      ) : null}

      {snap.phase === "finished" ? (
        <ResultCard state={snap} best={best} newBest={newBest} onReplay={begin} />
      ) : null}
    </div>
  );
}
