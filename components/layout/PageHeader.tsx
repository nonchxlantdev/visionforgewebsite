import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  lede: ReactNode;
  children?: ReactNode;
};

/** The one h1 on every inner page. */
export function PageHeader({ title, lede, children }: PageHeaderProps) {
  return (
    <header className="px-3 pt-6 sm:px-6">
      <div className="on-dark mx-auto max-w-[1168px] rounded-[28px] bg-ink px-6 pt-14 pb-12 sm:px-10 md:rounded-[36px] md:px-12 md:pt-20 md:pb-16">
        <h1 className="max-w-[22ch] font-display text-[clamp(2.5rem,5.6vw,4rem)] leading-[1] font-semibold tracking-[-0.045em] text-balance text-paper">
          {title}
        </h1>
        <div className="mt-5 max-w-[60ch] text-[1.125rem] text-on-ink-2 md:text-[1.1875rem]">{lede}</div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
