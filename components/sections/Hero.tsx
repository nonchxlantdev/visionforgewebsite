import { CtaLink } from "@/components/ui/CtaLink";
import { Label } from "@/components/ui/Label";
import { Logo } from "@/components/ui/Logo";
import { hero } from "@/lib/site";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="overflow-hidden border-b border-line">
      <div className="mx-auto grid max-w-[1240px] items-center gap-12 px-5 pt-14 pb-16 sm:px-8 md:pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:px-10 lg:pb-24">
        <div>
          <Label>{hero.kicker}</Label>
          <h1
            id="hero-title"
            className="font-wide mt-6 text-[clamp(2.6rem,6.4vw,4.75rem)] leading-[0.98] font-extrabold tracking-[-0.03em] text-steel-hi"
          >
            {hero.title[0]}
            <br />
            {hero.title[1]} <span className="text-gold">{hero.goldWord}</span>
          </h1>
          <p className="mt-7 max-w-xl text-[clamp(1.0625rem,1.6vw,1.25rem)] text-steel-2">{hero.lede}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <CtaLink href={hero.primary.href} arrow>
              {hero.primary.label}
            </CtaLink>
            <CtaLink href={hero.secondary.href} variant="ghost">
              {hero.secondary.label}
            </CtaLink>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-7 gap-y-2">
            {hero.meta.map((item) => (
              <li key={item} className="label text-steel-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[520px]">
          <div aria-hidden className="emblem-halo absolute -inset-10" />
          <div className="relative">
            <Logo priority className="h-auto w-full" sizes="(min-width: 1024px) 470px, 80vw" />
            <span aria-hidden className="emblem-glint" />
          </div>
          <p className="label mt-4 text-right text-steel-2">{hero.stamp}</p>
        </div>
      </div>
    </section>
  );
}
