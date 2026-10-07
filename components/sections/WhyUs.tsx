import { Label } from "@/components/ui/Label";
import { principles } from "@/lib/site";

export function WhyUs() {
  return (
    <section aria-labelledby="why-title" className="border-t border-line px-4 py-16 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Label>Why Vision Forge</Label>
        <h2 id="why-title" className="sr-only">
          Why Vision Forge
        </h2>
        <ul className="mt-6 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
          {principles.map((item, i) => (
            <li
              key={item.support}
              className={`bg-forge px-5 py-6 ${i === principles.length - 1 ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <p className="chrome-text font-display text-[2rem] leading-none font-black uppercase">{item.lead}</p>
              <p className="mt-2 font-mono text-[11px] tracking-[0.16em] text-molten uppercase">{item.support}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
