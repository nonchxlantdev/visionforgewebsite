"use client";

import { Check, RotateCcw, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DEMO_RECEIPT_TITLE, DEMO_STEPS, minutesAfter } from "@/lib/demo";

const STEP_MS = 650;
const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Home-page teaser: the handwritten receipt gets struck through as each step is automated. */
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
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <p className="label text-gold">On the workbench</p>
        <h2
          id="bench-title"
          className="font-wide mt-4 max-w-3xl text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.02] font-bold tracking-[-0.02em] text-steel-hi"
        >
          Every order you write by hand is an hour you never get back.
        </h2>

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
          <figure className="paper-torn mx-auto w-full max-w-[460px] -rotate-2 bg-paper px-7 pt-6 pb-10 text-paper-ink shadow-[0_30px_60px_rgba(0,0,0,0.55)]">
            <figcaption className="label text-paper-ink-2">Tuesday · by hand</figcaption>
            <p className="mt-3 font-hand text-[27px] leading-[1.3]">{DEMO_RECEIPT_TITLE}</p>
            <ul className="mt-1 font-hand text-[27px] leading-[1.3]">
              {DEMO_STEPS.map((step, i) => (
                <li key={step.note}>
                  <span className="strike" data-struck={i < done}>
                    {step.note}
                  </span>
                </li>
              ))}
            </ul>
          </figure>

          <div className="flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={done >= total ? reset : automate}
              disabled={running}
              className="inline-flex min-h-12 items-center gap-2 rounded-[4px] bg-gold px-5 text-[15px] font-semibold text-on-gold transition-colors hover:bg-gold-hi disabled:cursor-wait disabled:opacity-70"
            >
              {done >= total ? (
                <>
                  <RotateCcw aria-hidden className="h-4 w-4" /> Do it by hand again
                </>
              ) : (
                <>
                  <Zap aria-hidden className="h-4 w-4" /> Automate it
                </>
              )}
            </button>
            <svg aria-hidden width="96" height="24" viewBox="0 0 96 24" className="hidden rotate-0 lg:block">
              <path d="M2 14 Q 44 -4 86 12" stroke="var(--gold)" strokeWidth="2" fill="none" />
              <path d="M80 5 L88 12 L79 18" stroke="var(--gold)" strokeWidth="2" fill="none" />
            </svg>
          </div>

          <div className="w-full rounded-[6px] border border-line bg-bg-2 p-6 sm:p-7">
            <p className="label text-steel-2">Order #1042 · handled automatically</p>
            <ul className="mt-3">
              {DEMO_STEPS.map((step, i) => {
                const on = i < done;
                return (
                  <li key={step.auto} className="flex min-h-12 items-center justify-between gap-4 border-b border-line py-2.5">
                    {on ? (
                      <span className="stamp-in flex items-center gap-3 text-[16px] text-steel-hi">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-done text-bg">
                          <Check aria-hidden className="h-3.5 w-3.5" strokeWidth={3} />
                        </span>
                        {step.auto}
                      </span>
                    ) : (
                      <span className="flex items-center gap-3 text-[16px] text-steel-2">
                        <span className="h-6 w-6 rounded-full border border-dashed border-line-2" />
                        {step.auto}
                      </span>
                    )}
                    <span className="font-mono text-[12px] text-gold">{on ? "9:41" : "—"}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 flex items-baseline justify-between">
              <span className="font-wide text-[22px] font-bold text-steel-hi">Your time</span>
              <span aria-hidden className={`font-wide text-[28px] font-extrabold tabular-nums ${done >= total ? "text-gold" : "text-steel-hi"}`}>
                {minutes} min
              </span>
            </div>
            <p className="sr-only" aria-live="polite">
              {done >= total ? "Automated: every step done, 0 minutes of your time." : ""}
            </p>
            <p className="mt-3 text-[12px] text-steel-2">Example for illustration. Your times will vary.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
