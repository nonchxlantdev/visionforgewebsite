"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

const FULL_MS = 3000;
const REDUCED_MS = 1000;

/** Full-load intro. The first render is the visible overlay; the timer removes it. */
export function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const site = document.getElementById("site");
    if (site) site.inert = true;
    const timer = window.setTimeout(() => {
      if (site) site.inert = false;
      setShow(false);
    }, reduce ? REDUCED_MS : FULL_MS);
    return () => {
      window.clearTimeout(timer);
      if (site) site.inert = false;
    };
  }, []);

  if (!show) return null;

  return (
    <div className="vf-intro fixed inset-0 z-[80] flex items-center justify-center bg-ink" role="status">
      <span className="vf-intro-line" aria-hidden />
      <Logo priority className="vf-intro-logo h-auto w-40" sizes="160px" />
    </div>
  );
}
