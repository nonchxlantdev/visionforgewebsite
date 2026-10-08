import type { ReactNode } from "react";

export function Label({
  children,
  tone = "gold",
  className = "",
}: {
  children: ReactNode;
  tone?: "gold" | "muted";
  className?: string;
}) {
  return <p className={`label ${tone === "gold" ? "text-gold" : "text-steel-2"} ${className}`}>{children}</p>;
}
