import { Plus } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq } from "@/lib/site";

type FaqItem = (typeof faq)[number];

export function Faq({
  items = faq,
  title = "Questions people ask.",
  kicker = "FAQ",
}: {
  items?: readonly FaqItem[];
  title?: string;
  kicker?: string;
}) {
  return (
    <section aria-labelledby="faq-title" className="border-b border-line">
      <div className="mx-auto grid max-w-[1240px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
        <SectionHeading id="faq-title" kicker={kicker} title={title} />
        <div className="border-t border-line">
          {items.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[18px] font-semibold text-steel-hi transition-colors hover:text-gold [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus aria-hidden className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 group-open:rotate-45" strokeWidth={1.75} />
              </summary>
              <p className="pr-10 pb-6 text-[16px] leading-relaxed text-steel-2">
                {item.a}
                {"link" in item ? (
                  <>
                    {" "}
                    <Link href={item.link.href} className="text-gold underline underline-offset-4">
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
