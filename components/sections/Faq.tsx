import { Plus } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq } from "@/lib/site";

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-14 px-4 py-24 sm:px-6 md:py-32">
      <div className="mx-auto max-w-[820px]">
        <SectionHeading id="faq-title" kicker="FAQ" title="Questions people ask." />
        <div className="mt-12 border-t border-hairline">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-hairline">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[19px] font-medium tracking-[-0.015em] text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-ink-2 transition-transform duration-300 group-open:rotate-45"
                  strokeWidth={1.75}
                />
              </summary>
              <p className="pr-10 pb-6 text-[17px] leading-relaxed text-ink-2">
                {item.a}
                {"link" in item ? (
                  <>
                    {" "}
                    <Link href={item.link.href} className="text-link underline underline-offset-4">
                      {item.link.label}
                    </Link>
                  </>
                ) : null}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
