import type { ReactNode } from "react";
import { Label } from "@/components/ui/Label";

type PageHeaderProps = {
  kicker: string;
  title: ReactNode;
  lede: ReactNode;
  children?: ReactNode;
};

/** The one h1 on every inner page: title left, lede right on wide screens. */
export function PageHeader({ kicker, title, lede, children }: PageHeaderProps) {
  return (
    <header className="border-b border-line">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-5 pt-16 pb-14 sm:px-8 md:pt-20 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:px-10">
        <div>
          <Label>{kicker}</Label>
          <h1 className="font-wide mt-5 text-[clamp(2.6rem,6.4vw,4.75rem)] leading-[0.98] font-extrabold tracking-[-0.025em] text-balance text-steel-hi">
            {title}
          </h1>
        </div>
        <div className="text-[clamp(1.0625rem,1.5vw,1.25rem)] text-steel-2">
          {lede}
          {children ? <div className="mt-6">{children}</div> : null}
        </div>
      </div>
    </header>
  );
}
