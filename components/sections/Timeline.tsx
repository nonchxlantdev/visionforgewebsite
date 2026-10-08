import { SectionHeading } from "@/components/ui/SectionHeading";
import { steps } from "@/lib/site";

export function Timeline() {
  return (
    <section aria-labelledby="steps-title" className="border-b border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 lg:px-10">
        <SectionHeading id="steps-title" kicker="Four steps" title="From first message to running for real." />
        <ol className="relative mt-14 grid gap-10 md:grid-cols-4 md:gap-6">
          <span aria-hidden className="absolute top-5 right-0 left-0 hidden h-px bg-line-2 md:block" />
          {steps.map((step, i) => (
            <li key={step.title} className="reveal relative">
              <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-[4px] border border-gold bg-bg font-mono text-[14px] text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-wide mt-6 text-[21px] leading-tight font-bold text-steel-hi">{step.title}</h3>
              <p className="mt-3 text-[16px] text-steel-2">{step.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
