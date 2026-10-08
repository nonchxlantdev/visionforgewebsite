import { Check } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { worksWith } from "@/lib/site";

export function WorksWith() {
  return (
    <section aria-labelledby="works-title" className="border-b border-line bg-bg-2">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:px-10">
        <SectionHeading
          id="works-title"
          kicker="No new systems to learn"
          title="Works with what you already use."
          lede="We connect the tools your team already knows, so nobody has to change how they work on day one."
        />
        <ul className="self-end border-t border-line">
          {worksWith.map((tool) => (
            <li key={tool} className="flex min-h-14 items-center gap-4 border-b border-line text-[18px] text-steel-hi">
              <Check aria-hidden className="h-5 w-5 text-gold" strokeWidth={2.25} />
              {tool}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
