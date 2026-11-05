import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: ReactNode;
  lede?: ReactNode;
  /** Small mono label above the title, e.g. "Services". */
  eyebrow?: string;
  id?: string;
  className?: string;
  /** Light text for dark panels. */
  tone?: "light" | "dark";
};

/** Title on the left, lede on the right from tablet up; stacked on phones. */
export function SectionHeading({ title, lede, eyebrow, id, className = "", tone = "light" }: SectionHeadingProps) {
  const onDark = tone === "dark";
  return (
    <header className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10 ${className}`}>
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className={`mb-4 font-mono text-[12px] tracking-[0.04em] uppercase ${onDark ? "text-gold" : "text-accent"}`}>/ {eyebrow}</p>
        ) : null}
        <h2
          id={id}
          className={`font-display text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-balance ${onDark ? "text-paper" : "text-ink"}`}
        >
          {title}
        </h2>
      </div>
      {lede ? <p className={`max-w-[42ch] text-[16px] leading-relaxed md:text-[17px] ${onDark ? "text-on-ink-2" : "text-body"}`}>{lede}</p> : null}
    </header>
  );
}
