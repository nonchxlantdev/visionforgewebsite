"use client";

import { resolveImage } from "./logo-variants";

/**
 * next/image loader for static hosting (Cloudflare Workers via OpenNext).
 * Serves pre-sized files from /public instead of a paid on-the-fly optimizer.
 */
export default function imageLoader({ src, width }: { src: string; width: number; quality?: number }) {
  return resolveImage(src, width);
}
