import type { ReactNode } from "react";

export function Label({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p className={`text-[15px] font-semibold tracking-[-0.01em] sm:text-[17px] ${tone === "dark" ? "text-link-dark" : "text-link"} ${className}`}>
      {children}
    </p>
  );
}
