import type { ReactNode } from "react";

type SectionHeadingProps = {
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  className?: string;
};

export function SectionHeading({ title, lede, id, className = "" }: SectionHeadingProps) {
  return (
    <header className={`max-w-3xl ${className}`}>
      <h2 id={id} className="font-serif text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.18] font-semibold tracking-[-0.01em] text-balance text-ink">
        {title}
      </h2>
      {lede ? <p className="mt-4 max-w-[60ch] text-body">{lede}</p> : null}
    </header>
  );
}
