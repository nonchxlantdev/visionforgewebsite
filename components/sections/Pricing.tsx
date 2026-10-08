import { Check } from "lucide-react";
import Link from "next/link";
import { CtaLink } from "@/components/ui/CtaLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { featuredTier, formatBZ, priceNote, tierOrder, tiers } from "@/lib/site";

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-14 px-3 py-4 sm:px-6">
      <div className="mx-auto max-w-[1180px] rounded-[32px] bg-panel px-5 py-16 text-panel-ink sm:px-10 md:py-24 lg:px-16">
        <SectionHeading
          id="pricing-title"
          tone="dark"
          kicker="Pricing"
          title="Start small. Add more when it pays off."
          lede="Every project gets a fixed written quote after a free chat. These are typical starting points."
        />

        <ul className="mt-14 grid gap-4 md:grid-cols-3">
          {tierOrder.map((id) => {
            const t = tiers[id];
            const featured = id === featuredTier;
            return (
              <li
                key={id}
                className={`relative flex flex-col rounded-[24px] bg-panel-2 p-7 ${featured ? "ring-2 ring-link-dark" : ""}`}
              >
                {featured ? (
                  <p className="absolute -top-3 left-7 rounded-full bg-link-dark px-3 py-1 text-[12px] font-semibold text-panel">
                    Where most start
                  </p>
                ) : null}
                <h3 className="text-[21px] font-semibold tracking-[-0.02em]">{t.label}</h3>
                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-[15px] text-panel-ink-2">from</span>
                  <span className="text-[2.75rem] leading-none font-semibold tracking-[-0.04em] tabular-nums">{formatBZ(t.from)}</span>
                  <span aria-hidden className="self-start text-[20px] leading-none text-panel-ink-2">
                    *
                  </span>
                </p>
                <p className="mt-2 text-[15px] text-panel-ink-2">Usually {t.weeks}</p>
                <p className="mt-5 text-[17px] leading-relaxed text-panel-ink/85">{t.copy}</p>
                <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-6 text-[15px] text-panel-ink-2">
                  {t.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-link-dark" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <p className="mx-auto mt-8 max-w-3xl text-center text-[12px] leading-relaxed text-panel-ink-2">
          <span aria-hidden>* </span>
          {priceNote.text}{" "}
          <Link href={priceNote.href} className="underline underline-offset-2 hover:text-panel-ink">
            {priceNote.linkLabel}
          </Link>
        </p>

        <div className="mt-10 text-center">
          <p className="text-[17px] text-panel-ink-2">Not sure which fits?</p>
          <CtaLink href="#start" variant="linkDark" icon="right">
            {"Tell us what's slowing you down"}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
