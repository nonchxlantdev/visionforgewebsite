export type DemoMode = "manual" | "auto";

/** One WhatsApp order, handled by hand or automatically. Minutes are illustrative. */
export const DEMO_STEPS = [
  { manual: "Copy the order into a spreadsheet", auto: "Order saved to your sheet", note: "copy into excel tonight", minutes: 4 },
  { manual: "Write the invoice by hand", auto: "Invoice created", note: "write invoice ($46)", minutes: 4 },
  { manual: "Text the customer the total", auto: "Customer gets the total on WhatsApp", note: "text Maria the total", minutes: 2 },
  { manual: "Remind them to pay", auto: "Payment reminder sent on its own", note: "remind to pay fri!!", minutes: 2 },
] as const;

export const MANUAL_MINUTES = DEMO_STEPS.reduce((sum, step) => sum + step.minutes, 0);

export const DEMO_ORDER = "Hi, can I get 2 cases of water and 1 bag of rice for Thursday?";
export const DEMO_RECEIPT_TITLE = "Maria – 2 cs water, 1 rice (Thurs)";
export const DEMO_REPLY = "Thanks Maria! Your total is BZ$46.00. Invoice attached.";

export const STEP_DELAY_MS = { manual: 1100, auto: 450 } as const;

/** Minutes of the owner's time shown on the counter after `completed` steps. */
export function minutesAfter(mode: DemoMode, completed: number): number {
  const count = Math.min(DEMO_STEPS.length, Math.max(0, Math.floor(completed)));
  const spent = DEMO_STEPS.slice(0, count).reduce((sum, step) => sum + step.minutes, 0);
  return mode === "manual" ? spent : MANUAL_MINUTES - spent;
}
