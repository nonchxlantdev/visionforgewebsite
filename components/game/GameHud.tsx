import { ROUNDS } from "@/lib/forge-game";

type GameHudProps = {
  score: number;
  combo: number;
  forged: readonly string[];
  best: number | null;
  timeRef: React.RefObject<HTMLSpanElement | null>;
};

export function GameHud({ score, combo, forged, best, timeRef }: GameHudProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 font-mono text-[11px] tracking-[0.16em] text-ash uppercase">
      <dl className="flex gap-6">
        <div>
          <dt>Score</dt>
          <dd className="mt-1 text-xl tracking-normal text-chrome tabular-nums">{score.toLocaleString("en-US")}</dd>
        </div>
        <div>
          <dt>Combo</dt>
          <dd className={`mt-1 text-xl tracking-normal tabular-nums ${combo > 1 ? "text-molten" : "text-chrome"}`}>
            x{combo}
          </dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd className="mt-1 text-xl tracking-normal text-chrome tabular-nums">
            <span ref={timeRef}>0:30</span>
          </dd>
        </div>
        <div className="hidden sm:block">
          <dt>Best</dt>
          <dd className="mt-1 text-xl tracking-normal text-chrome tabular-nums">
            {best === null ? "-" : best.toLocaleString("en-US")}
          </dd>
        </div>
      </dl>
      <ol className="flex gap-1.5" aria-label="Pieces forged">
        {ROUNDS.map((piece) => {
          const done = forged.includes(piece);
          return (
            <li
              key={piece}
              className={`border px-2 py-1.5 text-[10px] tracking-[0.12em] transition-[background-color,color,border-color,box-shadow] duration-300 ${
                done
                  ? "border-molten bg-molten/15 text-whitehot shadow-[0_0_16px_rgba(255,90,31,0.35)]"
                  : "border-line text-ash/60"
              }`}
            >
              <span aria-hidden>{done ? piece : "·"}</span>
              <span className="sr-only">{`${piece} ${done ? "forged" : "not forged yet"}`}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
