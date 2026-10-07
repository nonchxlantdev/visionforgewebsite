"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { writeStore } from "@/lib/storage";

/**
 * First-visit intro. The overlay is server-rendered and fades out by itself in CSS,
 * so it never depends on JS. An inline script in the root layout marks repeat visits
 * (html[data-ignited]) before first paint so the overlay never shows twice.
 */
export function Ignition() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    writeStore("session", "vf-ignited", "1");
    const skip = () => setGone(true);
    const timer = window.setTimeout(skip, 1700);
    window.addEventListener("pointerdown", skip, { once: true });
    window.addEventListener("keydown", skip, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("keydown", skip);
    };
  }, []);

  if (gone) return null;

  return (
    <div className="ignition" aria-hidden>
      <span className="ignition-ember" />
      <span className="ignition-flash" />
      <Image
        src="/brand/vision-forge-logo.png"
        alt=""
        width={819}
        height={819}
        sizes="200px"
        className="ignition-logo h-40 w-40 object-contain sm:h-52 sm:w-52"
      />
    </div>
  );
}
