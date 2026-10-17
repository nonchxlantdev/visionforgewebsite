import { Check } from "lucide-react";
import { CtaLink } from "@/components/ui/CtaLink";
import { Logo } from "@/components/ui/Logo";
import { home } from "@/lib/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="border-b border-line">
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 px-5 pt-14 pb-16 sm:px-8 md:pt-20 lg:grid-cols-[1.4fr_0.6fr] lg:px-10 lg:pb-24">
        <div>
          <h1
            id="hero-title"
            className="max-w-[18ch] font-serif text-[clamp(2.5rem,6vw,3.75rem)] leading-[1.08] font-semibold tracking-[-0.015em] text-balance text-ink"
          >
            {home.headline}
          </h1>
          <p className="mt-6 max-w-[56ch] text-[1.125rem] text-body md:text-[1.25rem]">{home.lede}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <CtaLink href={home.primary.href}>{home.primary.label}</CtaLink>
            <CtaLink href={home.secondary.href} variant="secondary">
              {home.secondary.label}
            </CtaLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-muted">
            {home.trust.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check aria-hidden className="h-4 w-4 text-mahogany" strokeWidth={2.25} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="hidden rounded-2xl bg-mist p-10 lg:block">
          <Logo priority className="h-auto w-full" sizes="260px" />
        </div>
      </div>
    </section>
  );
}
