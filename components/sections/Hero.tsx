import { Bell, ChevronRight, FileSpreadsheet, MessageCircle, Receipt, Zap } from "lucide-react";
import { CtaLink } from "@/components/ui/CtaLink";
import { Label } from "@/components/ui/Label";
import { hero, site } from "@/lib/site";

const flowIcons = [MessageCircle, FileSpreadsheet, Receipt, Bell];

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden px-4 pt-16 pb-20 text-center sm:px-6 md:pt-24 md:pb-28">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-[38rem] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(0,113,227,0.09),transparent_70%)]"
      />
      <div className="mx-auto max-w-[1120px]">
        <Label>{hero.kicker}</Label>
        <h1
          id="hero-title"
          className="mx-auto mt-4 max-w-4xl text-[clamp(2.75rem,7.2vw,5.75rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance"
        >
          {hero.title[0]}
          <br />
          <span className="text-gradient">{hero.title[1]}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-[clamp(1.125rem,1.9vw,1.5rem)] leading-[1.4] text-ink-2">{hero.lede}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          <CtaLink href="#how" icon="down">
            {hero.primary}
          </CtaLink>
          <CtaLink href={site.whatsapp.href} external variant="link" icon="right">
            {hero.secondary}
          </CtaLink>
        </div>
        <p className="mt-6 text-[14px] text-ink-2">{hero.trust}</p>

        <ol aria-label="One order, handled automatically" className="mx-auto mt-14 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 sm:gap-x-0">
          {hero.flow.map((step, i) => {
            const Icon = flowIcons[i];
            return (
              <li key={step} className="flex items-center">
                {i > 0 ? <ChevronRight aria-hidden className="mx-1.5 hidden h-4 w-4 text-ink-2/60 sm:block" /> : null}
                <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-page px-4 py-2 text-[14px] font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <Icon aria-hidden className="h-4 w-4 text-accent" strokeWidth={2} />
                  {step}
                </span>
              </li>
            );
          })}
          <li className="flex items-center">
            <ChevronRight aria-hidden className="mx-1.5 hidden h-4 w-4 text-ink-2/60 sm:block" />
            <span className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-[14px] font-medium text-white">
              <Zap aria-hidden className="h-4 w-4 text-done" strokeWidth={2} />
              All on its own
            </span>
          </li>
        </ol>
      </div>
    </section>
  );
}
