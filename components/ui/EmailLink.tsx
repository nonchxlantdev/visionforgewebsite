"use client";

import { useState } from "react";
import { mailtoHref } from "@/lib/safe-href";

type EmailLinkProps = {
  address: string;
  size?: "fluid" | "lg" | "md" | "sm";
  subject?: string;
  className?: string;
};

const sizes = {
  fluid: "text-[clamp(0.75rem,4.6cqi,1.6rem)] whitespace-nowrap py-2",
  lg: "text-[clamp(0.85rem,3.6vw,2rem)] py-2",
  md: "text-base sm:text-lg py-2",
  sm: "text-sm py-2",
} as const;

/** A lowercase, clickable mailto link that heats and lets off steam. */
export function EmailLink({ address, size = "md", subject, className = "" }: EmailLinkProps) {
  const email = address.toLowerCase();
  const href = mailtoHref(address, subject);
  const [puff, setPuff] = useState(false);

  return (
    <a
      href={href}
      data-puff={puff}
      onPointerDown={() => {
        setPuff(false);
        requestAnimationFrame(() => setPuff(true));
      }}
      onAnimationEnd={() => setPuff(false)}
      className={`steam heat-hover inline-flex min-h-11 items-center font-mono [overflow-wrap:anywhere] text-chrome lowercase underline decoration-chrome/20 decoration-1 underline-offset-[6px] hover:decoration-molten focus-visible:decoration-molten ${sizes[size]} ${className}`}
    >
      {email}
    </a>
  );
}
