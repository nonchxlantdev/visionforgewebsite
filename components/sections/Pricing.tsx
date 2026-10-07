import { Check } from "lucide-react";
import { CtaLink } from "@/components/ui/CtaLink";
import { SectionHeading } from "@/components/ui/SectionHeading";
import Link from "next/link";
import { formatBZ, priceNote, tierOrder, tiers } from "@/lib/site";

const examples = {
  launch: ["Business website", "Landing page", "Google listing set up", "WhatsApp and call buttons"],
  grow: ["Online store or ordering", "Bookings and appointments", "Simple customer or staff app", "Order and booking alerts"],
  custom: ["Staff portals", "Digital forms and checklists", "Reports and dashboards", "Connecting your systems"],
} as const;

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-20 border-t border-line px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading kicker="Pricing" lines={["Clear prices,", "no surprises."]} hotLines={[1]}>
          Every project gets a fixed quote after a free chat. These are typical starting points.
        </SectionHeading>

        <ul className="mt-12 grid gap-px border border-line bg-line md:grid-cols-3">
          {tierOrder.map((id) => {
            const t = tiers[id];
            return (
              <li key={id} className="flex flex-col bg-forge p-6 sm:p-8">
                <p className="font-mono text-[11px] tracking-[0.2em] text-molten uppercase">{t.label}</p>
                <p className="mt-4 font-display text-[3.2rem] leading-none font-black text-chrome">
                  <span className="mr-2 align-middle font-mono text-sm font-normal text-ash">from</span>
                  <span className="hot-text">{formatBZ(t.from)}</span>
                  <span aria-hidden className="ml-0.5 align-top font-mono text-base font-normal text-ash">*</span>
                </p>
                <p className="mt-2 font-mono text-[11px] tracking-[0.14em] text-ash uppercase">Usually {t.weeks}</p>
                <p className="mt-5 text-base leading-relaxed text-chrome/85">{t.copy}</p>
                <ul className="mt-5 space-y-2 text-[15px] text-ash">
                  {examples[id].map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <Check aria-hidden className="h-4 w-4 shrink-0 text-molten" strokeWidth={2.25} />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-[12px] leading-relaxed text-ash">
          <span aria-hidden>* </span>
          {priceNote.text}{" "}
          <Link href={priceNote.href} className="underline underline-offset-2 hover:text-whitehot">
            {priceNote.linkLabel}
          </Link>
        </p>

        <div className="mt-8 flex flex-col gap-4 border border-line bg-soot/50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p className="text-base text-chrome/90">
            Not sure which fits? Tell us your budget in the builder and we&apos;ll suggest what you can get.
          </p>
          <CtaLink href="#build" variant="ghost">
            Build your project
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
