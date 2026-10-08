import { mailtoHref } from "@/lib/safe-href";

type EmailLinkProps = {
  address: string;
  size?: "lg" | "md" | "sm";
  tone?: "link" | "muted";
  subject?: string;
  className?: string;
};

const sizes = {
  lg: "text-[clamp(1rem,4.2cqi,1.5rem)] whitespace-nowrap",
  md: "text-[17px]",
  sm: "text-[13px]",
} as const;

const tones = {
  link: "text-link",
  muted: "text-ink-2 hover:text-ink",
} as const;

/** A lowercase, clickable mailto link. */
export function EmailLink({ address, size = "md", tone = "link", subject, className = "" }: EmailLinkProps) {
  return (
    <a
      href={mailtoHref(address, subject)}
      className={`inline-flex min-h-11 items-center [overflow-wrap:anywhere] lowercase underline-offset-4 hover:underline ${tones[tone]} ${sizes[size]} ${className}`}
    >
      {address.toLowerCase()}
    </a>
  );
}
