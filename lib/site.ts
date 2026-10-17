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

// ---------- Partner repositioning (October 2026) ----------

export const primaryNav = [
  { href: "/services", label: "Services" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/about", label: "About" },
] as const;

export const replyPromise = "We'll reply within one business day to set up a free conversation.";

export const home = {
  headline: "Your local tech partner. We bring business ideas to life.",
  lede: "A Belizean-owned team that learns how your business really runs, fixes what's slowing it down, and builds the technology to keep it moving.",
  primary: { label: "Tell us about your business", href: "/get-started" },
  secondary: { label: "See how we work", href: "/how-we-work" },
  trust: ["Belizean-owned", "Projects from BZ$500", "Free first conversation"],
} as const;

export const pains = [
  {
    id: "cracks",
    quote: "Things keep falling through the cracks and I can't see where.",
    answer: "We map how work moves through your business and show you exactly where it gets stuck.",
  },
  {
    id: "payments",
    quote: "I chase people to pay every week.",
    answer: "Payment reminders that go out on their own, by WhatsApp or email.",
  },
  {
    id: "reports",
    quote: "Every Friday I rebuild the same report.",
    answer: "A live dashboard that keeps itself up to date.",
  },
  {
    id: "forms",
    quote: "My staff still fill in paper forms.",
    answer: "Forms on a phone that go straight into your records.",
  },
] as const;

export type StageId = "understand" | "improve" | "build" | "support";

export type Stage = {
  id: StageId;
  name: string;
  title: string;
  summary: string;
  needIf: readonly string[];
  weDo: readonly string[];
  optional: boolean;
};

export const stages: readonly Stage[] = [
  {
    id: "understand",
    name: "Understand",
    title: "Business review and consultation",
    summary: "We learn how your business really runs, find what's slowing it down, and tell you plainly what to fix first.",
    needIf: [
      "You're busy every day but can't see where the time goes",
      "You know something needs to change, but not what",
      "You want an honest opinion before spending on new software",
    ],
    weDo: [
      "Sit with you and your team to see how work actually flows",
      "Spot bottlenecks, double work and things worth upgrading",
      "Give you a clear plan, in plain language, with what to do first",
    ],
    optional: false,
  },
  {
    id: "improve",
    name: "Improve",
    title: "Process improvement and automation",
    summary: "We take repetitive, manual work off your plate and connect the tools you already use so they work together.",
    needIf: [
      "You or your staff copy the same information from place to place",
      "Invoices, reminders or reports are still done by hand",
      "Your sales and your books never quite match",
    ],
    weDo: [
      "Simplify the steps before we automate anything",
      "Automatic invoices, reminders and follow-ups",
      "Connect WhatsApp, spreadsheets and your accounting software",
      "Live dashboards that update themselves",
    ],
    optional: false,
  },
  {
    id: "build",
    name: "Build",
    title: "Websites and custom builds",
    summary: "From a professional website to a system built around how you work, we bring the idea to life.",
    needIf: [
      "Customers can't find you online",
      "You sell on social media and orders get lost in messages",
      "You have an idea for an app, portal or system that doesn't exist yet",
    ],
    weDo: [
      "Business websites, online stores and booking sites",
      "Catalogues for selling through Instagram, Facebook and WhatsApp",
      "Custom systems, staff portals and apps built around your business",
    ],
    optional: false,
  },
  {
    id: "support",
    name: "Support",
    title: "Training and ongoing support",
    summary: "Want your team trained or someone on call after launch? We can stay on, project by project.",
    needIf: [
      "Your team is new to the tools we've set up",
      "You'd rather not handle updates and fixes yourself",
    ],
    weDo: ["Hands-on training for your staff", "Fixes, updates and improvements after launch"],
    optional: true,
  },
];

export const improveExamples = [
  { id: "payments", pain: "I chase people to pay every week.", fix: "Automatic payment reminders on WhatsApp or email." },
  { id: "forms", pain: "My staff still fill in paper forms.", fix: "Forms on a phone that go straight into a report." },
  { id: "bookings", pain: "Bookings get lost in my messages.", fix: "Customers book themselves, and you get reminders." },
  { id: "reports", pain: "Every Friday I rebuild the same report.", fix: "A live dashboard that updates itself." },
  { id: "accounts", pain: "My sales and my accounts never match up.", fix: "Your sales flow straight into your books." },
] as const;

export type FeaturedIndustryIcon = "cart" | "food" | "palm" | "health" | "briefcase" | "store";

export const featuredIndustries = [
  {
    id: "ecommerce",
    icon: "cart",
    name: "Online stores and social sellers",
    copy: "Catalogues, checkout and every order landing in one place.",
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
    copy: "Quotes, invoices and client follow-ups that go out on time.",
  },
  {
    id: "retail",
    icon: "store",
    name: "Retail and wholesale",
    copy: "Stock, sales and reorders that finally match your books.",
  },
] as const satisfies ReadonlyArray<{ id: string; icon: FeaturedIndustryIcon; name: string; copy: string }>;

export const moreIndustries = [
  "logistics and delivery",
  "hardware stores",
  "real estate",
  "schools and training",
  "non-profits",
  "auto parts",
  "bakeries",
  "gyms",
  "event planners",
  "car rentals",
  "pharmacies",
  "construction",
  "property management",
] as const;

export const whyUs = [
  {
    title: "Local and Belizean-owned",
    copy: "We know how business works here, from WhatsApp orders to cash on delivery, and we're close by when you need us.",
  },
  {
    title: "We learn before we suggest",
    copy: "We take the time to understand your business first, so what we recommend fits how you actually work.",
  },
  {
    title: "Support if you want it",
    copy: "Training for your team and help after launch are there if you want them, not built into every project.",
  },
] as const;

export const lanes = [
  {
    id: "small",
    title: "Small businesses",
    price: "From BZ$500",
    copy: "A clear, affordable starting point for shops, sellers and growing local businesses. We scope it with you and send a fixed quote.",
  },
  {
    id: "growing",
    title: "Growing teams and established companies",
    price: "Let's talk",
    copy: "More people, more processes, more systems. We start with a conversation and shape the work around your business.",
  },
] as const;

export const lanesNote = {
  text: "Prices are starting points. Your final price is confirmed in a written quote before any work starts.",
  href: "/disclaimer#estimates",
  linkLabel: "Read more",
} as const;

export const howWeWorkSteps = [
  {
    title: "A free first conversation",
    copy: "Tell us about your business and what's slowing you down. No cost and no pressure.",
  },
  {
    title: "We learn how your business runs",
    copy: "We look at how work really moves through your business, together with you and your team.",
  },
  {
    title: "A written plan and a fixed quote",
    copy: "You see exactly what we'll do and what it costs before anything starts.",
  },
  {
    title: "We build and test it with you, then hand it over",
    copy: "We test with your real work, adjust what needs adjusting, and hand over something your team can use.",
  },
] as const;

export const afterLaunch = {
  title: "Optional: training and ongoing support",
  copy: "If you'd like, we can train your staff on what we've built and stay on for fixes, updates and the next idea. It's your choice, project by project.",
} as const;

export const questions = [
  {
    q: "Do I need to be tech-savvy?",
    a: "No. Tell us how your business works in your own words. We handle the technical side and explain everything plainly.",
  },
  {
    q: "We're a small business. Is this for us?",
    a: "Yes. Many of the businesses we help are small, and projects start from BZ$500. We'll suggest a sensible first step for your size and budget.",
  },
  {
    q: "Do I have to change the software I already use?",
    a: "Usually not. Most of the time we improve and connect what you already have.",
  },
  {
    q: "Who owns what you build?",
    a: "You do, once it's paid for.",
    link: { href: "/terms", label: "See our Terms of Service" },
  },
  {
    q: "What happens after launch?",
    a: "It's yours to run. If you'd like, we can train your team and stay on for support, updates and new ideas.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on the size of the work. Smaller projects often take a few weeks, and your quote always includes a timeline.",
  },
] as const satisfies ReadonlyArray<{ q: string; a: string; link?: { href: string; label: string } }>;

export const about = {
  title: "Technology that fits how Belize does business.",
  lede: "We help businesses big and small run better, by understanding how they work and building what they need.",
  story: [
    "Vision Forge started with a simple idea: businesses in Belize deserve technology that fits the way they actually work. Too often, software gets bought first and the business is bent to fit it. We do it the other way round.",
    "We listen like business owners and build like engineers, so what we make fits your day-to-day, not just a feature list.",
    "Sometimes the answer is a new website or an app. Sometimes it's a simpler process and a couple of tools talking to each other. We'll tell you which, plainly.",
  ],
  beliefs: [
    { title: "Learn first", copy: "We understand your business before we recommend anything." },
    { title: "Explain plainly", copy: "No jargon. You'll always know what we're doing and why." },
    { title: "Build things people use", copy: "If your team won't use it, it isn't finished." },
  ],
  owned: `We're Belizean-owned and registered in Belize as ${site.legal.registeredName} (Reg. No. ${site.legal.registrationNumber}), trading as ${site.legal.tradingName}.`,
} as const;

export const closing = {
  title: "Tell us what's slowing you down.",
  copy: "The first conversation is free. We'll reply within one business day.",
  cta: { label: "Tell us about your business", href: "/get-started" },
} as const;
