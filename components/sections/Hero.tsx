import { HubPanel } from "@/components/sections/HubPanel";
import { CtaLink } from "@/components/ui/CtaLink";
import { home } from "@/lib/site";

/** The last two words of the headline ("business forward.") are set in reef blue. */
function splitHeadline(text: string): [string, string] {
  const words = text.split(" ");
  return [words.slice(0, -2).join(" "), words.slice(-2).join(" ")];
}

/**
 * Option B hero: one short screen (trust pill, headline, one line, two buttons),
 * then the hub panel and the three things we do. The longer intro copy lives
 * in <Intro /> just below, so the first screen stays light.
 */
export function Hero() {
  const [lead, tail] = splitHeadline(home.headline);
  return (
    <section aria-labelledby="hero-title" className="px-5 pt-16 sm:px-8 md:pt-24">
      <div className="mx-auto flex max-w-[1120px] flex-col items-center text-center">
        <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-full border border-line bg-mist px-4 py-1.5 text-[13px] font-medium text-ink">
          {home.trust.map((item, i) => (
            <li key={item} className="flex items-center gap-2">
              {i === 0 ? <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" /> : null}
              {item}
            </li>
          ))}
        </ul>

        <h1
          id="hero-title"
          className="mt-7 max-w-[16ch] font-display text-[clamp(2.75rem,7.4vw,6rem)] leading-[0.98] font-semibold tracking-[-0.05em] text-balance text-ink"
        >
          {lead} <span className="text-brand">{tail}</span>
        </h1>

        <p className="mt-7 max-w-[40ch] text-[1.125rem] leading-snug text-balance text-body md:text-[1.25rem]">{home.lede}</p>

        <div className="mt-8 flex w-full flex-col justify-center gap-2.5 sm:w-auto sm:flex-row">
          <CtaLink href={home.primary.href} variant="gold">
            {home.primary.label}
          </CtaLink>
          <CtaLink href={home.secondary.href} variant="secondary">
            {home.secondary.label}
          </CtaLink>
        </div>
      </div>

      <HubPanel />

      <ul className="mx-auto mt-14 flex max-w-[1120px] flex-wrap justify-around gap-x-8 gap-y-3 border-y border-line py-7 font-mono text-[13px] tracking-[0.04em] text-ink uppercase">
        {home.eyebrow.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
