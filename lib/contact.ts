/**
 * Contact form rules shared by the browser (instant feedback) and the /api/contact route (the real check).
 * No imports, so node --test can load it directly.
 */

/** Public Turnstile site key. Cloudflare's always-pass test key until launch (see the plan's Task 14). */
export const TURNSTILE_SITE_KEY = "1x00000000000000000000AA";

export const SALES_INBOX = "sales@visionforgestudio.app";

/** Hidden field people never see. Bots that fill every input fill this one too. */
export const HONEYPOT_FIELD = "website";

export const LANE_OPTIONS = [
  { id: "small", label: "Small business" },
  { id: "growing", label: "Growing team or established company" },
  { id: "unsure", label: "Not sure yet" },
] as const;

export type Lane = (typeof LANE_OPTIONS)[number]["id"];

export const CONTACT_FIELDS = ["name", "business", "email", "whatTheyDo", "slowingDown", "lane"] as const;
export type ContactField = (typeof CONTACT_FIELDS)[number];
type TextField = Exclude<ContactField, "lane">;

export const FIELD_LIMITS: Record<TextField, number> = {
  name: 100,
  business: 120,
  email: 254,
  whatTheyDo: 300,
  slowingDown: 2000,
};

const REQUIRED: Record<ContactField, string> = {
  name: "Enter your name.",
  business: "Enter your business name.",
  email: "Enter your email so we can reply.",
  whatTheyDo: "Tell us what your business does.",
  slowingDown: "Tell us what's slowing you down.",
  lane: "Choose the option that fits you best.",
};

export type ContactData = {
  name: string;
  business: string;
  email: string;
  whatTheyDo: string;
  slowingDown: string;
  lane: Lane;
};

export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function asRecord(raw: unknown): Record<string, unknown> {
  return raw !== null && typeof raw === "object" ? (raw as Record<string, unknown>) : {};
}

function clean(value: unknown, multiline: boolean): string {
  if (typeof value !== "string") return "";
  if (multiline) return value.replace(/\r\n?/g, "\n").replace(CONTROL, "").trim();
  return value.replace(/[\r\n\t]+/g, " ").replace(CONTROL, "").replace(/\s+/g, " ").trim();
}

function isLane(value: string): value is Lane {
  return LANE_OPTIONS.some((option) => option.id === value);
}

export function validateContact(raw: unknown): { ok: true; data: ContactData } | { ok: false; errors: ContactErrors } {
  const input = asRecord(raw);
  const values: Record<ContactField, string> = {
    name: clean(input.name, false),
    business: clean(input.business, false),
    email: clean(input.email, false).toLowerCase(),
    whatTheyDo: clean(input.whatTheyDo, false),
    slowingDown: clean(input.slowingDown, true),
    lane: clean(input.lane, false),
  };

  const errors: ContactErrors = {};
  for (const field of CONTACT_FIELDS) {
    if (!values[field]) errors[field] = REQUIRED[field];
  }
  for (const field of Object.keys(FIELD_LIMITS) as TextField[]) {
    if (!errors[field] && values[field].length > FIELD_LIMITS[field]) {
      errors[field] = `Keep this under ${FIELD_LIMITS[field]} characters.`;
    }
  }
  if (!errors.email && !EMAIL.test(values.email)) errors.email = "Enter a valid email address, like name@business.com.";
  if (!errors.lane && !isLane(values.lane)) errors.lane = REQUIRED.lane;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, data: { ...values, lane: values.lane as Lane } };
}

export function isLikelyBot(raw: unknown): boolean {
  const value = asRecord(raw)[HONEYPOT_FIELD];
  return typeof value === "string" && value.trim() !== "";
}

export type OutgoingEmail = { to: string; replyTo: string; subject: string; text: string };

export function buildEnquiryEmail(data: ContactData): OutgoingEmail {
  const lane = LANE_OPTIONS.find((option) => option.id === data.lane)?.label ?? data.lane;
  return {
    to: SALES_INBOX,
    replyTo: data.email,
    subject: `New enquiry from ${data.business}`,
    text: [
      `Name: ${data.name}`,
      `Business: ${data.business}`,
      `Email: ${data.email}`,
      `Which fits best: ${lane}`,
      "",
      "What the business does:",
      data.whatTheyDo,
      "",
      "What's slowing them down:",
      data.slowingDown,
      "",
      "Sent from the contact form on visionforgestudio.app",
    ].join("\n"),
  };
}

export type ContactResponse =
  | { ok: true }
  | { ok: false; reason: "invalid"; errors: ContactErrors }
  | { ok: false; reason: "verification" }
  | { ok: false; reason: "failed" };

export type ContactDeps = {
  verifyToken: (token: string) => Promise<boolean>;
  send: (email: OutgoingEmail) => Promise<boolean>;
};

export async function handleContact(raw: unknown, deps: ContactDeps): Promise<{ status: number; body: ContactResponse }> {
  if (isLikelyBot(raw)) return { status: 200, body: { ok: true } };

  const result = validateContact(raw);
  if (!result.ok) return { status: 400, body: { ok: false, reason: "invalid", errors: result.errors } };

  const token = asRecord(raw).token;
  let verified = false;
  if (typeof token === "string" && token !== "" && token.length <= 2048) {
    try {
      verified = await deps.verifyToken(token);
    } catch {
      verified = false;
    }
  }
  if (!verified) return { status: 403, body: { ok: false, reason: "verification" } };

  try {
    if (!(await deps.send(buildEnquiryEmail(result.data)))) return { status: 502, body: { ok: false, reason: "failed" } };
  } catch {
    return { status: 502, body: { ok: false, reason: "failed" } };
  }
  return { status: 200, body: { ok: true } };
}
