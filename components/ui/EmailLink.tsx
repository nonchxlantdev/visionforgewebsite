import { mailtoHref } from "@/lib/safe-href";

type EmailLinkProps = {
  address: string;
  size?: "lg" | "md" | "sm";
  tone?: "bright" | "muted";
  subject?: string;
  className?: string;
};

const sizes = {
  lg: "text-[clamp(1rem,4.4cqi,1.5rem)] whitespace-nowrap",
  md: "text-[17px]",
  sm: "text-[14px]",
} as const;

const tones = {
  bright: "text-steel-hi decoration-gold/60 hover:decoration-gold underline underline-offset-[6px]",
  muted: "text-steel-2 hover:text-steel-hi",
} as const;

/** A lowercase, clickable mailto link. */
export function EmailLink({ address, size = "md", tone = "bright", subject, className = "" }: EmailLinkProps) {
  return (
    <a
      href={mailtoHref(address, subject)}
      className={`inline-flex min-h-11 items-center [overflow-wrap:anywhere] lowercase transition-colors ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {address.toLowerCase()}
    </a>
  );
}
