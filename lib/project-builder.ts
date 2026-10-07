import { MAX_MESSAGE, mailtoHref, strictEncode } from "./safe-href.ts";
import { formatBZ, site, tierOrder, tiers, type TierId } from "./site.ts";

export type Business = "retail" | "food" | "tourism" | "health" | "services" | "company" | "other";
export type Need = "website" | "orders" | "bookings" | "staffApp" | "forms" | "reports" | "integrations" | "unsure";
export type Budget = "under1k" | "to2500" | "to8000" | "over8000" | "unsure";
export type Timing = "asap" | "soon" | "exploring";

export type BuilderState = {
  business: Business | null;
  needs: Need[];
  budget: Budget;
  timing: Timing;
};

export const BUSINESSES: ReadonlyArray<{ id: Business; label: string; noun: string }> = [
  { id: "retail", label: "Shop or retail", noun: "shop" },
  { id: "food", label: "Restaurant or food", noun: "restaurant" },
  { id: "tourism", label: "Tourism or hotel", noun: "tourism business" },
  { id: "health", label: "Health or beauty", noun: "clinic or salon" },
  { id: "services", label: "Professional services", noun: "business" },
  { id: "company", label: "Company or organisation", noun: "organisation" },
  { id: "other", label: "Something else", noun: "business" },
];

export const NEEDS: ReadonlyArray<{ id: Need; label: string; phrase: string; tier: TierId | null }> = [
  { id: "website", label: "A website", phrase: "a website", tier: "launch" },
  { id: "orders", label: "Online orders or a shop", phrase: "online ordering", tier: "grow" },
  { id: "bookings", label: "Bookings or appointments", phrase: "online bookings", tier: "grow" },
  { id: "staffApp", label: "A staff app or portal", phrase: "a staff app", tier: "custom" },
  { id: "forms", label: "Digital forms instead of paper", phrase: "digital forms to replace paper", tier: "custom" },
  { id: "reports", label: "Reports or dashboards", phrase: "automatic reports and dashboards", tier: "custom" },
  { id: "integrations", label: "Connect my systems", phrase: "connections between your systems", tier: "custom" },
  { id: "unsure", label: "Not sure, help me decide", phrase: "help choosing the right tools", tier: null },
];

export const BUDGETS: ReadonlyArray<{ id: Budget; label: string; hint: string; ceiling: number | null }> = [
  { id: "under1k", label: "Under BZ$1,000", hint: "A great starter website", ceiling: 1000 },
  { id: "to2500", label: "BZ$1,000–2,500", hint: "A website with bookings or a small shop", ceiling: 2500 },
  { id: "to8000", label: "BZ$2,500–8,000", hint: "A full online store, app or first business system", ceiling: 8000 },
  { id: "over8000", label: "BZ$8,000+", hint: "A custom system built around your operation", ceiling: Infinity },
  { id: "unsure", label: "Not sure yet", hint: "We'll suggest options", ceiling: null },
];

export const TIMINGS: ReadonlyArray<{ id: Timing; label: string }> = [
  { id: "asap", label: "As soon as possible" },
  { id: "soon", label: "Within 1–3 months" },
  { id: "exploring", label: "Just exploring" },
];

export const EMPTY_STATE: BuilderState = { business: null, needs: [], budget: "unsure", timing: "exploring" };

const needOrder = NEEDS.map((n) => n.id);
const rank = (tier: TierId) => tierOrder.indexOf(tier);
const find = <T extends { id: string }>(list: ReadonlyArray<T>, id: string) => list.find((item) => item.id === id);

/** "Not sure" is exclusive; everything else toggles. Result keeps the canonical order. */
export function toggleNeed(selected: readonly Need[], need: Need): Need[] {
  if (need === "unsure") return selected.includes("unsure") ? [] : ["unsure"];
  const next = new Set<Need>(selected.filter((n) => n !== "unsure"));
  if (next.has(need)) next.delete(need);
  else next.add(need);
  return needOrder.filter((n) => next.has(n));
}

export function projectTier(needs: readonly Need[]): TierId | null {
  let best: TierId | null = null;
  for (const need of needs) {
    const tier = find(NEEDS, need)?.tier ?? null;
    if (tier && (best === null || rank(tier) > rank(best))) best = tier;
  }
  return best;
}

export type Fit = { kind: "fits" } | { kind: "phase-one"; startTier: TierId } | { kind: "unknown" };

export function budgetFit(tier: TierId | null, budget: Budget): Fit {
  const ceiling = find(BUDGETS, budget)?.ceiling ?? null;
  if (tier === null || ceiling === null) return { kind: "unknown" };
  if (ceiling >= tiers[tier].from) return { kind: "fits" };
  const affordable = tierOrder.filter((t) => tiers[t].from <= ceiling);
  return { kind: "phase-one", startTier: affordable[affordable.length - 1] ?? "launch" };
}

export function isComplete(state: BuilderState): boolean {
  return state.business !== null && state.needs.length > 0;
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

function needsPhrase(needs: readonly Need[]): string {
  return joinList(needOrder.filter((n) => needs.includes(n)).map((n) => find(NEEDS, n)!.phrase));
}

const nounFor = (business: Business) => find(BUSINESSES, business)!.noun;
const article = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");

export function summarize(state: BuilderState): string | null {
  if (!isComplete(state)) return null;
  const phrase = needsPhrase(state.needs);
  return `${phrase.charAt(0).toUpperCase()}${phrase.slice(1)} for your ${nounFor(state.business!)}.`;
}

export function cardMessage(state: BuilderState): string {
  const tier = projectTier(state.needs);
  if (tier === null) return "Tell us a bit about your business and we'll suggest the right starting point.";
  const t = tiers[tier];
  const fit = budgetFit(tier, state.budget);
  if (fit.kind === "fits") {
    return `Your budget fits this. Typical ${t.label} projects start from ${formatBZ(t.from)} and take ${t.weeks}.`;
  }
  if (fit.kind === "phase-one") {
    const s = tiers[fit.startTier];
    return `Your budget fits a smaller first version. We'd start with ${article(s.label)} ${s.label} project (from ${formatBZ(s.from)}) and add the rest in a second phase.`;
  }
  return `${t.label} projects start from ${formatBZ(t.from)} and usually take ${t.weeks}.`;
}

export function buildMessage(state: BuilderState): string {
  if (!isComplete(state)) return "";
  const noun = nounFor(state.business!);
  const budget = find(BUDGETS, state.budget)!.label;
  const timing = find(TIMINGS, state.timing)!.label;
  const message = `Hi Vision Forge! I run ${article(noun)} ${noun} and I'm interested in ${needsPhrase(state.needs)}. Budget: ${budget}. Timing: ${timing}. Can we talk?`;
  return message.length <= MAX_MESSAGE ? message : `${message.slice(0, MAX_MESSAGE - 1)}…`;
}

export function whatsappHref(state: BuilderState): string | undefined {
  if (!isComplete(state)) return undefined;
  return `${site.whatsapp.href}?text=${strictEncode(buildMessage(state))}`;
}

export function emailHref(state: BuilderState): string | undefined {
  if (!isComplete(state)) return undefined;
  return mailtoHref(site.sales.display, "Project enquiry", buildMessage(state));
}
