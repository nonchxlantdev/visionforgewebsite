import { CtaLink } from "@/components/ui/CtaLink";
import { additionalServices } from "@/lib/site";

/** Websites, apps and other digital services: visible, but kept below automation and integration. */
export function MoreServices() {
  return (
    <section aria-labelledby="more-services-title" className="px-5 pb-24 sm:px-8 md:pb-32">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-6 rounded-[28px] bg-mist p-7 md:p-10 lg:flex-row lg:items-center lg:gap-12">
        <div className="lg:flex-1">
          <h2 id="more-services-title" className="font-display text-[1.625rem] leading-snug font-semibold tracking-[-0.03em] text-ink">
            Also from Vision Forge
          </h2>
          <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-body">The digital services that sit alongside our automation and integration work.</p>
          <div className="mt-3">
            <CtaLink href="/services#build" variant="link">
              See all services →
            </CtaLink>
          </div>
        </div>
        <ul className="flex flex-wrap gap-2 lg:flex-[2]">
          {additionalServices.map((item) => (
            <li key={item} className="rounded-full border border-line bg-paper px-4 py-2.5 text-[14px] font-medium text-ink">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
