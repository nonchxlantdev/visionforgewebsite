import { Plus } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faq } from "@/lib/site";

export function Faq() {
  return (
    <section id="faq" className="scroll-mt-20 border-t border-line px-4 py-20 sm:px-6 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHeading kicker="FAQ" lines={["Questions", "people ask."]} hotLines={[1]} />
        <div className="border-t border-line">
          {faq.map((item) => (
            <details key={item.q} className="group border-b border-line">
              <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-lg text-chrome transition-colors hover:text-whitehot [&::-webkit-details-marker]:hidden">
                {item.q}
                <Plus
                  aria-hidden
                  className="h-5 w-5 shrink-0 text-molten transition-transform duration-300 group-open:rotate-45"
                  strokeWidth={1.75}
                />
              </summary>
              <p className="pb-6 text-base leading-relaxed text-ash">
                {item.a}
                {"link" in item ? (
                  <>
                    {" "}
                    <Link href={item.link.href} className="text-molten underline underline-offset-4">
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
