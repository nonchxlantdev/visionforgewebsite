import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { HubScene } from "@/components/sections/HubScene";
import { CtaLink } from "@/components/ui/CtaLink";
import { home } from "@/lib/site";

/** Wraps each listed phrase in `text` so it reads brighter than the sentence around it. */
function highlight(text: string, phrases: readonly string[]): ReactNode[] {
  const pattern = new RegExp(`(${phrases.map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`);
  return text.split(pattern).map((part, i) =>
    phrases.includes(part) ? (
      <span key={i} className="font-semibold text-paper">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative overflow-hidden bg-ink bg-[radial-gradient(70%_60%_at_50%_70%,#1d2c46_0%,#0b1626_70%)]"
    >
      <div className="mx-auto max-w-[1180px] px-5 pt-14 sm:px-8 md:pt-20 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-6 flex flex-col items-center justify-center gap-x-3 gap-y-1 sm:flex-row sm:flex-wrap text-[12px] font-semibold tracking-[0.14em] text-gold uppercase sm:text-[13px]">
            {home.eyebrow.map((item, i) => (
              <span key={item} className="flex items-center gap-x-3">
                {i > 0 ? <span aria-hidden className="hidden h-1 w-1 rounded-full bg-gold/60 sm:block" /> : null}
                {item}
              </span>
            ))}
          </p>
          <h1
            id="hero-title"
            className="bg-gradient-to-b from-paper via-paper to-[#c9d1dc] bg-clip-text font-display text-[clamp(2.4rem,5.6vw,4.25rem)] leading-[1.04] font-extrabold tracking-[-0.035em] text-balance text-transparent"
          >
            {home.headline}
          </h1>
          <span aria-hidden className="mx-auto mt-7 block h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <p className="mx-auto mt-7 max-w-[40ch] font-display text-[1.25rem] leading-snug font-bold text-balance text-paper md:text-[1.5rem]">{home.lede}</p>
          <p className="mx-auto mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-on-ink-2 md:text-[1.0625rem]">
            {highlight(home.detail, home.capabilities)}
          </p>
          <p className="mx-auto mt-3 hidden max-w-[62ch] text-[1rem] leading-relaxed text-on-ink-2 sm:block md:text-[1.0625rem]">{home.detailMore}</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <CtaLink href={home.primary.href} variant="gold">
              {home.primary.label}
            </CtaLink>
            <CtaLink href={home.secondary.href} variant="ghostLight">
              {home.secondary.label}
            </CtaLink>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px] text-on-ink-2">
            {home.trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check aria-hidden className="h-4 w-4 text-gold" strokeWidth={2.25} />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-[1280px] px-2 pb-10 sm:px-6">
        <HubScene />
      </div>
    </section>
  );
}
