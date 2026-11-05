import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { lanes, lanesNote } from "@/lib/site";

/** The two ways to start: an outlined card and a solid reef-blue one. */
export function Lanes({ title }: { title?: string }) {
  return (
    <section aria-labelledby="lanes-title" className={`px-5 pb-24 sm:px-8 md:pb-32 ${title ? "" : "pt-12 md:pt-16"}`}>
      <div className="mx-auto max-w-[1120px]">
        {title ? (
          <SectionHeading id="lanes-title" eyebrow="Pricing" title={title} className="mb-10" />
        ) : (
          <h2 id="lanes-title" className="sr-only">Ways to start</h2>
        )}
        <ul className="grid gap-4 md:grid-cols-2">
          {lanes.map((lane, i) => {
            const solid = i === lanes.length - 1;
            return (
              <li
                key={lane.id}
                className={`flex flex-col gap-3.5 rounded-[28px] p-8 md:p-10 ${solid ? "on-dark bg-brand text-paper" : "border border-line text-ink"}`}
              >
                <h3 className={`text-[14px] font-semibold ${solid ? "text-white/85" : "text-muted"}`}>{lane.title}</h3>
                <p className="font-display text-[clamp(2.5rem,5vw,3.75rem)] leading-none font-semibold tracking-[-0.05em]">{lane.price}</p>
                <p className={`max-w-[48ch] text-[15px] leading-relaxed ${solid ? "text-white/90" : "text-body"}`}>{lane.copy}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-[14px] text-muted">
          {lanesNote.text}{" "}
          <Link href={lanesNote.href} className="text-accent underline underline-offset-4">
            {lanesNote.linkLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}
