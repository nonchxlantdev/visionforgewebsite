"use client";

import {
  Building2,
  CalendarCheck,
  ChartColumn,
  CircleAlert,
  ClipboardCheck,
  Globe,
  LayoutDashboard,
  Plug,
  ShoppingBag,
  Smartphone,
  Store,
} from "lucide-react";
import { useId, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { CtaLink } from "@/components/ui/CtaLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LaptopExample, PhoneExample } from "@/components/visuals/Examples";
import { doors } from "@/lib/site";

const buildIcons = {
  small: [Globe, ShoppingBag, CalendarCheck, Smartphone],
  company: [LayoutDashboard, ClipboardCheck, ChartColumn, Plug],
} as const;
const tabIcons = { small: Store, company: Building2 } as const;

const noop = () => () => {};
/** False during server render and before hydration, so without JS both panels stay visible. */
const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);

export function Doors() {
  const [active, setActive] = useState(0);
  const hydrated = useHydrated();
  const id = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const last = doors.length - 1;
    const next =
      event.key === "Home" ? 0 : event.key === "End" ? last : (active + (event.key === "ArrowRight" ? 1 : -1) + doors.length) % doors.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="what" className="scroll-mt-20 border-t border-line px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading kicker="What we build" lines={["Which sounds", "like you?"]} hotLines={[1]} />

        <div role="tablist" aria-label="Choose your type of business" className="mt-10 grid gap-3 sm:grid-cols-2">
          {doors.map((door, index) => {
            const selected = index === active;
            const Icon = tabIcons[door.id];
            return (
              <button
                key={door.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`${id}-tab-${door.id}`}
                aria-selected={selected}
                aria-controls={`${id}-panel-${door.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActive(index)}
                onKeyDown={onKey}
                className={`group flex min-h-24 items-start gap-4 border p-5 text-left transition-[border-color,background-color,box-shadow] duration-300 sm:p-6 ${
                  selected
                    ? "border-molten bg-[#211611] shadow-[0_0_40px_rgba(255,90,31,0.2)]"
                    : "border-line bg-soot/50 hover:border-molten/60"
                }`}
              >
                <Icon
                  aria-hidden
                  strokeWidth={1.6}
                  className={`mt-1 h-7 w-7 shrink-0 ${selected ? "text-molten" : "text-ash group-hover:text-molten"}`}
                />
                <span>
                  <span className="block font-display text-[1.9rem] leading-none font-bold uppercase text-chrome sm:text-[2.2rem]">
                    {door.tab}
                  </span>
                  <span className="mt-2 block text-[15px] text-ash">{door.tabHint}</span>
                </span>
              </button>
            );
          })}
        </div>

        {doors.map((door, index) => {
          const hidden = hydrated && index !== active;
          const Example = door.id === "small" ? PhoneExample : LaptopExample;
          return (
            <div
              key={door.id}
              role="tabpanel"
              id={`${id}-panel-${door.id}`}
              aria-labelledby={`${id}-tab-${door.id}`}
              hidden={hidden}
              className="mt-6 grid gap-10 border border-line bg-forge/60 p-5 sm:p-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12 lg:p-10"
            >
              <div>
                <h3 className="font-mono text-[11px] tracking-[0.2em] text-molten uppercase">Sound familiar?</h3>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {door.problems.map((problem) => (
                    <li key={problem} className="flex items-start gap-3 text-base text-chrome/90">
                      <CircleAlert aria-hidden strokeWidth={1.75} className="mt-0.5 h-5 w-5 shrink-0 text-ember" />
                      {problem}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-10 font-mono text-[11px] tracking-[0.2em] text-molten uppercase">What we build</h3>
                <ul className="mt-4 grid gap-px border border-line bg-line sm:grid-cols-2">
                  {door.builds.map((item, i) => {
                    const Icon = buildIcons[door.id][i];
                    return (
                      <li key={item.title} className="bg-soot p-5 transition-colors duration-300 hover:bg-[#211611]">
                        <Icon aria-hidden strokeWidth={1.6} className="h-6 w-6 text-molten" />
                        <p className="mt-3 font-display text-2xl leading-none font-bold uppercase text-chrome">{item.title}</p>
                        <p className="mt-2 text-[15px] leading-relaxed text-ash">{item.copy}</p>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-mono text-[12px] tracking-[0.12em] text-chrome uppercase">{door.typical}</p>
                  <CtaLink href="#build">Build your project</CtaLink>
                </div>
              </div>

              <figure className="self-center">
                <Example />
                <figcaption className="mt-4 text-center font-mono text-[10px] tracking-[0.18em] text-ash uppercase">
                  {door.example}
                </figcaption>
              </figure>
            </div>
          );
        })}
      </div>
    </section>
  );
}
