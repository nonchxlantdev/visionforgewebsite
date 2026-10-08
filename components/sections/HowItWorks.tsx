import { SectionHeading } from "@/components/ui/SectionHeading";
import { steps } from "@/lib/site";

export function HowItWorks() {
  return (
    <section id="steps" aria-labelledby="steps-title" className="scroll-mt-14 bg-canvas px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-[1120px]">
        <SectionHeading
          id="steps-title"
          kicker="How it works"
          title="Four steps. No tech talk."
          lede="Tell us how your business runs in your own words. We handle the rest."
        />
        <ol className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <li key={step.title} className="reveal rounded-[24px] bg-page p-7">
              <span className="text-[15px] font-semibold text-link tabular-nums">Step {i + 1}</span>
              <h3 className="mt-3 text-[21px] leading-[1.25] font-semibold tracking-[-0.02em] text-ink">{step.title}</h3>
              <p className="mt-3 text-[17px] leading-relaxed text-ink-2">{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
