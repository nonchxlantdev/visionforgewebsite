import { ArrowRight, ArrowDown } from "lucide-react";
import { isSafeNavigationHref } from "@/lib/safe-href";

type CtaLinkProps = {
  href: string;
  children: string;
  variant?: "molten" | "ghost";
  icon?: "right" | "down";
  external?: boolean;
  className?: string;
};

export function CtaLink({
  href,
  children,
  variant = "molten",
  icon = "right",
  external = false,
  className = "",
}: CtaLinkProps) {
  const look =
    variant === "molten"
      ? "bg-molten text-on-molten shadow-[0_0_0_rgba(255,90,31,0)] hover:bg-whitehot hover:shadow-[0_0_36px_rgba(255,90,31,0.55)]"
      : "border border-chrome/25 text-chrome hover:border-molten hover:text-whitehot hover:shadow-[0_0_28px_rgba(255,90,31,0.25)]";
  const Icon = icon === "down" ? ArrowDown : ArrowRight;
  const shift = icon === "down" ? "group-hover:translate-y-0.5" : "group-hover:translate-x-1";
  const destination = isSafeNavigationHref(href) ? href : undefined;
  const openInNewTab = external && destination?.startsWith("https://");

  return (
    <a
      href={destination}
      {...(openInNewTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group inline-flex min-h-12 items-center justify-center gap-3 px-6 font-mono text-[12px] font-medium tracking-[0.14em] whitespace-nowrap uppercase transition-[background-color,border-color,color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] ${look} ${className}`}
    >
      {children}
      <Icon
        aria-hidden
        strokeWidth={1.75}
        className={`h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${shift}`}
      />
    </a>
  );
}
