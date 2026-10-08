"use client";

import { Check } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { BUDGETS, BUSINESSES, EMPTY_STATE, PROBLEMS, toggleProblem, type StartState } from "@/lib/project-builder";
import { site } from "@/lib/site";
import { WorkTicket } from "./WorkTicket";

function Option({ pressed, onClick, children }: { pressed: boolean; onClick(): void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`flex min-h-13 items-center justify-between gap-3 rounded-[4px] border px-4 py-3 text-left text-[15px] transition-[border-color,background-color,color] duration-200 ${
        pressed ? "border-gold bg-gold/10 text-steel-hi" : "border-line-2 text-steel hover:border-steel-2"
      }`}
    >
      {children}
      <span
        aria-hidden
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border ${pressed ? "border-gold bg-gold text-on-gold" : "border-line-2"}`}
      >
        {pressed ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </span>
    </button>
  );
}

function Step({ n, title, note, children }: { n: string; title: string; note: string; children: ReactNode }) {
  const id = useId();
  return (
    <div className="border-t border-line py-8">
      <h3 id={id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-mono text-[13px] text-gold">{n}</span>
        <span className="font-wide text-[22px] font-bold text-steel-hi">{title}</span>
        <span className="label text-steel-2">{note}</span>
      </h3>
      <div role="group" aria-labelledby={id} className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

export function PricingBuilder() {
  const [state, setState] = useState<StartState>(EMPTY_STATE);

  return (
    <section aria-labelledby="builder-title" className="border-b border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-10">
        <p className="label text-gold">Build your project</p>
        <h2 id="builder-title" className="font-wide mt-4 text-[clamp(1.8rem,3.6vw,2.6rem)] leading-tight font-bold text-steel-hi">
          Tap what fits. Your ticket fills in as you go.
        </h2>
        <noscript>
          <p className="mt-6 text-steel">
            Message us on{" "}
            <a className="text-gold underline" href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>{" "}
            and tell us what&apos;s slowing your business down.
          </p>
        </noscript>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_0.9fr] lg:items-start">
          <div>
            <Step n="01" title="What kind of business?" note="Optional">
              {BUSINESSES.map((b) => (
                <Option
                  key={b.id}
                  pressed={state.business === b.id}
                  onClick={() => setState((s) => ({ ...s, business: s.business === b.id ? null : b.id }))}
                >
                  {b.label}
                </Option>
              ))}
            </Step>
            <Step n="02" title="What's slowing you down?" note="Pick any">
              {PROBLEMS.map((p) => (
                <Option
                  key={p.id}
                  pressed={state.problems.includes(p.id)}
                  onClick={() => setState((s) => ({ ...s, problems: toggleProblem(s.problems, p.id) }))}
                >
                  {p.label}
                </Option>
              ))}
            </Step>
            <Step n="03" title="Your budget" note="Optional">
              {BUDGETS.map((b) => (
                <Option
                  key={b.id}
                  pressed={state.budget === b.id && b.id !== "unsure"}
                  onClick={() => setState((s) => ({ ...s, budget: s.budget === b.id ? "unsure" : b.id }))}
                >
                  {b.label}
                </Option>
              ))}
            </Step>
          </div>
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
            <WorkTicket state={state} onReset={() => setState(EMPTY_STATE)} />
          </div>
        </div>
      </div>
    </section>
  );
}
