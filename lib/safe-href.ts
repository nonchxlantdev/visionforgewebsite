const HASH = /^#[A-Za-z][\w-]*$/;
const PATH = /^\/(?!\/)[A-Za-z0-9/_\-.]*?(?:#[A-Za-z][\w-]*)?$/;
const TEL = /^tel:\+[0-9]{6,15}$/;
const MAILTO = /^mailto:[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}(?:\?[a-z0-9._~%=&+-]*)?$/i;
const EMAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

/** Longest prefilled text we allow in a WhatsApp or email link. */
export const MAX_MESSAGE = 500;

/** encodeURIComponent plus the characters it leaves alone (! ' ( ) *), so links stay in the strict allow-list. */
export function strictEncode(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

function safeWhatsApp(url: URL): boolean {
  if (url.pathname !== "/5016157575" || url.hash !== "") return false;
  if (url.search === "") return true;
  const keys = [...url.searchParams.keys()];
  if (keys.length !== 1 || keys[0] !== "text") return false;
  const text = url.searchParams.get("text") ?? "";
  return text.length > 0 && text.length <= MAX_MESSAGE && !/[\u0000-\u0008\u000B-\u001F\u007F]/.test(text);
}

/** True for on-site paths and the site's own https, mailto, tel, and WhatsApp targets. */
export function isSafeNavigationHref(href: string): boolean {
  if (href.includes("\\") || /[\u0000-\u001F\u007F]/.test(href)) return false;
  if (HASH.test(href) || PATH.test(href) || TEL.test(href) || MAILTO.test(href)) return true;

  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }

  if (url.protocol !== "https:" || url.username || url.password) return false;
  if (url.hostname === "wa.me") return safeWhatsApp(url);
  return url.hostname === "visionforgestudio.app" || url.hostname === "www.visionforgestudio.app";
}

export function mailtoHref(address: string, subject?: string, body?: string): string | undefined {
  const email = address.trim().toLowerCase();
  if (!EMAIL.test(email)) return undefined;
  for (const part of [subject, body]) {
    if (part !== undefined && (/[\r\n]/.test(part) || part.length > MAX_MESSAGE)) return undefined;
  }
  const params = [
    subject ? `subject=${strictEncode(subject)}` : "",
    body ? `body=${strictEncode(body)}` : "",
  ].filter(Boolean);
  const href = `mailto:${email}${params.length ? `?${params.join("&")}` : ""}`;
  return isSafeNavigationHref(href) ? href : undefined;
}
