import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { isSafeNavigationHref } from "@/lib/safe-href";

type CtaLinkProps = {
  href: string;
  children: string;
  variant?: "primary" | "ghost" | "link";
  arrow?: boolean;
  external?: boolean;
  className?: string;
};

const looks = {
  primary: "min-h-12 rounded-[4px] bg-gold px-6 text-on-gold hover:bg-gold-hi",
  ghost: "min-h-12 rounded-[4px] border border-line-2 px-6 text-steel-hi hover:border-gold",
  link: "min-h-11 text-gold underline-offset-4 hover:underline",
} as const;

export function CtaLink({
  href,
  children,
  variant = "primary",
  arrow = false,
  external = false,
  className = "",
}: CtaLinkProps) {
  const destination = isSafeNavigationHref(href) ? href : undefined;
  const classes = `group inline-flex items-center justify-center gap-2 text-[15px] font-semibold whitespace-nowrap transition-[background-color,border-color,color] duration-200 active:translate-y-px ${looks[variant]} ${className}`;
  const content = (
    <>
      {children}
      {arrow ? (
        <ArrowRight aria-hidden strokeWidth={2} className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      ) : null}
    </>
  );

  if (destination?.startsWith("/")) {
    return (
      <Link href={destination} className={classes}>
        {content}
      </Link>
    );
  }
  const openInNewTab = external && destination?.startsWith("https://");
  return (
    <a href={destination} {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={classes}>
      {content}
    </a>
  );
}
