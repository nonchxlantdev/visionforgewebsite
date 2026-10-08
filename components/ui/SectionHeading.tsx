import type { ReactNode } from "react";
import { Label } from "./Label";

type SectionHeadingProps = {
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
  className?: string;
};

export function SectionHeading({ kicker, title, lede, id, className = "" }: SectionHeadingProps) {
  return (
    <header className={`max-w-3xl ${className}`}>
      {kicker ? <Label>{kicker}</Label> : null}
      <h2
        id={id}
        className="font-wide mt-4 text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.02] font-bold tracking-[-0.02em] text-balance text-steel-hi"
      >
        {title}
      </h2>
      {lede ? <p className="mt-5 max-w-2xl text-[clamp(1.0625rem,1.5vw,1.1875rem)] text-steel-2">{lede}</p> : null}
    </header>
  );
}
