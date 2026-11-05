/**
 * Data and timing for the homepage's "connected business" panel.
 * One real piece of work comes in on the left, passes through Vision Forge,
 * and updates every tool on the right. No imports, so node --test can load it.
 */

export type FlowSourceId = "whatsapp" | "website" | "forms" | "bookings";
export type FlowTargetId = "sheets" | "accounting" | "payments" | "reports";

/** Where work comes in (left), and where it ends up (right). Labels match HUB_TOOLS. */
export const FLOW_SOURCES: readonly { id: FlowSourceId; label: string }[] = [
  { id: "whatsapp", label: "WhatsApp" },
  { id: "website", label: "Website" },
  { id: "forms", label: "Paper forms" },
  { id: "bookings", label: "Bookings" },
];

export const FLOW_TARGETS: readonly { id: FlowTargetId; label: string }[] = [
  { id: "sheets", label: "Spreadsheets" },
  { id: "accounting", label: "Accounting" },
  { id: "payments", label: "Payments" },
  { id: "reports", label: "Reports" },
];

/** One example job per source. Names and amounts are illustrative. */
export type FlowStory = {
  source: FlowSourceId;
  /** What arrives in the source tool. */
  incoming: string;
  /** The row that lands in the spreadsheet. */
  row: [string, string, string];
  invoice: string;
  amount: string;
  /** How it was paid. */
  method: string;
  /** The report's headline number after this job. */
  report: string;
  /** One line under the panel, in plain words. */
  caption: string;
};

export const FLOW_STORIES: readonly FlowStory[] = [
  {
    source: "whatsapp",
    incoming: "Hi! Can I get 2 boxes delivered Saturday?",
    row: ["Ramirez", "2 boxes", "Sat"],
    invoice: "INV-1043",
    amount: "BZ$84.00",
    method: "Bank transfer",
    report: "19 orders today",
    caption: "A WhatsApp message becomes an order, an invoice, a payment and a report line. Nobody retypes it.",
  },
  {
    source: "website",
    incoming: "Order #2219 · 3 items",
    row: ["Order #2219", "3 items", "Fri"],
    invoice: "INV-1044",
    amount: "BZ$156.00",
    method: "Card",
    report: "20 orders today",
    caption: "A website order flows straight into your records and books, without copy and paste.",
  },
  {
    source: "forms",
    incoming: "Job sheet: AC service, Unit 4",
    row: ["Unit 4", "AC service", "Tue"],
    invoice: "INV-1045",
    amount: "BZ$220.00",
    method: "Cash",
    report: "13 jobs this week",
    caption: "A paper job sheet gets captured once, then invoiced and tracked automatically.",
  },
  {
    source: "bookings",
    incoming: "Sat 10:00 AM · Consultation",
    row: ["Bayview Co.", "Consult", "Sat"],
    invoice: "INV-1046",
    amount: "BZ$120.00",
    method: "Card",
    report: "8 bookings this week",
    caption: "A booking confirms itself, bills itself and shows up in your numbers.",
  },
];

/** The loop runs in ticks. */
export const FLOW_TICK_MS = 250;
/** Ticks per story: source lights (0–3), hub (4–5), targets one after another, then a hold. */
export const FLOW_STORY_TICKS = 22;
export const FLOW_HUB_TICK = 4;
export const FLOW_FIRST_TARGET_TICK = 6;
export const FLOW_TARGET_GAP = 2;

export type FlowState = {
  /** Which story is playing. */
  story: number;
  /** Ticks into the story. */
  local: number;
  /** The source is sending (its line pulses toward the hub). */
  sending: boolean;
  /** The hub is passing the job on. */
  hubActive: boolean;
  /** How many targets have received this story's job (0–4). */
  delivered: number;
};

/** Where the loop is after `tick` ticks. */
export function flowState(tick: number): FlowState {
  const t = Math.max(0, Math.floor(tick));
  const story = Math.floor(t / FLOW_STORY_TICKS) % FLOW_STORIES.length;
  const local = t % FLOW_STORY_TICKS;
  let delivered = 0;
  for (let k = 0; k < FLOW_TARGETS.length; k++) {
    if (local >= FLOW_FIRST_TARGET_TICK + k * FLOW_TARGET_GAP) delivered = k + 1;
  }
  return {
    story,
    local,
    sending: local < FLOW_HUB_TICK,
    hubActive: local >= FLOW_HUB_TICK && local < FLOW_FIRST_TARGET_TICK + FLOW_TARGETS.length * FLOW_TARGET_GAP,
    delivered,
  };
}

/** The tick at which target k receives the job. */
export function targetTick(k: number): number {
  return FLOW_FIRST_TARGET_TICK + k * FLOW_TARGET_GAP;
}
