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
  { href: "/automation", label: "Automation" },
  { href: "/websites", label: "Websites" },
  { href: "/pricing", label: "Pricing" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/contact", label: "Contact" },
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
  kicker: "Belize · Automation & websites",
  title: ["Your business,", "minus the"],
  goldWord: "busywork.",
  lede: "We wire up the tools you already use, like WhatsApp, spreadsheets and your accounting software, so orders, invoices and reminders take care of themselves. And we build the website that brings the orders in.",
  primary: { label: "Price your project", href: "/pricing" },
  secondary: { label: "See how it works", href: "/automation" },
  meta: ["From BZ$500*", "Fixed written quotes", "Free first chat"],
  stamp: "Est. Belize · Reg. 000058528",
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
    fix: "A fast, professional website with WhatsApp and call buttons.",
  },
] as const satisfies ReadonlyArray<{ id: string; icon: AutomationIcon; pain: string; fix: string }>;

export type IndustryIcon = "cart" | "phone" | "food" | "palm" | "health" | "briefcase" | "store" | "truck";

/** Kinds of business we build for. E-commerce and virtual shops lead. */
export const industries = [
  {
    id: "ecommerce",
    icon: "cart",
    name: "E-commerce and online stores",
    copy: "Product catalogues, secure checkout and every order landing in one place.",
  },
  {
    id: "virtual",
    icon: "phone",
    name: "Virtual shops and social sellers",
    copy: "Sell through Instagram, Facebook and WhatsApp, with orders and payments tracked for you.",
  },
  {
    id: "food",
    icon: "food",
    name: "Restaurants and food delivery",
    copy: "Menus, online ordering and delivery updates without the message chaos.",
  },
  {
    id: "tourism",
    icon: "palm",
    name: "Tourism, tours and hotels",
    copy: "Bookings, deposits and guest reminders, ready for visitors from anywhere.",
  },
  {
    id: "health",
    icon: "health",
    name: "Clinics, salons and wellness",
    copy: "Appointments, reminders and client records in one calm system.",
  },
  {
    id: "services",
    icon: "briefcase",
    name: "Professional services",
    copy: "Quotes, invoices and client follow-ups that go out on time, every time.",
  },
  {
    id: "retail",
    icon: "store",
    name: "Retail and wholesale",
    copy: "Stock, sales and reorders that finally match your books.",
  },
  {
    id: "logistics",
    icon: "truck",
    name: "Logistics and delivery",
    copy: "Jobs, drivers and proof of delivery, tracked from a phone.",
  },
] as const satisfies ReadonlyArray<{ id: string; icon: IndustryIcon; name: string; copy: string }>;

export const industryRibbon = [
  "Hardware stores",
  "Real estate",
  "Schools and training",
  "Non-profits",
  "Auto parts",
  "Bakeries",
  "Gyms and fitness",
  "Event planners",
  "Car rentals",
  "Pharmacies",
  "Construction",
  "Property management",
] as const;

export const websiteKinds = [
  {
    id: "business",
    title: "Business websites",
    points: ["Your services, hours, photos and map", "WhatsApp and call buttons on every page", "Enquiry forms that land in your inbox"],
  },
  {
    id: "ecommerce",
    title: "E-commerce stores",
    points: ["Product catalogue with photos and prices", "Secure checkout and order tracking", "Orders and stock kept in one place"],
  },
  {
    id: "virtual",
    title: "Virtual shops",
    points: [
      "A catalogue customers browse from Instagram or WhatsApp",
      "Orders arrive ready to confirm, not as scattered messages",
      "Payments and deliveries tracked for you",
    ],
  },
  {
    id: "booking",
    title: "Booking sites",
    points: ["Customers pick a time themselves", "Deposits and reminders sent automatically", "No more double-bookings"],
  },
] as const;

export const websiteIncludes = [
  "Fast on any phone",
  "Your own domain and business email",
  "WhatsApp and call buttons",
  "Enquiry and contact forms",
  "Easy updates, or we update it for you",
  "Secure hosting and backups",
] as const;

export const worksWith = [
  "WhatsApp",
  "Spreadsheets (Excel or Google Sheets)",
  "Your accounting software",
  "Email",
  "Your website or online store",
] as const;

export const promises = [
  { title: "A fixed written quote", copy: "You know the price before any work starts." },
  { title: "You own what we build", copy: "Once it's paid for, it's yours." },
  { title: "Support after launch", copy: "We show your team how it works and stay on for fixes and updates." },
  { title: "Plain language", copy: "No tech talk. We explain everything in everyday words." },
] as const;

export const pageIndex = [
  { href: "/automation", title: "Automation", copy: "Orders, invoices, reminders and reports that run themselves.", cta: "Explore" },
  { href: "/websites", title: "Websites", copy: "Online stores, virtual shops and sites that bring in work.", cta: "Explore" },
  { href: "/pricing", title: "Pricing", copy: "Build your project and see the starting price as you go.", cta: "Price it" },
  { href: "/how-we-work", title: "How we work", copy: "A free chat, a fixed quote, and support after launch.", cta: "Read" },
] as const;

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
    copy: "A professional website or landing page with WhatsApp and call buttons, so customers can reach you in one tap.",
    includes: ["Business website or landing page", "WhatsApp and call buttons", "Enquiry and contact forms", "Fast on any phone"],
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
