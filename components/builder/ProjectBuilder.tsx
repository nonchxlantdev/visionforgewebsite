"use client";

import { Check } from "lucide-react";
import { useId, useState, type MouseEvent, type ReactNode } from "react";
import { useSparks } from "@/components/forge/SparkField";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  BUDGETS,
  BUSINESSES,
  EMPTY_STATE,
  isComplete,
  NEEDS,
  TIMINGS,
  toggleNeed,
  type BuilderState,
} from "@/lib/project-builder";
import { site } from "@/lib/site";
import { ProjectCard } from "./ProjectCard";

function Chip({
  pressed,
  onClick,
  children,
  hint,
}: {
  pressed: boolean;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  children: ReactNode;
  hint?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`group inline-flex min-h-12 items-center gap-2.5 border px-4 py-2.5 text-left text-[15px] transition-[border-color,background-color,box-shadow,color] duration-200 active:scale-[0.98] ${
        pressed
          ? "border-molten bg-[#2b1a10] text-whitehot shadow-[0_0_24px_rgba(255,90,31,0.35)]"
          : "border-line bg-soot/60 text-chrome hover:border-molten/60"
      }`}
    >
      <span
        aria-hidden
        className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
          pressed ? "border-molten bg-molten text-on-molten" : "border-chrome/30"
        }`}
      >
        {pressed ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
      </span>
      <span>
        <span className="block">{children}</span>
        {hint ? <span className="block text-[12px] text-ash">{hint}</span> : null}
      </span>
    </button>
  );
}

function Step({ n, title, note, children }: { n: number; title: string; note?: string; children: ReactNode }) {
  const id = useId();
  return (
    <div className="border-t border-line pt-6 first:border-t-0 first:pt-0">
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend id={id} className="flex items-baseline gap-3">
        <span className="font-mono text-[11px] tracking-[0.18em] text-molten">0{n}</span>
        <span className="font-display text-[1.7rem] leading-none font-bold uppercase text-chrome">{title}</span>
        {note ? <span className="font-mono text-[10px] tracking-[0.14em] text-ash uppercase">{note}</span> : null}
      </legend>
      <div role="group" aria-labelledby={id} className="mt-4 flex flex-wrap gap-2.5">
        {children}
      </div>
    </fieldset>
    </div>
  );
}

export function ProjectBuilder() {
  const [state, setState] = useState<BuilderState>(EMPTY_STATE);
  const { emit } = useSparks();
  const set = (patch: Partial<BuilderState>, event: MouseEvent<HTMLButtonElement>) => {
    const next = { ...state, ...patch };
    if (!isComplete(state) && isComplete(next)) {
      const r = event.currentTarget.getBoundingClientRect();
      emit({ x: r.left + r.width / 2, y: r.top + r.height / 2, count: 28, power: 0.85 });
    }
    setState(next);
  };

  return (
    <section id="build" className="scroll-mt-20 border-t border-line px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading kicker="Build your project · 30 seconds" lines={["Tell us what", "you need."]} hotLines={[1]}>
          Tap your answers and we&apos;ll show what we&apos;d build, the typical price and how long it takes. Then send it
          to us in one tap. Nothing is sent until you press send.
        </SectionHeading>

        <noscript>
          <p className="mt-8 text-base text-chrome">
            Message us on{" "}
            <a className="text-molten underline" href={site.whatsapp.href} rel="noopener noreferrer" target="_blank">
              WhatsApp
            </a>{" "}
            and tell us what you need.
          </p>
        </noscript>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_0.85fr] lg:items-start lg:gap-12">
          <div className="space-y-8">
            <Step n={1} title="What kind of business?">
              {BUSINESSES.map((b) => (
                <Chip key={b.id} pressed={state.business === b.id} onClick={(e) => set({ business: b.id }, e)}>
                  {b.label}
                </Chip>
              ))}
            </Step>
            <Step n={2} title="What do you need?" note="Pick any">
              {NEEDS.map((n) => (
                <Chip
                  key={n.id}
                  pressed={state.needs.includes(n.id)}
                  onClick={(e) => set({ needs: toggleNeed(state.needs, n.id) }, e)}
                >
                  {n.label}
                </Chip>
              ))}
            </Step>
            <Step n={3} title="What's your budget?" note="Optional">
              {BUDGETS.map((b) => (
                <Chip key={b.id} pressed={state.budget === b.id} onClick={(e) => set({ budget: b.id }, e)} hint={b.hint}>
                  {b.label}
                </Chip>
              ))}
            </Step>
            <Step n={4} title="When do you need it?" note="Optional">
              {TIMINGS.map((t) => (
                <Chip key={t.id} pressed={state.timing === t.id} onClick={(e) => set({ timing: t.id }, e)}>
                  {t.label}
                </Chip>
              ))}
            </Step>
          </div>

          <div className="lg:sticky lg:top-[calc(var(--nav-h)+1.5rem)]">
            <ProjectCard state={state} onReset={() => setState(EMPTY_STATE)} />
          </div>
        </div>
      </div>
    </section>
  );
}
