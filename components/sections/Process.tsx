"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Billet, stageHeat } from "@/components/visuals/Billet";
import { heatColor } from "@/lib/heat";
import { processSteps } from "@/lib/site";
import { useReducedMotionPref } from "@/components/forge/useHeat";

const ease = [0.16, 1, 0.3, 1] as const;
const TEMPS = ["1,250°C", "1,050°C", "900°C", "450°C", "25°C"];

function Thermometer({ stage }: { stage: number }) {
  const h = stageHeat(stage);
  return (
    <div className="flex items-end gap-3" aria-hidden>
      <div className="relative h-56 w-3 overflow-hidden border border-line bg-forge">
        <div
          className="absolute inset-x-0 bottom-0 transition-[height,background-color] duration-700"
          style={{
            height: `${12 + h * 88}%`,
            background: h < 0.05 ? "#6b6560" : `linear-gradient(0deg, ${heatColor(h * 0.4)}, ${heatColor(h)})`,
            boxShadow: `0 0 ${Math.round(h * 20)}px ${heatColor(h)}`,
          }}
        />
      </div>
      <span className="font-mono text-sm tabular-nums text-chrome">{TEMPS[stage]}</span>
    </div>
  );
}

function PinnedProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStage(Math.min(4, Math.floor(v * 5)));
  });
  const step = processSteps[stage];

  return (
    <div ref={ref} className="relative h-[400vh]">
      <div className="sticky top-[var(--nav-h)] flex h-[calc(100vh-var(--nav-h))] items-center">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-[1.1fr_0.9fr] items-center gap-12 px-10">
          <div>
            <SectionHeading kicker="Process" lines={["Heat. Shape.", "Strike. Temper.", "Ship."]} hotLines={[2]} />
            <div className="mt-10 flex items-center gap-8">
              <Thermometer stage={stage} />
              <Billet stage={stage} className="h-auto w-full max-w-xl" />
            </div>
          </div>
          <div>
            <ol className="flex gap-2" aria-hidden>
              {processSteps.map((s, i) => (
                <li
                  key={s.index}
                  className={`flex-1 border-t-2 pt-2 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-500 ${
                    i <= stage ? "border-molten text-chrome" : "border-line text-ash/60"
                  }`}
                >
                  {s.name}
                </li>
              ))}
            </ol>
            <div className="relative mt-10 min-h-[17rem]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={step.index}
                  className="absolute inset-x-0 top-0"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
                  transition={{ duration: 0.4, ease }}
                >
                  <p className="font-mono text-[11px] tracking-[0.2em] text-molten uppercase">
                    {step.index} · {step.classic}
                  </p>
                  <h3 className="mt-3 font-display text-[6.5rem] leading-[0.85] font-black uppercase">
                    <span className={stage < 4 ? "hot-text" : "chrome-text"}>{step.name}</span>
                  </h3>
                  <p className="mt-5 max-w-md text-lg leading-relaxed text-chrome/90">{step.copy}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      {/* Readable list for assistive tech; the animated panel above is decorative. */}
      <ol className="sr-only">
        {processSteps.map((s) => (
          <li key={s.index}>
            {s.name} ({s.classic}): {s.copy}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ListProcess() {
  return (
    <div className="px-4 py-24 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading kicker="Process" lines={["Heat. Shape.", "Strike. Temper.", "Ship."]} hotLines={[2]} />
        <ol className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 xl:grid-cols-5">
          {processSteps.map((s, i) => (
            <li key={s.index} className="bg-forge p-5">
              <Billet stage={i} className="h-auto w-full max-w-[14rem]" />
              <p className="mt-4 font-mono text-[11px] tracking-[0.2em] text-molten uppercase">
                {s.index} · {s.classic}
              </p>
              <h3 className="mt-2 font-display text-5xl leading-none font-black uppercase">
                <span className={i < 4 ? "hot-text" : "chrome-text"}>{s.name}</span>
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ash">{s.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

export function Process() {
  const reduce = useReducedMotionPref();
  return (
    <section id="process" className="relative scroll-mt-20 border-t border-line">
      <div className={reduce ? "hidden" : "hidden lg:block"}>
        <PinnedProcess />
      </div>
      <div className={reduce ? "" : "lg:hidden"}>
        <ListProcess />
      </div>
    </section>
  );
}
