import Link from "next/link";
import type { ReactNode } from "react";
import { isSafeNavigationHref } from "@/lib/safe-href";

type Variant = "primary" | "secondary" | "link" | "gold" | "ghostLight";

const looks: Record<Variant, string> = {
  primary: "min-h-12 rounded-full bg-ink px-6 font-semibold text-paper hover:bg-ink-hover",
  secondary: "min-h-12 rounded-full border border-line bg-mist px-6 font-semibold text-ink hover:bg-line",
  link: "min-h-11 font-semibold text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent",
  // The main call to action: solid reef blue. (Kept the old "gold" name so callers don't change.)
  gold: "min-h-12 rounded-full bg-brand px-6 font-semibold text-paper hover:bg-brand-hover",
  ghostLight: "min-h-12 rounded-full border border-white/30 px-6 font-semibold text-paper hover:bg-white/10",
};

/** Shared look for links and buttons that act as calls to action. */
export function ctaClassName(variant: Variant = "primary", extra = ""): string {
  return `inline-flex items-center justify-center gap-2 text-[16px] whitespace-nowrap transition-colors duration-200 ${looks[variant]} ${extra}`.trim();
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
