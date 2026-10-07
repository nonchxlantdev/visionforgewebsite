export const site = {
  name: "Vision Forge Studio",
  domain: "visionforgestudio.app",
  url: "https://visionforgestudio.app",
  title: "Websites, Apps & Business Systems in Belize | Vision Forge Studio",
  description:
    "Vision Forge Studio builds websites, online stores, booking systems, staff apps and business systems for businesses in Belize. Prices from BZ$500. Free first consultation.",
  tagline: ["Built for your business.", "Built for your budget."],
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
  { href: "/#what", id: "what", label: "What we build" },
  { href: "/#build", id: "build", label: "Build your project" },
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
  title: "Websites, apps and business systems for Belizean businesses.",
  lede: "We design and build the tools your business runs on. Whether you need your first website or a system that replaces paper forms and spreadsheets, we build it, launch it and look after it.",
  primary: "Message us on WhatsApp",
  secondary: "See what we can build",
  trust: "Based in Belize · Prices from BZ$500 · Free first consultation",
} as const;

export const doors = [
  {
    id: "small",
    tab: "I run a small business",
    tabHint: "A shop, restaurant, salon, tour operator or clinic.",
    problems: [
      "Customers can't find you on Google.",
      "Orders and bookings get lost in WhatsApp messages.",
      "You're still keeping records in a notebook.",
    ],
    builds: [
      { title: "A website people can find", copy: "Your hours, services, photos and a map, showing up when people search Google." },
      { title: "Online orders or a shop", copy: "Customers order or pay online; you get every order in one place." },
      { title: "Bookings and appointments", copy: "Clients pick a time themselves; you get reminders, not double-bookings." },
      { title: "A simple app for your staff", copy: "Track jobs, stock or deliveries from a phone." },
    ],
    typical: "Typical project: Launch or Grow tier · from BZ$500",
    example: "Example: a salon booking page",
  },
  {
    id: "company",
    tab: "I run a company or organisation",
    tabHint: "Teams, departments, lots of paperwork, existing software.",
    problems: [
      "Forms on paper or in spreadsheets.",
      "Departments can't see each other's work.",
      "Reports take days to put together.",
      "Your software doesn't talk to your other software.",
    ],
    builds: [
      { title: "Staff portals and internal apps", copy: "One place for your team's work, with the right access for each role." },
      { title: "Digital forms and checklists", copy: "Replace paper with forms on a phone or tablet, even offline." },
      { title: "Automatic reports and dashboards", copy: "Live numbers instead of spreadsheets you rebuild every week." },
      { title: "Connecting your systems", copy: "Make the software you already use share data automatically." },
    ],
    typical: "Typical project: Custom tier · from BZ$8,000",
    example: "Example: an operations dashboard",
  },
] as const;

export const steps = [
  { title: "Talk", copy: "A free chat on WhatsApp, by phone or in person. Tell us what you need." },
  { title: "Plan and price", copy: "We send a written plan with a fixed price before any work starts." },
  { title: "Build", copy: "You see progress as we build and tell us what to change." },
  { title: "Launch and support", copy: "We put it live, show you how it works and stay on to help." },
] as const;

export const faq = [
  {
    q: "Do I need to know anything technical?",
    a: "No. Tell us how your business works in your own words; we handle the technical side and explain things plainly.",
  },
  {
    q: "How much will my project cost?",
    a: "It depends on what you need. Websites start from BZ$500, and every project gets a fixed written quote before work starts.",
  },
  {
    q: "How long does it take?",
    a: "Most websites take 2–4 weeks. Bigger systems take longer; your plan will include a timeline.",
  },
  {
    q: "Who owns the website or app?",
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
    a: "We show you how to use it and stay available for support, updates and new features.",
  },
] as const;

export const principles = [
  { lead: "10+", support: "Years experience" },
  { lead: "Business", support: "Focused" },
  { lead: "Secure +", support: "Scalable" },
  { lead: "Real", support: "Support" },
  { lead: "Belize", support: "Based" },
] as const;

export type TierId = "launch" | "grow" | "custom";

/** Starting points shown on the pricing cards and used by the project builder. */
export const tiers = {
  launch: {
    id: "launch",
    label: "Launch",
    from: 500,
    weeks: "2–4 weeks",
    copy: "A professional website or landing page, mobile-friendly, set up on Google, with contact and WhatsApp buttons.",
  },
  grow: {
    id: "grow",
    label: "Grow",
    from: 2500,
    weeks: "4–8 weeks",
    copy: "Everything in Launch, plus online orders or a shop, bookings, or a simple app.",
  },
  custom: {
    id: "custom",
    label: "Custom",
    from: 8000,
    weeks: "8+ weeks",
    copy: "Staff portals, digital forms, automation, dashboards and connections between your systems, built around how you work.",
  },
} as const;

export const tierOrder: readonly TierId[] = ["launch", "grow", "custom"];

export function formatBZ(amount: number): string {
  return `BZ$${amount.toLocaleString("en-US")}`;
}

/** Kept for the earlier forge sections, which are still type-checked with the app. */
export const capabilities = [
  {
    index: "01",
    title: "Web Systems",
    metal: "Fe",
    copy: "Fast, high-performance sites and web platforms that represent your business properly and actually bring in work.",
    meta: "Experience layer",
  },
  {
    index: "02",
    title: "Custom Software",
    metal: "Cu",
    copy: "Applications shaped around how you really operate, instead of bending your business to fit off-the-shelf software.",
    meta: "Operations layer",
  },
  {
    index: "03",
    title: "Automation",
    metal: "Ti",
    copy: "Hammer out the repetitive work. Connect your processes so your team spends its time on what matters.",
    meta: "Process layer",
  },
  {
    index: "04",
    title: "Data + APIs",
    metal: "Ag",
    copy: "Secure, scalable data systems and integrations, so every piece of your technology talks to the rest.",
    meta: "Integration layer",
  },
  {
    index: "05",
    title: "Analytics",
    metal: "Au",
    copy: "Turn raw operational data into clear, honest numbers that support better decisions.",
    meta: "Insight layer",
  },
  {
    index: "06",
    title: "Cloud + Infrastructure",
    metal: "Cr",
    copy: "Reliable foundations, built to stay secure, available and ready to scale.",
    meta: "Foundation layer",
  },
] as const;

export const architectureNodes = [
  { id: "01", label: "YOUR BUSINESS", x: 11, y: 24 },
  { id: "02", label: "DIGITAL EXPERIENCE", x: 28, y: 64 },
  { id: "03", label: "APPLICATIONS", x: 45, y: 26 },
  { id: "04", label: "AUTOMATION", x: 61, y: 70 },
  { id: "05", label: "DATA", x: 76, y: 30 },
  { id: "06", label: "INSIGHT", x: 91, y: 62 },
] as const;

export const processSteps = [
  {
    index: "01",
    name: "Heat",
    classic: "Discover",
    copy: "We learn your goals, your constraints and how work really flows through your business.",
  },
  {
    index: "02",
    name: "Shape",
    classic: "Architect",
    copy: "We design the right structure and technology before a single line is written.",
  },
  {
    index: "03",
    name: "Strike",
    classic: "Build",
    copy: "We develop, integrate, test and refine until it rings true.",
  },
  {
    index: "04",
    name: "Temper",
    classic: "Deploy",
    copy: "We harden, secure and launch it, ready for real-world use.",
  },
  {
    index: "05",
    name: "Ship",
    classic: "Evolve",
    copy: "We stay on. Support, improvements and scale as your business grows.",
  },
] as const;
