import type { ReactNode } from "react";

export function Label({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={`flex items-center gap-3 font-mono text-[11px] font-medium tracking-[0.2em] text-molten uppercase ${className}`}
    >
      <span aria-hidden className="h-px w-8 bg-gradient-to-r from-ember to-molten" />
      {children}
    </p>
  );
}
