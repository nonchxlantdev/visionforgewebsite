import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { automations } from "@/lib/site";

export function AutomateList() {
  return (
    <section aria-labelledby="automate-title" className="border-b border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="automate-title" kicker="What we automate" title="Sounds like your week?" />
          <Link href="/automation" className="label inline-flex min-h-11 items-center text-steel hover:text-gold">
            See every automation →
          </Link>
        </div>
        <ol className="mt-12 grid border-t border-line md:grid-cols-2">
          {automations.map((item, i) => (
            <li
              key={item.id}
              className="reveal grid grid-cols-[2.5rem_1fr] gap-4 border-b border-line py-7 md:odd:border-r md:odd:pr-10 md:even:pl-10"
            >
              <span className="font-mono text-[13px] text-gold">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-wide text-[21px] leading-tight font-bold text-steel-hi">“{item.pain}”</p>
                <p className="mt-2 text-[16px] text-steel-2">{item.fix}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
