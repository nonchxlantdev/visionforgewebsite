import { Plus } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";

export type FaqItem = { q: string; a: string; link?: { href: string; label: string } };

export function Faq({ items, title = "Questions people ask" }: { items: readonly FaqItem[]; title?: string }) {
  return (
    <section aria-labelledby="faq-title" className="border-b border-line">
      <div className="mx-auto grid max-w-[1180px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <SectionHeading id="faq-title" title={title} />
        <div className="border-t border-line">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-serif text-[1.1875rem] font-semibold text-ink [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus aria-hidden className="h-5 w-5 shrink-0 text-mahogany transition-transform duration-200 group-open:rotate-45" strokeWidth={1.75} />
              </summary>
              <p className="max-w-[62ch] pr-10 pb-6 text-body">
                {item.a}
                {item.link ? (
                  <>
                    {" "}
                    <Link href={item.link.href} className="text-mahogany underline underline-offset-4">
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
