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
    <article className="px-4 pt-12 pb-24 sm:px-6 lg:px-10 lg:pt-20">
      <div className="mx-auto max-w-[1200px]">
        <header className="max-w-3xl border-b border-line pb-10">
          <Label>{kicker}</Label>
          <h1 className="chrome-text mt-5 font-display text-[clamp(3rem,8vw,6rem)] leading-[0.88] font-black uppercase">
            {title}
          </h1>
          <p className="mt-6 font-mono text-[11px] tracking-[0.16em] text-ash uppercase">
            Last updated {site.legal.lastUpdated}
          </p>
          <div className="mt-6 text-base leading-relaxed text-chrome/90 sm:text-lg">{intro}</div>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[16rem_1fr]">
          <nav aria-label="On this page" className="no-print lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
            <p className="font-mono text-[11px] tracking-[0.18em] text-molten uppercase">On this page</p>
            <ol className="mt-4 space-y-1 border-l border-line">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="block py-1.5 pl-4 text-sm text-ash transition-colors hover:text-whitehot"
                  >
                    <span className="mr-2 font-mono text-[10px] text-ash/70">{String(index + 1).padStart(2, "0")}</span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="legal-prose max-w-[68ch] text-base leading-[1.75]">
            {sections.map((section, index) => (
              <section key={section.id} aria-labelledby={section.id}>
                <h2 id={section.id}>
                  <span className="mr-3 font-mono text-sm font-normal tracking-[0.1em] text-molten">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {section.heading}
                </h2>
                {section.body}
              </section>
            ))}
            <p className="mt-16 border-t border-line pt-6 text-sm text-ash">
              This page is provided for general information. It is not legal advice.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
