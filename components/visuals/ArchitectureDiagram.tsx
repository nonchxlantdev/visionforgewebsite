"use client";

import { motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSparks } from "@/components/forge/SparkField";
import { useReducedMotionPref } from "@/components/forge/useHeat";
import { isOnline, seams, weld, weldStatus, WELD_PROMPT } from "@/lib/connection-status";
import { architectureNodes } from "@/lib/site";

type Point = { x: number; y: number };

const ease = [0.16, 1, 0.3, 1] as const;
const TOTAL = architectureNodes.length;

/** Layout offsets give the board an uneven, hand-placed feel while staying in a measured grid. */
const OFFSETS = [
  "md:justify-self-start md:translate-y-0",
  "translate-y-10 md:justify-self-center md:translate-y-16",
  "md:justify-self-end md:-translate-y-2",
  "translate-y-10 md:justify-self-start md:translate-y-6",
  "md:justify-self-center md:translate-y-14",
  "translate-y-10 md:justify-self-end md:translate-y-2",
];

function Seam({ from, to, online, reduce, index }: { from: Point; to: Point; online: boolean; reduce: boolean; index: number }) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const draw = reduce
    ? { initial: false as const, animate: { strokeDashoffset: 0 } }
    : { initial: { strokeDashoffset: length }, animate: { strokeDashoffset: 0 } };
  const transition = { duration: reduce ? 0 : 0.5, ease };

  return (
    <g>
      <motion.line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="rgb(255 90 31 / 0.35)"
        strokeWidth={online ? 12 : 8}
        strokeLinecap="round"
        strokeDasharray={length}
        {...draw}
        transition={transition}
        style={{ filter: "blur(3px)" }}
      />
      <motion.line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={online ? "#fff4d6" : "#f2b33d"}
        strokeWidth={online ? 3 : 2.5}
        strokeLinecap="round"
        strokeDasharray={length}
        {...draw}
        transition={transition}
      />
      {reduce ? null : (
        <motion.circle
          r={online ? 4.5 : 4}
          fill="#fff4d6"
          initial={{ cx: from.x, cy: from.y, opacity: 0 }}
          animate={{ cx: [from.x, to.x], cy: [from.y, to.y], opacity: [0, 1, 1, 0] }}
          transition={
            online
              ? { duration: 1.4, delay: index * 0.18, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }
              : { duration: 0.55, ease }
          }
          style={{ filter: "drop-shadow(0 0 6px #ff5a1f)" }}
        />
      )}
    </g>
  );
}

