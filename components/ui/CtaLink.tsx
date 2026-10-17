import Link from "next/link";
import type { ReactNode } from "react";
import { isSafeNavigationHref } from "@/lib/safe-href";

type Variant = "primary" | "secondary" | "link";

const looks: Record<Variant, string> = {
  primary: "min-h-12 rounded-md bg-ink px-6 text-paper hover:bg-ink-hover",
  secondary: "min-h-12 rounded-md border border-ink px-6 text-ink hover:bg-mist",
  link: "min-h-11 text-mahogany underline decoration-mahogany/40 underline-offset-4 hover:decoration-mahogany",
};

/** Shared look for links and buttons that act as calls to action. */
export function ctaClassName(variant: Variant = "primary", extra = ""): string {
  return `inline-flex items-center justify-center gap-2 text-[16px] font-medium whitespace-nowrap transition-colors duration-200 ${looks[variant]} ${extra}`.trim();
}

type CtaLinkProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
};

export function CtaLink({ href, children, variant = "primary", className = "" }: CtaLinkProps) {
  const destination = isSafeNavigationHref(href) ? href : undefined;
  const classes = ctaClassName(variant, className);
  if (destination?.startsWith("/") || destination?.startsWith("#")) {
    return (
      <Link href={destination} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <a href={destination} className={classes}>
      {children}
    </a>
  );
}
