import type { ReactNode } from "react";
import { Label } from "./Label";

type SectionHeadingProps = {
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "center" | "left";
  tone?: "light" | "dark";
  id?: string;
  className?: string;
};

export function SectionHeading({
  kicker,
  title,
  lede,
  align = "center",
  tone = "light",
  id,
  className = "",
}: SectionHeadingProps) {
  const dark = tone === "dark";
  const center = align === "center";
  return (
    <header className={`max-w-3xl ${center ? "mx-auto text-center" : ""} ${className}`}>
      {kicker ? <Label tone={tone}>{kicker}</Label> : null}
      <h2
        id={id}
        className={`mt-3 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.07] font-semibold tracking-[-0.03em] text-balance ${dark ? "text-panel-ink" : "text-ink"}`}
      >
        {title}
      </h2>
      {lede ? (
        <p
          className={`mt-5 max-w-2xl text-[clamp(1.0625rem,1.6vw,1.3125rem)] leading-[1.45] ${center ? "mx-auto" : ""} ${dark ? "text-panel-ink-2" : "text-ink-2"}`}
        >
          {lede}
        </p>
      ) : null}
    </header>
  );
}
