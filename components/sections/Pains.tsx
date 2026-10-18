import { SectionHeading } from "@/components/ui/SectionHeading";
import { pains } from "@/lib/site";

export function Pains() {
  return (
    <section aria-labelledby="pains-title" className="border-b border-line">
      <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-8 md:py-24 lg:px-10">
        <SectionHeading
          id="pains-title"
          title="Sound familiar?"
          lede="Most of the businesses we meet aren't short on effort. Something in how the work flows is slowing them down."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2">
          {pains.map((pain) => (
            <li key={pain.id} className="bg-paper p-7 md:p-8">
              <p className="font-display text-[1.3125rem] leading-snug font-medium text-ink">“{pain.quote}”</p>
              <p className="mt-3 text-body">{pain.answer}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
