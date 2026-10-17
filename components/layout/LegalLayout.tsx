import type { ReactNode } from "react";
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
      <div className="mx-auto max-w-[1180px]">
        <header className="max-w-3xl border-b border-line pb-10">
          <p className="text-[15px] font-medium text-mahogany">{kicker}</p>
          <h1 className="mt-3 font-serif text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.12] font-semibold text-ink">{title}</h1>
          <p className="mt-5 text-[15px] text-muted">Last updated {site.legal.lastUpdated}</p>
          <div className="mt-5 text-[1.125rem] leading-relaxed text-body">{intro}</div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[15rem_1fr]">
          <nav aria-label="On this page" className="no-print lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
            <p className="text-[15px] font-semibold text-ink">On this page</p>
            <ol className="mt-3 space-y-0.5 border-l border-line">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="block py-1.5 pl-4 text-[15px] text-body transition-colors hover:text-ink">
                    <span className="mr-2 text-mahogany tabular-nums">{index + 1}.</span>
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
                  <span className="mr-3 text-mahogany tabular-nums">{index + 1}.</span>
                  {section.heading}
                </h2>
                {section.body}
              </section>
            ))}
            <p className="mt-16 border-t border-line pt-6 text-[15px] text-muted">
              This page is provided for general information. It is not legal advice.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
