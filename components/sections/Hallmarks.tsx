"use client";

import { motion } from "motion/react";
import { useRef } from "react";
import { useSparks } from "@/components/forge/SparkField";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { principles } from "@/lib/site";
import { useReducedMotionPref } from "@/components/forge/useHeat";

export function Hallmarks() {
  const reduce = useReducedMotionPref();
  const { emit } = useSparks();
  const plateRef = useRef<HTMLUListElement>(null);

  const landed = (el: HTMLElement | null) => {
    if (reduce || !el) return;
    const r = el.getBoundingClientRect();
    emit({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 14, power: 0.7 });
    const plate = plateRef.current;
    if (plate) {
      plate.classList.remove("plate-shake");
      void plate.getBoundingClientRect();
      plate.classList.add("plate-shake");
    }
  };

  return (
    <section id="why" className="scroll-mt-20 border-t border-line px-4 py-24 sm:px-6 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading kicker="Why Vision Forge" lines={["Stamped on", "everything we make."]} hotLines={[1]}>
          Real-world experience, modern technology and an honest understanding of how businesses run. These are the
          marks we put on every job.
        </SectionHeading>

        <ul
          ref={plateRef}
          className="brushed mt-14 grid grid-cols-1 gap-px border border-line p-3 shadow-[inset_0_2px_0_rgba(255,255,255,0.05),inset_0_-2px_0_rgba(0,0,0,0.5)] sm:grid-cols-2 sm:p-4 xl:grid-cols-5"
        >
          {principles.map((item, index) => (
            <motion.li
              key={item.support}
              initial={reduce ? false : { opacity: 0, scale: 1.18 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.8 }}
              transition={{ duration: 0.14, delay: reduce ? 0 : index * 0.09, ease: [0.5, 0, 0.75, 0] }}
              onAnimationComplete={() => landed(document.getElementById(`mark-${index}`))}
              id={`mark-${index}`}
              className={`flex min-h-44 flex-col items-center justify-center p-6 text-center ${
                index === principles.length - 1 ? "sm:col-span-2 xl:col-span-1" : ""
              }`}
            >
              <div className="relative flex h-40 w-40 flex-col items-center justify-center rounded-full border-2 border-chrome/30 shadow-[inset_0_3px_6px_rgba(0,0,0,0.6),0_1px_0_rgba(255,255,255,0.08)]">
                <span className="absolute inset-2 rounded-full border border-dashed border-chrome/15" aria-hidden />
                <span className="chrome-text font-display text-[1.7rem] leading-none font-black uppercase">{item.lead}</span>
                <span className="mt-1 font-mono text-[9px] tracking-[0.18em] text-molten uppercase">{item.support}</span>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
