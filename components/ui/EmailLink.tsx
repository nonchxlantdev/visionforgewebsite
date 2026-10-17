import { mailtoHref } from "@/lib/safe-href";

type EmailLinkProps = {
  address: string;
  size?: "lg" | "md" | "sm";
  tone?: "ink" | "muted" | "onDark";
  subject?: string;
  className?: string;
};

const sizes = {
  lg: "text-[1.25rem]",
  md: "text-[17px]",
  sm: "text-[15px]",
} as const;

const tones = {
  ink: "text-ink underline decoration-mahogany/50 underline-offset-4 hover:decoration-mahogany",
  muted: "text-body hover:text-ink",
  onDark: "text-on-ink-2 hover:text-paper",
} as const;

/** A lowercase, clickable mailto link. */
export function EmailLink({ address, size = "md", tone = "ink", subject, className = "" }: EmailLinkProps) {
  return (
    <a
      href={mailtoHref(address, subject)}
      className={`inline-flex min-h-11 items-center [overflow-wrap:anywhere] lowercase transition-colors ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {address.toLowerCase()}
    </a>
  );
}
