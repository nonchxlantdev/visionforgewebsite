"use client";

import { useEffect, useRef, useState } from "react";
import { ProcessScene } from "@/components/sections/process/ProcessScene";
import { howWeWorkSteps } from "@/lib/site";

type Variant = "compact" | "full";

const STEP_HEIGHT: Record<Variant, string> = {
  compact: "lg:min-h-[38vh]",
  full: "lg:min-h-[56vh]",
};

/**
 * The seven steps with a picture that changes as you scroll.
 * Desktop: steps on the left, the picture pinned on the right; the step
 * crossing the middle of the screen is the active one.
 * Phones: each step carries its own still picture; nothing is pinned.
 */
export function ProcessScroll({ variant = "compact" }: { variant?: Variant }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLLIElement | null>>([]);
  const total = howWeWorkSteps.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step ?? 0));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    for (const el of stepRefs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mt-12 lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
      <ol className="relative flex flex-col gap-10 lg:gap-0">
        {/* Progress rail (desktop) */}
        <span aria-hidden className="absolute top-5 bottom-5 left-5 hidden w-px bg-line lg:block" />
        <span
          aria-hidden
          className="absolute top-5 left-5 hidden w-px bg-brand transition-[height] duration-500 motion-reduce:transition-none lg:block"
          style={{ height: `calc((100% - 2.5rem) * ${active / Math.max(1, total - 1)})` }}
        />
        {howWeWorkSteps.map((step, index) => {
          const isActive = index === active;
          return (
            <li
              key={step.title}
              ref={(el) => {
                stepRefs.current[index] = el;
              }}
              data-step={index}
              aria-current={isActive ? "step" : undefined}
              className={`relative flex flex-col lg:justify-center ${STEP_HEIGHT[variant]}`}
            >
              <div className="flex gap-5">
                <span
                  className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-[16px] font-semibold tabular-nums transition-colors duration-300 motion-reduce:transition-none ${
                    isActive ? "bg-brand text-paper" : "bg-mist text-muted"
                  }`}
                >
                  {index + 1}
                </span>
                <div className="pt-1.5">
                  <h3
                    className={`font-display leading-snug font-semibold tracking-[-0.02em] text-ink ${
                      variant === "full" ? "text-[1.5rem] md:text-[1.75rem]" : "text-[1.25rem] md:text-[1.375rem]"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-[44ch] text-[16px] leading-relaxed text-body">{step.copy}</p>
                </div>
              </div>
              <ProcessScene step={index} size="card" className="mt-5 lg:hidden" />
            </li>
          );
        })}
      </ol>

      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--nav-h)+2.5rem)]">
          <ProcessScene step={active} size="panel" />
          <p aria-hidden className="mt-4 font-mono text-[12px] tracking-[0.04em] text-muted uppercase">
            {active + 1} / {total} · {howWeWorkSteps[active].title}
          </p>
        </div>
      </div>
    </div>
  );
}
