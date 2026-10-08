import { MAX_MESSAGE, mailtoHref, strictEncode } from "./safe-href.ts";
import { formatBZ, site, tierOrder, tiers, type TierId } from "./site.ts";

export type Problem = "orders" | "payments" | "forms" | "bookings" | "reports" | "accounts" | "website" | "unsure";
export type Budget = "under1500" | "to8000" | "over8000" | "unsure";

export type Business =
  | "ecommerce"
  | "virtual"
  | "food"
  | "tourism"
  | "health"
  | "services"
  | "retail"
  | "logistics"
  | "other";

export type StartState = {
  business: Business | null;
  problems: Problem[];
  budget: Budget;
};

export const BUSINESSES: ReadonlyArray<{ id: Business; label: string; noun: string | null }> = [
  { id: "ecommerce", label: "Online store", noun: "online store" },
  { id: "virtual", label: "Virtual shop / social seller", noun: "virtual shop" },
  { id: "food", label: "Restaurant or food", noun: "restaurant" },
  { id: "tourism", label: "Tourism or hotel", noun: "tourism business" },
  { id: "health", label: "Clinic, salon or wellness", noun: "clinic or salon" },
  { id: "services", label: "Professional services", noun: "professional services firm" },
  { id: "retail", label: "Retail or wholesale", noun: "retail business" },
  { id: "logistics", label: "Logistics or delivery", noun: "delivery business" },
  { id: "other", label: "Something else", noun: null },
];

export const PROBLEMS: ReadonlyArray<{ id: Problem; label: string; phrase: string; tier: TierId | null }> = [
  { id: "orders", label: "Typing up orders", phrase: "typing up orders", tier: "automate" },
  { id: "payments", label: "Chasing payments", phrase: "chasing payments", tier: "automate" },
  { id: "forms", label: "Paper forms", phrase: "paper forms", tier: "automate" },
  { id: "bookings", label: "Bookings", phrase: "keeping track of bookings", tier: "automate" },
  { id: "reports", label: "Weekly reports", phrase: "building weekly reports", tier: "connect" },
  { id: "accounts", label: "Sales and accounts don't match", phrase: "sales and accounts that don't match", tier: "connect" },
  { id: "website", label: "I need a website", phrase: "needing a website", tier: "found" },
  { id: "unsure", label: "Not sure yet", phrase: "not sure where to start", tier: null },
];

export const BUDGETS: ReadonlyArray<{ id: Budget; label: string; ceiling: number | null }> = [
  { id: "under1500", label: "Under BZ$1,500", ceiling: 1499 },
  { id: "to8000", label: "BZ$1,500–8,000", ceiling: 8000 },
  { id: "over8000", label: "BZ$8,000+", ceiling: Infinity },
  { id: "unsure", label: "Not sure", ceiling: null },
];

export const EMPTY_STATE: StartState = { business: null, problems: [], budget: "unsure" };

const problemOrder = PROBLEMS.map((p) => p.id);
const rank = (tier: TierId) => tierOrder.indexOf(tier);
const find = <T extends { id: string }>(list: ReadonlyArray<T>, id: string) => list.find((item) => item.id === id);
const article = (word: string) => (/^[aeiou]/i.test(word) ? "an" : "a");
const quoted = (tier: TierId) => `“${tiers[tier].label}”`;

/** "Not sure yet" is exclusive; everything else toggles. Result keeps the canonical order. */
export function toggleProblem(selected: readonly Problem[], problem: Problem): Problem[] {
  if (problem === "unsure") return selected.includes("unsure") ? [] : ["unsure"];
  const next = new Set<Problem>(selected.filter((p) => p !== "unsure"));
  if (next.has(problem)) next.delete(problem);
  else next.add(problem);
  return problemOrder.filter((p) => next.has(p));
}

export function suggestedTier(problems: readonly Problem[]): TierId | null {
  let best: TierId | null = null;
  for (const problem of problems) {
    const tier = find(PROBLEMS, problem)?.tier ?? null;
    if (tier && (best === null || rank(tier) > rank(best))) best = tier;
  }
  return best;
}

export type Fit = { kind: "fits" } | { kind: "smaller"; startTier: TierId } | { kind: "unknown" };

export function budgetFit(tier: TierId | null, budget: Budget): Fit {
  const ceiling = find(BUDGETS, budget)?.ceiling ?? null;
  if (tier === null || ceiling === null) return { kind: "unknown" };
  if (ceiling >= tiers[tier].from) return { kind: "fits" };
  const affordable = tierOrder.filter((t) => tiers[t].from <= ceiling);
  return { kind: "smaller", startTier: affordable[affordable.length - 1] ?? "found" };
}

export function canSend(state: StartState): boolean {
  return state.problems.length > 0;
}

export type Suggestion = { tier: TierId | null; headline: string; budgetLine: string | null };

export function suggestion(state: StartState): Suggestion {
  if (!canSend(state)) {
    return { tier: null, headline: "Pick what's slowing you down and we'll suggest where to start.", budgetLine: null };
  }
  const tier = suggestedTier(state.problems);
  if (tier === null) {
    return { tier: null, headline: "No problem. Send it over and we'll suggest the right first step.", budgetLine: null };
  }
  const label = tiers[tier].label;
  const headline = `Sounds like ${article(label)} ${quoted(tier)} project.`;
  const fit = budgetFit(tier, state.budget);
  const budgetLine =
    fit.kind === "fits"
      ? "Your budget fits this."
      : fit.kind === "smaller"
        ? `Your budget fits a smaller first step. We'd start with ${quoted(fit.startTier)} and add the rest later.`
        : null;
  return { tier, headline, budgetLine };
}

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function buildMessage(state: StartState): string {
  if (!canSend(state)) return "";
  const budget = find(BUDGETS, state.budget)!.label;
  const body = state.problems.includes("unsure")
    ? "something's slowing my business down but I'm not sure where to start"
    : `here's what's slowing my business down: ${joinList(state.problems.map((p) => find(PROBLEMS, p)!.phrase))}`;
  const noun = state.business ? find(BUSINESSES, state.business)?.noun : null;
  const intro = noun ? `Hi Vision Forge, I run ${article(noun)} ${noun}. ` : "Hi Vision Forge, ";
  const text = noun ? `${body.charAt(0).toUpperCase()}${body.slice(1)}` : body;
  const message = `${intro}${text}. Budget: ${budget}. Can we talk?`;
  return message.length <= MAX_MESSAGE ? message : `${message.slice(0, MAX_MESSAGE - 1)}…`;
}

export function whatsappHref(state: StartState): string | undefined {
  if (!canSend(state)) return undefined;
  return `${site.whatsapp.href}?text=${strictEncode(buildMessage(state))}`;
}

export function emailHref(state: StartState): string | undefined {
  if (!canSend(state)) return undefined;
  return mailtoHref(site.sales.display, "Project enquiry", buildMessage(state));
}

export { formatBZ };
