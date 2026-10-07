import type { ReactNode } from "react";
import { HeatText } from "@/components/forge/HeatText";
import { Label } from "./Label";

type SectionHeadingProps = {
  kicker: string;
  lines: string[];
  hotLines?: number[];
  children?: ReactNode;
  className?: string;
};

export function SectionHeading({ kicker, lines, hotLines, children, className = "" }: SectionHeadingProps) {
  return (
    <header className={`max-w-4xl ${className}`}>
      <Label>{kicker}</Label>
      <HeatText
        lines={lines}
        hotLines={hotLines}
        className="mt-5 font-display text-[clamp(2.9rem,7vw,6.25rem)] leading-[0.86] tracking-[0.005em] uppercase"
      />
      {children ? (
        <p className="mt-6 max-w-[40rem] text-base leading-relaxed text-ash sm:text-lg">{children}</p>
      ) : null}
    </header>
  );
}
