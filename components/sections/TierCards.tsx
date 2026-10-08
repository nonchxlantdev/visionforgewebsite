import { Check } from "lucide-react";
import Link from "next/link";
import { featuredTier, formatBZ, priceNote, tierOrder, tiers } from "@/lib/site";

export function TierCards() {
  return (
    <section aria-label="Starting prices" className="border-b border-line">
      <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8 lg:px-10">
        <ul className="grid gap-px border border-line bg-line md:grid-cols-3">
          {tierOrder.map((id) => {
            const t = tiers[id];
            const featured = id === featuredTier;
            return (
              <li key={id} className={`relative flex flex-col p-7 sm:p-8 ${featured ? "bg-bg-2" : "bg-bg"}`}>
                {featured ? (
                  <>
                    <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 bg-gold" />
                    <p className="label text-gold">Where most start</p>
                  </>
                ) : (
                  <p className="label text-steel-2">{id === "found" ? "Websites" : "Bigger systems"}</p>
                )}
                <h2 className="font-wide mt-4 text-[24px] font-bold text-steel-hi">{t.label}</h2>
                <p className="mt-5 flex items-baseline gap-2">
                  <span className="label text-steel-2">from</span>
                  <span className="font-wide text-[2.75rem] leading-none font-extrabold tracking-[-0.03em] text-steel-hi tabular-nums">
                    {formatBZ(t.from)}
                  </span>
                  <span aria-hidden className="self-start text-[20px] leading-none text-gold">
                    *
                  </span>
                </p>
                <p className="label mt-3 text-steel-2">Usually {t.weeks}</p>
                <p className="mt-5 text-[16px] text-steel">{t.copy}</p>
                <ul className="mt-6 space-y-2.5 border-t border-line pt-6 text-[15px] text-steel-2">
                  {t.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} />
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 max-w-3xl text-[12px] leading-relaxed text-steel-2">
          <span aria-hidden>* </span>
          {priceNote.text}{" "}
          <Link href={priceNote.href} className="underline underline-offset-2 hover:text-steel-hi">
            {priceNote.linkLabel}
          </Link>
        </p>
      </div>
    </section>
  );
}
