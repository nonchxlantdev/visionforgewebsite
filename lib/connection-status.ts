export const WELD_PROMPT = "TAP THE PARTS TO WELD YOUR SYSTEM TOGETHER.";

type Part = { id: string; label: string };

/** Add a part to the chain once, in the order it was tapped. */
export function weld(chain: readonly number[], index: number, total: number): number[] {
  if (index < 0 || index >= total || chain.includes(index) || chain.length >= total) return [...chain];
  return [...chain, index];
}

export function isOnline(chain: readonly number[], total: number): boolean {
  return total > 0 && chain.length === total;
}

/** Each part is welded to the one before it; a complete chain closes into a loop. */
export function seams(chain: readonly number[], total: number): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  for (let i = 1; i < chain.length; i += 1) pairs.push([chain[i - 1], chain[i]]);
  if (isOnline(chain, total) && chain.length > 2) pairs.push([chain[chain.length - 1], chain[0]]);
  return pairs;
}

export function weldStatus(chain: readonly number[], parts: readonly Part[]): string {
  if (!chain.length) return "";
  const total = parts.length;
  if (isOnline(chain, total)) return `SYSTEM ONLINE · ${total}/${total} WELDED`;
  const last = parts[chain[chain.length - 1]];
  if (chain.length === 1) return `${last.id} · ${last.label} · HOT. TAP THE NEXT PART.`;
  return `WELDED ${chain.length}/${total} · ${last.id} · ${last.label} JOINED`;
}
