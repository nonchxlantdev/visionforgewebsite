export const site = {
  name: "Vision Forge Studio",
  domain: "visionforgestudio.app",
  url: "https://visionforgestudio.app",
  title: "Vision Forge Studio | Software Forged for Business",
  description:
    "Vision Forge Studio forges websites, custom applications, automation, data systems and cloud infrastructure for businesses in Belize and beyond.",
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
  { href: "/#services", id: "services", label: "Services" },
  { href: "/#forge", id: "forge", label: "The Forge" },
  { href: "/#process", id: "process", label: "Process" },
  { href: "/#why", id: "why", label: "Why Us" },
  { href: "/#contact", id: "contact", label: "Contact" },
] as const;

export const legalItems = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/cookies", label: "Cookies" },
] as const;

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

export const principles = [
  { lead: "10+", support: "Years experience" },
  { lead: "Business", support: "Focused" },
  { lead: "Secure +", support: "Scalable" },
  { lead: "Real", support: "Support" },
  { lead: "Belize", support: "Based" },
] as const;
