import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { lanes, lanesNote } from "@/lib/site";

/** The two ways to start. No feature lists: who each lane is for, and a starting price. */
export function Lanes({ title }: { title?: string }) {
  return (
    <section
      aria-labelledby={title ? "lanes-title" : undefined}
      aria-label={title ? undefined : "Ways to start"}
      className="border-b border-line"
    >
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 md:py-20 lg:px-10">
        {title ? <SectionHeading id="lanes-title" title={title} className="mb-10" /> : null}
        <ul className="grid gap-5 md:grid-cols-2">
          {lanes.map((lane) => (
            <li key={lane.id} className="rounded-lg border border-line bg-paper p-7 md:p-8">
              <h3 className="font-serif text-[1.3125rem] leading-snug font-semibold text-ink">{lane.title}</h3>
              <p className="mt-3 font-serif text-[1.75rem] leading-none font-semibold text-mahogany">{lane.price}</p>
              <p className="mt-4 max-w-[48ch] text-body">{lane.copy}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-[15px] text-muted">
          {lanesNote.text}{" "}
          <Link href={lanesNote.href} className="text-mahogany underline underline-offset-4">
            {lanesNote.linkLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}
