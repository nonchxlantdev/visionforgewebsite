"use client";

import { Check, RotateCcw, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ctaClassName } from "@/components/ui/CtaLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { DEMO_RECEIPT_TITLE, DEMO_STEPS, minutesAfter } from "@/lib/demo";

const STEP_MS = 650;
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** One customer order, done by hand and then handled for you. Only moves when the visitor presses the button. */
export function Workbench() {
  const [done, setDone] = useState(0);
  const timersRef = useRef<number[]>([]);
  const total = DEMO_STEPS.length;
  const running = done > 0 && done < total;

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.splice(0).forEach((id) => window.clearTimeout(id));
  }, []);

  const automate = () => {
    const timers = timersRef.current;
    timers.splice(0).forEach((id) => window.clearTimeout(id));
    if (prefersReducedMotion()) {
      setDone(total);
      return;
    }
    setDone(0);
    DEMO_STEPS.forEach((_, i) => timers.push(window.setTimeout(() => setDone(i + 1), STEP_MS * (i + 1))));
  };

  const reset = () => {
    timersRef.current.splice(0).forEach((id) => window.clearTimeout(id));
    setDone(0);
  };

  const minutes = minutesAfter("auto", done);

  return (
    <section aria-labelledby="bench-title" className="border-b border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="bench-title"
          title="Every order you handle by hand is time you never get back."
          lede="Here's one customer order, done by hand and then handled for you. Press the button to see the difference."
        />

        <div className="mt-12 grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
          <figure className="rounded-lg border border-line bg-mist p-7">
            <figcaption className="text-[15px] text-muted">Tuesday, by hand</figcaption>
            <p className="mt-3 font-serif text-[1.25rem] font-semibold text-ink">{DEMO_RECEIPT_TITLE}</p>
            <ul className="mt-3 space-y-2">
              {DEMO_STEPS.map((step, i) => (
                <li key={step.manual}>
                  <span className="strike" data-struck={i < done}>
                    {step.manual}
                  </span>
                </li>
              ))}
            </ul>
          </figure>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={done >= total ? reset : automate}
              disabled={running}
              className={ctaClassName("primary", "disabled:cursor-wait disabled:opacity-80")}
            >
              {done >= total ? (
                <>
                  <RotateCcw aria-hidden className="h-4 w-4" /> Do it by hand again
                </>
              ) : (
                <>
                  <Zap aria-hidden className="h-4 w-4" /> Handle it for me
                </>
              )}
            </button>
          </div>

          <div className="rounded-lg border border-line bg-paper p-7">
            <p className="text-[15px] text-muted">Order #1042, handled for you</p>
            <ul className="mt-3">
              {DEMO_STEPS.map((step, i) => {
                const on = i < done;
                return (
                  <li key={step.auto} className="flex min-h-12 items-center gap-3 border-b border-line py-2.5 last:border-b-0">
                    {on ? (
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success text-paper">
                        <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="h-6 w-6 shrink-0 rounded-full border border-dashed border-muted/50" />
                    )}
                    <span className={on ? "text-ink" : "text-muted"}>{step.auto}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
              <span className="font-serif text-[1.25rem] font-semibold text-ink">Your time</span>
              <span aria-hidden className="font-serif text-[1.75rem] font-semibold text-ink tabular-nums">
                {minutes} min
              </span>
            </div>
            <p className="sr-only" aria-live="polite">
              {done >= total ? "Handled for you: every step done, 0 minutes of your time." : ""}
            </p>
            <p className="mt-3 text-[14px] text-muted">Example for illustration. Your times will vary.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
