export const site = {
  name: "Vision Forge Studio",
  domain: "visionforgestudio.app",
  url: "https://visionforgestudio.app",
  title: "Business Automation & Websites in Belize | Vision Forge Studio",
  description:
    "Vision Forge Studio connects and automates the tools Belizean businesses already use, like WhatsApp, spreadsheets and accounting software, and builds websites. Prices from BZ$500. Free first consultation.",
  trustLine: "10+ years building software · Based in Belize · Real support after launch",
  whatsapp: {
    label: "WhatsApp",
    display: "+501 615-7575",
    href: "https://wa.me/5016157575",
  },
  phone: {
    label: "Call",
    display: "+501 613-9219",
    href: "tel:+5016139219",
  },
  sales: {
    label: "Sales",
    display: "sales@visionforgestudio.app",
    href: "mailto:sales@visionforgestudio.app",
  },
  support: {
    label: "Support",
    display: "support@visionforgestudio.app",
    href: "mailto:support@visionforgestudio.app",
  },
  projectMailto: "mailto:sales@visionforgestudio.app?subject=New%20project%20enquiry",
  legal: {
    registeredName: "Vision Forge",
    tradingName: "Vision Forge Studio",
    form: "partnership",
    registeredUnder: "Business Names Act, Chapter 247",
    registrationNumber: "000058528",
    jurisdiction: "Belize",
    lastUpdated: "6 October 2026",
    copyrightYear: 2026,
  },
} as const;

export const navItems = [
  { href: "/#how", id: "how", label: "How it works" },
  { href: "/#automate", id: "automate", label: "What we automate" },
  { href: "/#pricing", id: "pricing", label: "Pricing" },
  { href: "/#faq", id: "faq", label: "FAQ" },
  { href: "/#contact", id: "contact", label: "Contact" },
] as const;

export const legalItems = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/cookies", label: "Cookies" },
] as const;

/** Small-print reminder shown next to every price on the site. */
export const priceNote = {
  text: "Prices shown are typical starting points, not final quotes. Your final price is confirmed in a written quote after we discuss your project.",
  href: "/disclaimer#estimates",
  linkLabel: "Read more",
} as const;

export const hero = {
  kicker: "Automation and websites · Belize",
  title: ["Stop doing the", "same work twice."],
  lede: "We connect the tools your business already uses, like WhatsApp, spreadsheets and your accounting software, so orders, invoices and reports happen on their own. We build websites too.",
  primary: "See how it works",
  secondary: "WhatsApp us",
  trust: "Based in Belize · Prices from BZ$500* · Free first consultation",
  flow: ["WhatsApp order", "Spreadsheet", "Invoice", "Reminder"],
} as const;

export type AutomationIcon = "wallet" | "forms" | "bookings" | "reports" | "accounts" | "website";

export const automations = [
  {
    id: "payments",
    icon: "wallet",
    pain: "I chase people to pay every week.",
    fix: "Automatic payment reminders on WhatsApp or email.",
  },
  {
    id: "forms",
    icon: "forms",
    pain: "My staff still fill in paper forms.",
    fix: "Forms on a phone that go straight into a report.",
  },
  {
    id: "bookings",
    icon: "bookings",
    pain: "Bookings get lost in my messages.",
    fix: "Customers book themselves; you get reminders.",
  },
  {
    id: "reports",
    icon: "reports",
    pain: "Every Friday I rebuild the same report.",
    fix: "A live dashboard that updates itself.",
  },
  {
    id: "accounts",
    icon: "accounts",
    pain: "My sales and my accounts never match up.",
    fix: "Your sales flow straight into your books.",
  },
  {
    id: "website",
    icon: "website",
    pain: "People can't find us online.",
    fix: "A fast website set up on Google, with WhatsApp buttons.",
  },
] as const satisfies ReadonlyArray<{ id: string; icon: AutomationIcon; pain: string; fix: string }>;

export const steps = [
  { title: "Tell us what's slowing you down.", copy: "A free chat on WhatsApp, by phone or in person." },
  {
    title: "We map it and send a fixed quote.",
    copy: "You see exactly what we'll build and what it costs before anything starts.",
  },
  {
    title: "We build it and set it up with your team.",
    copy: "We test it with your real work and show everyone how it runs.",
  },
  { title: "We stay on for support.", copy: "Fixes, updates and the next idea when you're ready for it." },
] as const;

export const faq = [
  {
    q: "Do I need to know anything technical?",
    a: "No. Tell us how your business works in your own words; we handle the technical side and explain things plainly.",
  },
  {
    q: "Do I have to change the software I already use?",
    a: "Usually not. Most of the time we connect what you already have, like WhatsApp, your spreadsheets and your accounting software.",
  },
  {
    q: "Is automation only for big companies?",
    a: "No. Most first projects automate one task, like invoices or payment reminders, and start from BZ$1,500.",
  },
  {
    q: "How much will my project cost?",
    a: "It depends on what you need. Websites start from BZ$500 and automation from BZ$1,500, and every project gets a fixed written quote before work starts.",
  },
  {
    q: "How long does it take?",
    a: "Most websites and single automations take 2–4 weeks. Bigger projects take longer; your quote includes a timeline.",
  },
  {
    q: "Who owns what you build?",
    a: "You do, once it's paid for. See our Terms of Service for details.",
    link: { href: "/terms", label: "Terms of Service" },
  },
  {
    q: "Can you fix or improve my existing website?",
    a: "Yes. Send us the link and tell us what's not working.",
  },
  {
    q: "Do you handle hosting and the domain?",
    a: "We can set up and manage hosting and your domain, or work with what you already have.",
  },
  {
    q: "What happens after launch?",
    a: "We show your team how to use it and stay available for support, updates and new features.",
  },
] as const;

export type TierId = "found" | "automate" | "connect";

/** Starting points shown on the pricing cards and used by the "slowing you down" picker. */
export const tiers = {
  found: {
    id: "found",
    label: "Get found",
    from: 500,
    weeks: "2–4 weeks",
    copy: "A website or landing page, set up on Google, with WhatsApp and call buttons.",
    includes: ["Business website or landing page", "Set up on Google", "WhatsApp and call buttons", "Fast on any phone"],
  },
  automate: {
    id: "automate",
    label: "Automate one task",
    from: 1500,
    weeks: "2–4 weeks",
    copy: "One job taken off your plate, like orders into a sheet with automatic invoices, or payment reminders.",
    includes: ["Orders saved to a spreadsheet", "Automatic invoices", "Payment or booking reminders", "Works with WhatsApp"],
  },
  connect: {
    id: "connect",
    label: "Connect your business",
    from: 8000,
    weeks: "8+ weeks",
    copy: "Several tools working together, plus staff portals, digital forms and dashboards.",
    includes: ["Sales flowing into your books", "Staff portals and digital forms", "Live dashboards", "Several tools working together"],
  },
} as const;

export const tierOrder: readonly TierId[] = ["found", "automate", "connect"];
export const featuredTier: TierId = "automate";

export function formatBZ(amount: number): string {
  return `BZ$${amount.toLocaleString("en-US")}`;
}
