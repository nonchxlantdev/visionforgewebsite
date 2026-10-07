"use client";

import { motion } from "motion/react";
import { MessageCircle, RotateCcw } from "lucide-react";
import { ROUNDS, rankFor, type GameState } from "@/lib/forge-game";
import { EmailLink } from "@/components/ui/EmailLink";
import { site } from "@/lib/site";
import { useReducedMotionPref } from "@/components/forge/useHeat";

type ResultCardProps = {
  state: GameState;
  best: number | null;
  newBest: boolean;
  onReplay(): void;
};

function clock(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `0:${String(s).padStart(2, "0")}`;
}

export function ResultCard({ state, best, newBest, onReplay }: ResultCardProps) {
  const reduce = useReducedMotionPref();
  const complete = state.forged.length === ROUNDS.length;
  const rank = rankFor(state.score);

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center overflow-y-auto bg-forge/90 p-4 backdrop-blur-sm sm:p-8">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl"
        role="dialog"
        aria-label="Forge result"
      >
        <div className="flex items-center justify-center gap-1.5" aria-hidden>
          {ROUNDS.map((piece, i) => {
            const done = state.forged.includes(piece);
            return (
              <motion.span
                key={piece}
                initial={reduce ? false : { opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.1 + i * 0.08, duration: 0.3 }}
                className={`h-10 flex-1 border text-center font-mono text-[9px] leading-10 tracking-[0.1em] sm:text-[10px] ${
                  done
                    ? "border-molten bg-gradient-to-b from-whitehot/30 via-molten/25 to-ember/20 text-whitehot shadow-[0_0_24px_rgba(255,90,31,0.4)]"
                    : "border-line text-ash/50"
                }`}
              >
                {piece}
              </motion.span>
            );
          })}
        </div>

        <p className="mt-6 text-center font-mono text-[11px] tracking-[0.2em] text-molten uppercase">
          Rank · {rank}
          {newBest ? " · New best" : ""}
        </p>
        <p className="mt-3 text-center font-display text-[clamp(2.2rem,6vw,3.6rem)] leading-[0.9] font-bold uppercase">
          {complete ? (
            <>
              You forged a system in {clock(state.clockMs)}.
              <br />
              <span className="hot-text">Now let&apos;s forge yours.</span>
            </>
          ) : (
            <>
              The metal cooled.
              <br />
              <span className="hot-text">Strike again, or let us do the heavy lifting.</span>
            </>
          )}
        </p>

        <dl className="mt-6 grid grid-cols-3 border-y border-line py-4 text-center font-mono text-[10px] tracking-[0.16em] text-ash uppercase">
          <div>
            <dt>Score</dt>
            <dd className="mt-1 text-lg tracking-normal text-chrome tabular-nums">{state.score.toLocaleString("en-US")}</dd>
          </div>
          <div>
            <dt>Best combo</dt>
            <dd className="mt-1 text-lg tracking-normal text-chrome tabular-nums">x{state.bestCombo}</dd>
          </div>
          <div>
            <dt>Best</dt>
            <dd className="mt-1 text-lg tracking-normal text-chrome tabular-nums">
              {best === null ? "-" : best.toLocaleString("en-US")}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex min-h-12 items-center gap-2 bg-molten px-6 font-mono text-[12px] tracking-[0.14em] text-on-molten uppercase transition-[background-color,box-shadow] duration-300 hover:bg-whitehot hover:shadow-[0_0_30px_rgba(255,90,31,0.5)]"
          >
            <RotateCcw aria-hidden className="h-4 w-4" strokeWidth={1.75} />
            Strike again
          </button>
          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center gap-2 border border-chrome/25 px-6 font-mono text-[12px] tracking-[0.14em] text-chrome uppercase transition-colors duration-300 hover:border-molten hover:text-whitehot"
          >
            <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={1.75} />
            WhatsApp
          </a>
        </div>
        <div className="mt-3 text-center">
          <EmailLink address={site.sales.display} subject="I forged a system. Let's build mine." size="sm" />
        </div>
      </motion.div>
    </div>
  );
}
