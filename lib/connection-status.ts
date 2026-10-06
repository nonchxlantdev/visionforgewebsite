export const TAP_PROMPT = "TAP A NODE TO CONNECT THE SYSTEM.";

export function connectionStatus(node: { id: string; label: string } | null): string {
  if (!node) return "";
  return `${node.id} · ${node.label} · LINKED TO ALL`;
}
