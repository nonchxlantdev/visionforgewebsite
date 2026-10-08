/** The original brand PNG. Components keep pointing here; the image loader swaps in a small WebP. */
export const LOGO_SRC = "/brand/vision-forge-logo.png";

/** Pre-made WebP widths in public/brand (generated once from the PNG). */
export const LOGO_WIDTHS = [96, 160, 256, 384, 512, 640, 819, 1080, 1348] as const;

/** Intrinsic size of the brand PNG (trimmed emblem). */
export const LOGO_SIZE = { width: 1348, height: 1114 } as const;

export function logoVariant(width: number): string {
  const pick = LOGO_WIDTHS.find((w) => w >= width) ?? LOGO_WIDTHS[LOGO_WIDTHS.length - 1];
  return `/brand/vision-forge-logo-${pick}.webp`;
}

/** Static-host friendly image resolution: no runtime optimizer needed. */
export function resolveImage(src: string, width: number): string {
  return src === LOGO_SRC ? logoVariant(width) : src;
}
