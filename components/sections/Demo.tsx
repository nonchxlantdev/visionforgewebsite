"use client";

import { ArrowDown, Check, Clock, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  DEMO_ORDER,
  DEMO_REPLY,
  DEMO_STEPS,
  MANUAL_MINUTES,
  minutesAfter,
  STEP_DELAY_MS,
  type DemoMode,
} from "@/lib/demo";

const modes: ReadonlyArray<{ id: DemoMode; label: string }> = [
  { id: "manual", label: "Manual" },
  { id: "auto", label: "Automate it" },
];

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Phone({ mode, done }: { mode: DemoMode; done: number }) {
  const replied = done >= 3;
  return (
    <div
      aria-hidden
      className="mx-auto w-full max-w-[300px] rounded-[44px] border-[10px] border-panel-3 bg-[#0b141a] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
    >
      <div className="flex items-center gap-3 border-b border-white/10 pb-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25d366]/20 text-[13px] font-semibold text-[#25d366]">
          MC
        </span>
        <div>
          <p className="text-[14px] font-semibold">Maria C.</p>
          <p className="text-[12px] text-panel-ink-2">Customer</p>
        </div>
      </div>
      <div className="flex min-h-[250px] flex-col gap-2 py-5">
        <p className="max-w-[85%] rounded-2xl rounded-tl-md bg-[#202c33] px-3.5 py-2.5 text-[14px] leading-snug">
          {DEMO_ORDER}
          <span className="mt-1 block text-right text-[12px] text-panel-ink-2">9:41</span>
        </p>
        <p
          className={`ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-[#005c4b] px-3.5 py-2.5 text-[14px] leading-snug transition-[opacity,transform] duration-500 ${
            replied ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          {DEMO_REPLY}
          <span className="mt-1 block text-right text-[12px] text-panel-ink-2">{mode === "auto" ? "9:41" : "10:03"}</span>
        </p>
      </div>
      <div className="rounded-full bg-[#202c33] px-4 py-2.5 text-[13px] text-panel-ink-2">Message</div>
    </div>
  );
}

export function Demo() {
  const [mode, setMode] = useState<DemoMode>("manual");
  const [done, setDone] = useState(0);
  const timersRef = useRef<number[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const play = (next: DemoMode) => {
    const timers = timersRef.current;
    timers.splice(0).forEach((id) => window.clearTimeout(id));
    startedRef.current = true;
    setMode(next);
    if (prefersReducedMotion()) {
      setDone(DEMO_STEPS.length);
      return;
    }
    setDone(0);
    DEMO_STEPS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setDone(i + 1), STEP_DELAY_MS[next] * (i + 1)));
    });
  };
  const playRef = useRef(play);
  useEffect(() => {
    playRef.current = play;
  });

  useEffect(() => {
    const node = panelRef.current;
    const timers = timersRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          playRef.current("manual");
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      timers.splice(0).forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const total = DEMO_STEPS.length;
  const minutes = minutesAfter(mode, done);
  const finished = done >= total;

  return (
    <section id="how" aria-labelledby="demo-title" className="scroll-mt-14 px-3 py-4 sm:px-6">
      <div
        ref={panelRef}
        className="mx-auto max-w-[1180px] rounded-[32px] bg-panel px-5 py-16 text-panel-ink sm:px-10 md:py-24 lg:px-16"
      >
        <SectionHeading
          id="demo-title"
          tone="dark"
          kicker="See it work"
          title="One order, two ways."
          lede="Here's a normal WhatsApp order. Watch what happens to it."
        />

        <fieldset className="mx-auto mt-10 flex w-fit gap-1 rounded-full bg-panel-3 p-1">
          <legend className="sr-only">Choose how the order is handled</legend>
          {modes.map((m) => {
            const selected = mode === m.id;
            const Icon = m.id === "manual" ? Clock : Zap;
            return (
              <label
                key={m.id}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-[15px] font-medium transition-colors duration-200 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-link-dark ${
                  selected ? "bg-panel-ink text-panel" : "text-panel-ink-2 hover:text-panel-ink"
                }`}
              >
                <input
                  type="radio"
                  name="demo-mode"
                  value={m.id}
                  checked={selected}
                  onChange={() => play(m.id)}
                  className="sr-only"
                />
                <Icon aria-hidden className="h-4 w-4" strokeWidth={2} />
                {m.label}
              </label>
            );
          })}
        </fieldset>

        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Phone mode={mode} done={done} />

          <div>
            <ol className="relative space-y-3">
              <span aria-hidden className="absolute top-8 bottom-8 left-8 w-px bg-white/10">
                <span
                  className="block h-full w-full origin-top bg-done transition-transform duration-500"
                  style={{ transform: `scaleY(${mode === "auto" ? done / total : 0})` }}
                />
              </span>
              {DEMO_STEPS.map((step, i) => {
                const complete = i < done;
                return (
                  <li
                    key={step.auto}
                    className={`relative flex items-center gap-4 rounded-[20px] bg-panel-2 p-4 transition-opacity duration-500 ${
                      complete ? "opacity-100" : "opacity-55"
                    }`}
                  >
                    <span
                      className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                        complete
                          ? mode === "auto"
                            ? "border-done bg-done text-panel"
                            : "border-panel-ink-2 bg-panel-ink-2 text-panel"
                          : "border-white/20 bg-panel-2 text-transparent"
                      }`}
                    >
                      <Check aria-hidden className="h-4 w-4" strokeWidth={3} />
                    </span>
                    <span className="flex-1 text-[17px] leading-snug">{mode === "manual" ? step.manual : step.auto}</span>
                    <span className="text-[13px] text-panel-ink-2 tabular-nums">
                      {mode === "manual" ? `${step.minutes} min` : "instant"}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-6">
              <p aria-hidden="true" className="flex items-baseline gap-2">
                <span
                  className={`text-[clamp(3rem,7vw,4.5rem)] leading-none font-semibold tracking-[-0.04em] tabular-nums transition-colors duration-300 ${
                    mode === "auto" && finished ? "text-done" : "text-panel-ink"
                  }`}
                >
                  {minutes}
                </span>
                <span className="text-[17px] text-panel-ink-2">min of your time, for one order</span>
              </p>
              <p className="max-w-[16rem] text-[13px] text-panel-ink-2">Example for illustration. Your times will vary.</p>
            </div>
            <p className="sr-only" aria-live="polite">
              {finished
                ? mode === "manual"
                  ? `By hand: ${MANUAL_MINUTES} minutes of your time for one order.`
                  : "Automated: 0 minutes of your time for one order."
                : ""}
            </p>
            <noscript>
              <p className="mt-6 text-[17px] text-panel-ink">
                Automated, every step above happens on its own: 0 minutes of your time for each order.
              </p>
            </noscript>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-[clamp(1.25rem,2.4vw,1.75rem)] font-semibold tracking-[-0.02em] text-balance">
            That&apos;s one order. Multiply it by every order, every day.
          </p>
          <a href="#automate" className="mt-3 inline-flex min-h-11 items-center gap-1.5 text-[17px] text-link-dark hover:underline">
            See what else we automate
            <ArrowDown aria-hidden className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
