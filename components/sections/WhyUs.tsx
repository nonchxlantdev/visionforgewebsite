import { SectionHeading } from "@/components/ui/SectionHeading";
import { whyUs } from "@/lib/site";

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="border-b border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading id="why-title" title="Why work with us" />
        <ul className="mt-12 grid gap-10 md:grid-cols-3">
          {whyUs.map((point) => (
            <li key={point.title}>
              <span aria-hidden className="block h-0.5 w-10 bg-mahogany" />
              <h3 className="mt-5 font-serif text-[1.25rem] leading-snug font-semibold text-ink">{point.title}</h3>
              <p className="mt-3 text-body">{point.copy}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
