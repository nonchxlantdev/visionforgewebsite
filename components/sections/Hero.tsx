import { CtaLink } from "@/components/ui/CtaLink";
import { Headline } from "@/components/ui/Headline";
import { Logo } from "@/components/ui/Logo";
import { SystemVisual } from "@/components/visuals/SystemVisual";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section id="home" className="grid min-h-[calc(100dvh-4.5rem)] scroll-mt-24 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-5 py-12 sm:px-8 lg:px-12 xl:px-16">
        <Logo
          priority
          className="h-40 w-40 sm:h-56 sm:w-56"
          sizes="(min-width: 640px) 224px, 160px"
        />
        <p className="mt-6 font-mono text-[11px] tracking-[0.22em] text-cyan">
          VISION FORGE / DIGITAL ENGINEERING
        </p>
        <Headline
          as="h1"
          immediate
          lines={[
            "TECHNOLOGY",
            <span key="forged">
              <span className="text-gold">FORGED</span> FOR
            </span>,
            "BUSINESS.",
          ]}
          className="mt-6 font-sans text-[clamp(2.8rem,5.3vw,5.35rem)] font-medium leading-[0.9] tracking-[-0.05em] text-ink"
        />
        <p className="mt-6 max-w-[34rem] text-[15px] leading-relaxed text-muted sm:text-base">
          Custom software, web platforms, automation, data and infrastructure — engineered
          around the way your business works.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CtaLink href="#contact">START A PROJECT</CtaLink>
          <CtaLink href="#capabilities" variant="ghost">
            EXPLORE CAPABILITIES
          </CtaLink>
        </div>
        <div className="mt-8 grid max-w-xl gap-2 sm:grid-cols-2">
          <a
            href={site.whatsapp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-12 items-center justify-between gap-3 border border-line px-3 transition-colors duration-300 hover:border-gold"
          >
            <span className="font-mono text-[10px] tracking-[0.18em] text-faint group-hover:text-gold">
              WHATSAPP
            </span>
            <span className="text-sm text-ink">{site.whatsapp.display}</span>
          </a>
          <a
            href={site.phone.href}
            className="group flex min-h-12 items-center justify-between gap-3 border border-line px-3 transition-colors duration-300 hover:border-gold"
          >
            <span className="font-mono text-[10px] tracking-[0.18em] text-faint group-hover:text-gold">
              CALL
            </span>
            <span className="text-sm text-ink">{site.phone.display}</span>
          </a>
        </div>
      </div>
      <div className="relative min-h-[340px] border-t border-line sm:min-h-[420px] lg:min-h-0 lg:border-t-0 lg:border-l">
        <SystemVisual />
      </div>
    </section>
  );
}
