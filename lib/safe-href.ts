const HASH = /^#[A-Za-z][\w-]*$/;
const PATH = /^\/(?!\/)[A-Za-z0-9/_\-.]*?(?:#[A-Za-z][\w-]*)?$/;
const MAILTO = /^mailto:[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}(?:\?[a-z0-9._~%=&+-]*)?$/i;
const EMAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

/** Longest prefilled text we allow in an email link. */
export const MAX_MESSAGE = 500;

/** encodeURIComponent plus the characters it leaves alone (! ' ( ) *), so links stay in the strict allow-list. */
export function strictEncode(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
}

/** True for on-site paths and the site's own https and mailto targets. */
export function isSafeNavigationHref(href: string): boolean {
  if (href.includes("\\") || /[\u0000-\u001F\u007F]/.test(href)) return false;
  if (HASH.test(href) || PATH.test(href) || MAILTO.test(href)) return true;

  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return false;
  }

  if (url.protocol !== "https:" || url.username || url.password) return false;
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
