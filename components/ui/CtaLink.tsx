import { ArrowDown, ChevronRight } from "lucide-react";
import { isSafeNavigationHref } from "@/lib/safe-href";

type CtaLinkProps = {
  href: string;
  children: string;
  variant?: "primary" | "secondary" | "link" | "linkDark";
  icon?: "none" | "right" | "down";
  external?: boolean;
  className?: string;
};

const looks = {
  primary: "min-h-11 rounded-full bg-accent px-6 text-white hover:bg-accent-hover",
  secondary: "min-h-11 rounded-full border border-ink/15 px-6 text-ink hover:border-ink/40",
  link: "min-h-11 text-link hover:underline underline-offset-4",
  linkDark: "min-h-11 text-link-dark hover:underline underline-offset-4",
} as const;

export function CtaLink({
  href,
  children,
  variant = "primary",
  icon = "none",
  external = false,
  className = "",
}: CtaLinkProps) {
  const destination = isSafeNavigationHref(href) ? href : undefined;
  const openInNewTab = external && destination?.startsWith("https://");
  const Icon = icon === "down" ? ArrowDown : icon === "right" ? ChevronRight : null;

  return (
    <a
      href={destination}
      {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex items-center justify-center gap-1.5 text-[17px] font-medium whitespace-nowrap transition-[background-color,border-color,color] duration-200 active:scale-[0.98] ${looks[variant]} ${className}`}
    >
      {children}
      {Icon ? (
        <Icon
          aria-hidden
          strokeWidth={2}
          className={`h-4 w-4 transition-transform duration-200 ${icon === "down" ? "group-hover:translate-y-0.5" : "group-hover:translate-x-0.5"}`}
        />
      ) : null}
    </a>
  );
}