export function ArchitectureDiagram() {
  const reduce = useReducedMotionPref();
  const { emit } = useSparks();
  const [chain, setChain] = useState<number[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const boardRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const online = isOnline(chain, TOTAL);
  const links = seams(chain, TOTAL);

  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const base = board.getBoundingClientRect();
    setSize({ w: base.width, h: base.height });
    setPoints(
      nodeRefs.current.map((node) => {
        if (!node) return { x: 0, y: 0 };
        const r = node.getBoundingClientRect();
        return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 };
      }),
    );
  }, []);

  useLayoutEffect(() => {
    measure();
    const board = boardRef.current;
    if (!board) return;
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    nodeRefs.current.forEach((node) => node && ro.observe(node));
    void document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  const sparkAt = useCallback(
    (index: number, count: number, power: number) => {
      const node = nodeRefs.current[index];
      if (!node) return;
      const r = node.getBoundingClientRect();
      emit({ x: r.left + r.width / 2, y: r.top + r.height / 2, count, power });
    },
    [emit],
  );

  useEffect(() => {
    if (!online || reduce) return;
    const timers = chain.map((index, i) => window.setTimeout(() => sparkAt(index, 30, 1.1), 250 + i * 110));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [online, chain, reduce, sparkAt]);

  function choose(index: number) {
    if (chain.includes(index) || online) return;
    setChain((current) => weld(current, index, TOTAL));
    sparkAt(index, chain.length === 0 ? 18 : 28, chain.length === 0 ? 0.7 : 0.95);
  }

  const status = weldStatus(chain, architectureNodes);
  const last = chain[chain.length - 1];

  return (
    <div className="mt-14">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <p className="font-mono text-[11px] tracking-[0.18em] text-ash">{WELD_PROMPT}</p>
        <div className="flex items-center gap-4">
          <p
            className={status ? `font-mono text-[11px] tracking-[0.18em] ${online ? "text-whitehot" : "text-molten"}` : "sr-only"}
            aria-live="polite"
          >
            {status}
          </p>
          {chain.length ? (
            <button
              type="button"
              onClick={() => setChain([])}
              className="inline-flex min-h-11 shrink-0 items-center gap-2 border border-line px-3 font-mono whitespace-nowrap text-[11px] tracking-[0.16em] text-ash uppercase transition-colors hover:border-molten hover:text-whitehot"
            >
              <RotateCcw aria-hidden className="h-3.5 w-3.5" strokeWidth={1.75} />
              {online ? "Weld again" : "Reset"}
            </button>
          ) : null}
        </div>
      </div>

      <div
        className={`brushed relative overflow-hidden border px-4 pt-8 pb-24 transition-[border-color,box-shadow] duration-700 sm:px-8 md:px-12 md:pt-12 md:pb-36 ${
          online ? "border-molten/70 shadow-[0_0_80px_rgba(255,90,31,0.18)]" : "border-line"
        }`}
      >
        <div ref={boardRef} className="relative">
          <svg
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
            className="pointer-events-none absolute inset-0 overflow-visible"
            aria-hidden
          >
            {points.length === TOTAL
              ? links.map(([a, b], i) => (
                  <Seam
                    key={`${a}-${b}`}
                    from={points[a]}
                    to={points[b]}
                    online={online}
                    reduce={reduce}
                    index={i}
                  />
                ))
              : null}
          </svg>

          <div role="group" aria-label="System parts" className="relative grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-16 md:gap-y-24">
            {architectureNodes.map((node, index) => {
              const order = chain.indexOf(index);
              const welded = order >= 0;
              const hot = welded && index === last && !online;
              const candidate = chain.length > 0 && !welded && !online;
              const tag = online ? "ONLINE" : hot ? "HOT" : welded ? `WELD ${order + 1}` : candidate ? "TAP TO WELD" : "COLD";
              return (
                <button
                  key={node.id}
                  ref={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                  type="button"
                  aria-pressed={welded}
                  aria-label={`${node.label}${welded ? `, welded ${order + 1} of ${TOTAL}` : ""}`}
                  onClick={() => choose(index)}
                  className={`group relative z-10 min-h-24 border bg-soot px-4 py-3 text-left transition-[border-color,box-shadow,background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] md:min-h-28 md:w-[17rem] md:px-5 md:py-4 ${OFFSETS[index]} ${
                    online
                      ? "border-whitehot/80 bg-[#2a1a10] shadow-[0_0_34px_rgba(255,90,31,0.45)]"
                      : hot
                        ? "border-whitehot bg-[#2b1a10] shadow-[0_0_40px_rgba(255,90,31,0.6)]"
                        : welded
                          ? "border-molten shadow-[0_0_18px_rgba(242,179,61,0.28)]"
                          : candidate
                            ? "border-chrome/30 hover:border-molten hover:shadow-[0_0_24px_rgba(255,90,31,0.3)]"
                            : "border-line hover:border-molten/70"
                  }`}
                >
                  <span className="flex items-center justify-between font-mono text-[10px] tracking-[0.16em] text-ash">
                    {node.id}
                    {candidate ? (
                      <span aria-hidden className="pulse h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_8px_#ff5a1f]" />
                    ) : null}
                  </span>
                  <span className="mt-1.5 block font-display text-xl leading-[0.95] font-bold tracking-[0.03em] text-chrome uppercase md:text-2xl">
                    {node.label}
                  </span>
                  <span
                    className={`mt-2 block font-mono text-[9px] tracking-[0.16em] ${
                      welded || online ? "text-molten" : "text-ash/70"
                    }`}
                    aria-hidden
                  >
                    {tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center md:bottom-8" aria-hidden>
          <div className="flex items-center gap-1.5">
            {architectureNodes.map((node, i) => (
              <span
                key={node.id}
                className={`h-1.5 w-6 transition-colors duration-500 sm:w-8 ${
                  i < chain.length ? "bg-gradient-to-r from-ember to-molten shadow-[0_0_8px_rgba(255,90,31,0.6)]" : "bg-line"
                }`}
              />
            ))}
            <span
              className={`ml-3 font-mono text-[10px] tracking-[0.18em] uppercase ${online ? "text-whitehot" : "text-ash"}`}
            >
              {online ? "System online" : `${chain.length}/${TOTAL} welded`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
