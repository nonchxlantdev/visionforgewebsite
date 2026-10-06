"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { connectionStatus, TAP_PROMPT } from "@/lib/connection-status";
import { architectureNodes } from "@/lib/site";

const ease = [0.16, 1, 0.3, 1] as const;

type Point = { x: number; y: number };

function toView(node: { x: number; y: number }): Point {
  return { x: node.x * 10, y: node.y * 6.4 };
}

export function ArchitectureDiagram() {
  const reduce = useReducedMotion();
  const [selected, setSelected] = useState<number | null>(null);
  const points = architectureNodes.map(toView);
  const origin = selected === null ? null : architectureNodes[selected];
  const originPoint = selected === null ? null : points[selected];

  function choose(index: number) {
    setSelected((current) => (current === index ? null : index));
  }

  return (
    <div className="mt-14">
      <div className="mb-4">
        <p className="font-mono text-[10px] tracking-[0.18em] text-faint">{TAP_PROMPT}</p>
        <p
          className={
            origin
              ? "mt-2 font-mono text-[10px] tracking-[0.18em] text-faint"
              : "sr-only"
          }
          aria-live="polite"
        >
          {connectionStatus(origin)}
        </p>
      </div>

      <div className="relative hidden h-[520px] border border-line xl:block xl:h-[560px]">
        <div className="pointer-events-none absolute inset-x-4 top-3 flex justify-between" aria-hidden>
          {Array.from({ length: 9 }, (_, index) => (
            <span key={index} className="h-2 w-px bg-line" />
          ))}
        </div>
        <svg
          viewBox="0 0 1000 640"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden
        >
          {originPoint &&
            points.map((point, index) => {
              if (index === selected) return null;
              return (
                <motion.line
                  key={`${selected}-${index}`}
                  x1={originPoint.x}
                  y1={originPoint.y}
                  x2={point.x}
                  y2={point.y}
                  stroke="#8fd0dc"
                  strokeWidth="1.25"
                  vectorEffect="non-scaling-stroke"
                  initial={reduce ? { opacity: 1 } : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: reduce ? 0 : 0.35,
                    delay: reduce ? 0 : index * 0.04,
                    ease,
                  }}
                />
              );
            })}
          {originPoint && (
            <circle cx={originPoint.x} cy={originPoint.y} r="3.5" fill="#d4b072" />
          )}
        </svg>
        <div role="group" aria-label="System nodes" className="absolute inset-0">
          {architectureNodes.map((node, index) => {
            const active = selected === index;
            const linked = selected !== null && !active;
            return (
              <button
                key={node.id}
                type="button"
                aria-pressed={active}
                onClick={() => choose(index)}
                className={`absolute z-10 max-w-[8.75rem] -translate-x-1/2 -translate-y-1/2 border bg-canvas px-3 py-2 text-left ${
                  active ? "border-gold" : linked ? "border-cyan" : "border-line"
                }`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <p className="font-mono text-[10px] tracking-[0.16em] text-cyan">{node.id}</p>
                <p className="mt-1 text-[12px] leading-tight tracking-[0.05em] text-ink">{node.label}</p>
                <p className="mt-1 font-mono text-[9px] tracking-[0.16em] text-gold">
                  {active ? "ORIGIN" : linked ? "LINKED" : "NODE"}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <ol className="relative xl:hidden">
        <div
          className={`absolute top-3 bottom-3 left-[7px] w-px bg-cyan ${
            selected === null ? "opacity-0" : "opacity-100"
          }`}
          style={{ transition: reduce ? "none" : "opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1)" }}
          aria-hidden
        />
        {architectureNodes.map((node, index) => {
          const active = selected === index;
          const linked = selected !== null && !active;
          return (
            <li key={node.id} className="relative pb-3 last:pb-0">
              <button
                type="button"
                aria-pressed={active}
                onClick={() => choose(index)}
                className="relative flex min-h-14 w-full items-center gap-4 py-2 pl-10 text-left"
              >
                <span
                  className={`absolute top-1/2 left-0 z-10 h-4 w-4 -translate-y-1/2 border bg-canvas ${
                    active ? "border-gold bg-gold" : linked ? "border-cyan" : "border-line"
                  }`}
                  aria-hidden
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] tracking-[0.16em] text-cyan">{node.id}</span>
                  <span className="mt-1 block text-xl tracking-[-0.03em] text-ink">{node.label}</span>
                </span>
                <span className="shrink-0 font-mono text-[10px] tracking-[0.16em] text-gold">
                  {active ? "ORIGIN" : linked ? "LINKED" : ""}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
