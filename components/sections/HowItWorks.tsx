"use client";

import { motion } from "motion/react";
import { useReducedMotionPref } from "@/components/forge/useHeat";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { steps } from "@/lib/site";

export function HowItWorks() {
  const reduce = useReducedMotionPref();
  return (
    <section id="how" className="scroll-mt-20 border-t border-line px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading kicker="How it works" lines={["Four simple", "steps."]} hotLines={[1]}>
          No technical knowledge needed. You tell us about your business; we take care of the rest.
        </SectionHeading>

        <div className="relative mt-14">
          <div aria-hidden className="absolute top-6 right-0 left-0 hidden h-[2px] bg-line md:block">
            <motion.div
              className="h-full origin-left bg-gradient-to-r from-whitehot via-molten to-ember shadow-[0_0_12px_rgba(255,90,31,0.6)]"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: reduce ? 0 : 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
          <ol className="grid gap-8 md:grid-cols-4 md:gap-6">
            {steps.map((step, i) => (
              <li key={step.title} className="relative flex gap-5 md:block">
                <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center border-2 border-molten bg-forge font-display text-2xl font-black text-whitehot shadow-[0_0_20px_rgba(255,90,31,0.35)]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-[2rem] leading-none font-bold uppercase text-chrome md:mt-6">{step.title}</h3>
                  <p className="mt-3 max-w-xs text-base leading-relaxed text-ash">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
