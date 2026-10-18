import { Check } from "lucide-react";
import { HubScene } from "@/components/sections/HubScene";
import { CtaLink } from "@/components/ui/CtaLink";
import { home } from "@/lib/site";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="on-dark relative overflow-hidden bg-ink bg-[radial-gradient(70%_60%_at_50%_70%,#1d2c46_0%,#0b1626_70%)]"
    >
      <div className="mx-auto max-w-[1180px] px-5 pt-14 sm:px-8 md:pt-20 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            id="hero-title"
            className="font-display text-[clamp(2.4rem,5.6vw,4rem)] leading-[1.05] font-extrabold tracking-[-0.035em] text-balance text-paper"
          >
            {home.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-[54ch] text-[1.125rem] text-on-ink-2 md:text-[1.25rem]">{home.lede}</p>
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
