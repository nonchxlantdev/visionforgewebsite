import { Check } from "lucide-react";
import type { ReactNode } from "react";
import type { Stage } from "@/lib/site";

export function ServiceStage({ stage, index, children }: { stage: Stage; index: number; children?: ReactNode }) {
  const shaded = index % 2 === 1;
  return (
    <section id={stage.id} aria-labelledby={`${stage.id}-title`} className={`border-b border-line ${shaded ? "bg-mist" : ""}`}>
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-20 sm:px-8 md:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
        <div>
          <p className="font-display text-[1.125rem] font-bold text-accent">
            {index + 1}. {stage.name}
            {stage.optional ? <span className="ml-2 font-sans text-[15px] font-normal text-muted">Optional</span> : null}
          </p>
          <h2
            id={`${stage.id}-title`}
            className="mt-3 font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.18] font-bold text-balance text-ink"
          >
            {stage.title}
          </h2>
          <p className="mt-4 max-w-[52ch] text-body">{stage.summary}</p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="text-[16px] font-semibold text-ink">You might need this if</h3>
            <ul className="mt-3 space-y-3">
              {stage.needIf.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[16px] font-semibold text-ink">What we do</h3>
            <ul className="mt-3 space-y-3">
              {stage.weDo.map((item) => (
                <li key={item} className="flex gap-3 text-body">
                  <Check aria-hidden className="mt-[0.3em] h-4 w-4 shrink-0 text-success" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {children ? <div className="lg:col-span-2">{children}</div> : null}
      </div>
    </section>
  );
}
