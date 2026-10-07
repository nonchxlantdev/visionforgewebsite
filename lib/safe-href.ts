const HASH = /^#[A-Za-z][\w-]*$/;
const PATH = /^\/(?!\/)[A-Za-z0-9/_\-.]*?(?:#[A-Za-z][\w-]*)?$/;
const TEL = /^tel:\+[0-9]{6,15}$/;
const MAILTO = /^mailto:[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}(?:\?[a-z0-9._~%=&+-]*)?$/i;
const EMAIL = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

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
  if (url.hostname === "wa.me") {
    return url.pathname === "/5016157575" && url.search === "" && url.hash === "";
  }
  return url.hostname === "visionforgestudio.app" || url.hostname === "www.visionforgestudio.app";
}

export function mailtoHref(address: string, subject?: string): string | undefined {
  const email = address.trim().toLowerCase();
  if (!EMAIL.test(email) || (subject !== undefined && /[\r\n]/.test(subject))) return undefined;
  const href = `mailto:${email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`;
  return isSafeNavigationHref(href) ? href : undefined;
}
