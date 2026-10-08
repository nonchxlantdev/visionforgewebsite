import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";
import { site } from "@/lib/site";

export type LegalSection = { id: string; heading: string; body: ReactNode };

type LegalLayoutProps = {
  kicker: string;
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
};

export function LegalLayout({ kicker, title, intro, sections }: LegalLayoutProps) {
  return (
    <article className="px-5 pt-14 pb-24 sm:px-8 lg:px-10 lg:pt-20">
      <div className="mx-auto max-w-[1240px]">
        <header className="max-w-3xl border-b border-line pb-10">
          <Label>{kicker}</Label>
          <h1 className="font-wide mt-5 text-[clamp(2.5rem,6vw,4.25rem)] leading-[1] font-extrabold tracking-[-0.025em] text-steel-hi">
            {title}
          </h1>
          <p className="label mt-6 text-steel-2">Last updated {site.legal.lastUpdated}</p>
          <div className="mt-5 text-[19px] leading-relaxed text-steel-2">{intro}</div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[15rem_1fr]">
          <nav aria-label="On this page" className="no-print lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
            <p className="label text-gold">On this page</p>
            <ol className="mt-4 space-y-0.5 border-l border-line">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="block py-1.5 pl-4 text-[14px] text-steel-2 transition-colors hover:text-steel-hi">
                    <span className="mr-2 font-mono text-[12px] text-gold">{String(index + 1).padStart(2, "0")}</span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-prose max-w-[68ch] text-[17px] leading-[1.7]">
            {sections.map((section, index) => (
              <section key={section.id} aria-labelledby={section.id}>
                <h2 id={section.id}>
                  <span className="mr-3 font-mono text-[14px] font-normal text-gold">{String(index + 1).padStart(2, "0")}</span>
                  {section.heading}
                </h2>
                {section.body}
              </section>
            ))}
            <p className="mt-16 border-t border-line pt-6 text-[14px] text-steel-2">
              This page is provided for general information. It is not legal advice.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
