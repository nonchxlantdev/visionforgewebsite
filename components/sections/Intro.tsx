import type { ReactNode } from "react";
import { home } from "@/lib/site";

/** Sets each listed phrase in `text` in reef blue. */
function highlight(text: string, phrases: readonly string[]): ReactNode[] {
  const pattern = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return text.split(pattern).map((part, i) =>
    phrases.includes(part) ? (
      <span key={i} className="text-brand">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

/** The hero's longer copy, moved below the fold as one large statement. */
export function Intro() {
  return (
    <section aria-label="What Vision Forge does" className="px-5 py-24 sm:px-8 md:py-32">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 lg:flex-row lg:items-end lg:gap-20">
        <p className="font-display text-[clamp(1.625rem,3vw,2.375rem)] leading-[1.25] font-medium tracking-[-0.025em] text-ink lg:flex-[2]">
          {highlight(home.detail, home.capabilities)}
        </p>
        <p className="text-[16px] leading-relaxed text-body lg:flex-1">{home.detailMore}</p>
      </div>
    </section>
  );
}
