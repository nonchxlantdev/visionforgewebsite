/**
 * Data and timing for the homepage's 3D hub: a business's everyday tools,
 * disconnected at first, then connected to Vision Forge. No imports, so node --test can load it.
 */

export type HubToolId = "whatsapp" | "sheets" | "forms" | "bookings" | "accounting" | "website" | "payments" | "reports";

export type HubTool = { id: HubToolId; label: string; bottleneck: boolean };

export const HUB_TOOLS: readonly HubTool[] = [
  { id: "whatsapp", label: "WhatsApp", bottleneck: false },
  { id: "sheets", label: "Spreadsheets", bottleneck: false },
  { id: "forms", label: "Paper forms", bottleneck: true },
  { id: "bookings", label: "Bookings", bottleneck: false },
  { id: "accounting", label: "Accounting", bottleneck: true },
  { id: "website", label: "Website", bottleneck: false },
  { id: "payments", label: "Payments", bottleneck: false },
  { id: "reports", label: "Reports", bottleneck: true },
];

/** How long each half of the loop lasts. */
export const DISCONNECTED_MS = 3500;
export const CONNECTED_MS = 5000;

/** Where the loop is: which phase, and how far through it (0 to 1). */
export function hubPhase(elapsedMs: number): { connected: boolean; progress: number } {
  const cycle = DISCONNECTED_MS + CONNECTED_MS;
  const t = Math.max(0, elapsedMs) % cycle;
  if (t < DISCONNECTED_MS) return { connected: false, progress: t / DISCONNECTED_MS };
  return { connected: true, progress: (t - DISCONNECTED_MS) / CONNECTED_MS };
}

/**
 * Floor positions [x, z] for the tiles: two arcs, left and right of the hub
 * (above and below it on portrait screens), so the hub stays clear and the cables never cross it.
 */
export function tileLayout(count: number, portrait = false): Array<[number, number]> {
  const perSide = Math.ceil(count / 2);
  const spots: Array<[number, number]> = [];
  for (let i = 0; i < count; i++) {
    const side = i < perSide ? -1 : 1;
    const k = i % perSide;
    const angle = (-0.62 + (1.24 * k) / Math.max(1, perSide - 1)) * Math.PI * 0.5;
    const along = side * 4.7 * Math.cos(angle);
    const across = 3.1 * Math.sin(angle);
    spots.push(portrait ? [across, along] : [along, across]);
  }
  return spots;
}

/** Cable center height, and the hub block's center height (the block is 0.9 tall). */
export const HUB_CABLE_Y = 0.06;
export const HUB_BODY_Y = 0.62;

/**
 * Where a cable from a tile at (x, z) ends.
 * The point sits under the middle of the block, on the tile's side, so the
 * block covers the end and the cable reads as running behind the box.
 */
export function hubCableEnd(x: number, z: number): { x: number; y: number; z: number } {
  const len = Math.hypot(x, z) || 1;
  return { x: (x / len) * 0.15, y: HUB_CABLE_Y, z: (z / len) * 0.15 };
}

/** Camera distance for a canvas aspect ratio (width / height): further back when narrow. */
export function cameraDistance(aspect: number): number {
  const a = Math.min(2.4, Math.max(0.5, aspect));
  if (a < 1) return 15.5 + (1 - a) * 12;
  return 13.5 + Math.max(0, 1.6 - a) * 10;
}
