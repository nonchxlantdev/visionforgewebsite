import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  lede: ReactNode;
  children?: ReactNode;
};

/** The one h1 on every inner page. */
export function PageHeader({ title, lede, children }: PageHeaderProps) {
  return (
    <header className="border-b border-line bg-mist">
      <div className="mx-auto max-w-[1180px] px-5 pt-14 pb-12 sm:px-8 md:pt-20 md:pb-16 lg:px-10">
        <h1 className="max-w-[22ch] font-serif text-[clamp(2.25rem,5vw,3.25rem)] leading-[1.12] font-semibold tracking-[-0.01em] text-balance text-ink">
          {title}
        </h1>
        <div className="mt-5 max-w-[60ch] text-[1.125rem] text-body md:text-[1.1875rem]">{lede}</div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </header>
  );
}
