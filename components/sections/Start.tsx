"use client";

import { Check } from "lucide-react";
import { useId, useState, type ReactNode } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BUDGETS, EMPTY_STATE, PROBLEMS, toggleProblem, type StartState } from "@/lib/project-builder";
import { site } from "@/lib/site";
import { StartCard } from "./StartCard";

function Chip({ pressed, onClick, children }: { pressed: boolean; onClick(): void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-[15px] font-medium transition-[background-color,border-color,color] duration-200 active:scale-[0.98] ${
        pressed ? "border-accent bg-accent text-white" : "border-hairline bg-page text-ink hover:border-ink/40"
      }`}
    >
      {pressed ? <Check aria-hidden className="h-4 w-4" strokeWidth={2.5} /> : null}
      {children}
    </button>
  );
}

function ChipGroup({ title, note, children }: { title: string; note: string; children: ReactNode }) {
  const id = useId();
  return (
    <div>
      <h3 id={id} className="flex items-baseline gap-3 text-[19px] font-semibold tracking-[-0.015em] text-ink">
        {title}
        <span className="text-[14px] font-normal text-ink-2">{note}</span>
      </h3>
      <div role="group" aria-labelledby={id} className="mt-4 flex flex-wrap gap-2.5">
        {children}
      </div>
    </div>
  );
}

export function Start() {
  const [state, setState] = useState<StartState>(EMPTY_STATE);

  return (
    <section id="start" aria-labelledby="start-title" className="scroll-mt-14 bg-canvas px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          id="start-title"
          kicker="Your turn"
          title="What's slowing your business down?"
          lede="Tap everything that sounds familiar. We'll suggest where to start, and you can send it to us in one tap. Nothing is sent until you press send."
        />

        <noscript>
          <p className="mt-8 text-center text-[17px] text-ink">
            Message us on{" "}
            <a className="text-link underline" href={site.whatsapp.href} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>{" "}
            and tell us what&apos;s slowing you down.
          </p>
        </noscript>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <div className="space-y-10 rounded-[28px] bg-page p-6 sm:p-10">
            <ChipGroup title="What's slowing you down?" note="Pick any">
              {PROBLEMS.map((p) => (
                <Chip
                  key={p.id}
                  pressed={state.problems.includes(p.id)}
                  onClick={() => setState((s) => ({ ...s, problems: toggleProblem(s.problems, p.id) }))}
                >
                  {p.label}
                </Chip>
              ))}
            </ChipGroup>
            <ChipGroup title="Your budget" note="Optional">
              {BUDGETS.map((b) => (
                <Chip
                  key={b.id}
                  pressed={state.budget === b.id}
                  onClick={() => setState((s) => ({ ...s, budget: s.budget === b.id ? "unsure" : b.id }))}
                >
                  {b.label}
                </Chip>
              ))}
            </ChipGroup>
          </div>

          <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
            <StartCard state={state} onReset={() => setState(EMPTY_STATE)} />
          </div>
        </div>
      </div>
    </section>
  );
}
