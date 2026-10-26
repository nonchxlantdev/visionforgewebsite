export const site = {
  name: "Vision Forge Studio",
  domain: "visionforgestudio.app",
  url: "https://visionforgestudio.app",
  title: "Vision Forge Studio | Business automation, systems integration and digital solutions in Belize",
  description:
    "Vision Forge helps businesses automate the work, connect their systems, and build technology that works for them. Belizean-owned. Projects from BZ$500. Free first conversation.",
  sales: {
    label: "Sales",
    display: "sales@visionforgestudio.app",
    href: "mailto:sales@visionforgestudio.app",
  },
  legal: {
    registeredName: "Vision Forge",
    tradingName: "Vision Forge Studio",
    form: "partnership",
    jurisdiction: "Belize",
    lastUpdated: "17 October 2026",
    copyrightYear: 2026,
  },
} as const;

export const legalItems = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
  { href: "/cookies", label: "Cookies" },
] as const;

// ---------- Partner repositioning (October 2026) ----------

export const primaryNav = [
  { href: "/services", label: "Services" },
  { href: "/how-we-work", label: "How we work" },
  { href: "/about", label: "About" },
] as const;

export const replyPromise = "We'll reply within one business day to set up a free conversation.";

export const home = {
  /** Small line above the headline naming the three things we do, in priority order. */
  eyebrow: ["Business automation", "Systems integration", "Digital solutions"],
  headline: "We turn ideas into technology that moves business forward.",
  lede: "Automate the work. Connect your systems. Unlock your potential.",
  detail:
    "We help businesses eliminate manual processes, connect the tools they rely on, and build smarter ways of working through business automation, systems integration and custom digital solutions.",
  /** Second paragraph: shown from tablet up so the phone hero stays short. */
  detailMore:
    "From connecting existing applications and automating everyday workflows to developing custom software and AI-powered solutions, we turn complex business challenges into practical technology that works for you.",
  /** Phrases in `detail` that the hero brightens so the offer can be scanned at a glance. */
  capabilities: ["business automation", "systems integration", "custom digital solutions"],
  primary: { label: "Tell us about your business", href: "/get-started" },
  secondary: { label: "See how we work", href: "/how-we-work" },
  trust: ["Belizean-owned", "Projects from BZ$500", "Free first conversation"],
} as const;

/** The one line we want every visitor to leave with. */
export const keyMessage =
  "Vision Forge helps businesses automate the work, connect their systems, and build technology that works for them.";

export const pains = [
  {
    id: "repetitive",
    quote: "We do the same tasks by hand, every single day.",
    answer: "Repetitive steps like data capture, notifications and status updates can run on their own.",
  },
  {
    id: "disconnected",
    quote: "None of our apps talk to each other.",
    answer: "We connect the tools you already use, where they support it, so information moves without you.",
  },
  {
    id: "duplicate",
    quote: "We type the same information into three places.",
    answer: "Enter it once and let it flow to the records, sheets and systems that need it.",
  },
  {
    id: "approvals",
    quote: "Approvals sit in someone's inbox for days.",
    answer: "Requests go to the right person automatically, with reminders until they're done.",
  },
  {
    id: "reports",
    quote: "Every Friday I rebuild the same report.",
    answer: "Dashboards that pull from your records and keep themselves up to date.",
  },
  {
    id: "followups",
    quote: "Enquiries and follow-ups fall through the cracks.",
    answer: "Every enquiry is captured, assigned and tracked, so nothing waits on memory.",
  },
] as const;

export type ServiceId = "automation" | "integration" | "ai" | "build" | "consult" | "support";

export type Service = {
  id: ServiceId;
  name: string;
  title: string;
  summary: string;
  needIf: readonly string[];
  weDo: readonly string[];
  /** Core services lead the site; the rest support them. */
  core: boolean;
  optional: boolean;
};

/** Core services first, in the agreed order, then consultation and optional support. */
export const services: readonly Service[] = [
  {
    id: "automation",
    name: "Automation",
    title: "Business process automation",
    summary: "We take repetitive, manual work off your team's plate so everyday workflows run on their own, reliably.",
    needIf: [
      "Your team repeats the same steps every day",
      "Notifications, reminders and approvals depend on someone remembering",
      "Reports are still put together by hand",
    ],
    weDo: [
      "Simplify the process before we automate anything",
      "Automate notifications, approvals, data capture and follow-ups",
      "Build multi-step workflows that move work from one stage to the next",
      "Automated reports and dashboards",
    ],
    core: true,
    optional: false,
  },
  {
    id: "integration",
    name: "Integration",
    title: "Systems integration",
    summary: "We connect the applications, databases and services you already rely on, so they share information instead of needing it re-typed.",
    needIf: [
      "Your tools don't talk to each other",
      "Staff copy information from one system into another",
      "Your sales, payments and books never quite match",
    ],
    weDo: [
      "Work with the tools you already have before suggesting replacements",
      "Connect applications, databases, payment services and communication channels",
      "Use APIs and other supported methods, within each provider's terms",
      "Confirm what's technically possible during discovery, before we quote",
    ],
    core: true,
    optional: false,
  },
  {
    id: "ai",
    name: "AI",
    title: "AI and intelligent workflows",
    summary: "We apply AI where it adds measurable value, as one part of a well-designed workflow, with people kept in control.",
    needIf: [
      "Your team spends hours reading, sorting or summarising information",
      "Incoming requests need to be classified and routed",
      "You want faster answers for customers without losing the human touch",
    ],
    weDo: [
      "Help process information from documents, forms and messages",
      "Classify and route incoming requests",
      "Assist customer support with suggested replies and answers",
      "Decision support that summarises what matters, for a person to act on",
    ],
    core: true,
    optional: false,
  },
  {
    id: "build",
    name: "Custom builds",
    title: "Custom software and digital solutions",
    summary: "When existing tools can't fully solve the problem, we build what's missing, designed around how you work.",
    needIf: [
      "No off-the-shelf tool fits the way your business runs",
      "Customers can't find you or order from you online",
      "You have an idea for a portal, app or platform that doesn't exist yet",
    ],
    weDo: [
      "Business websites, online stores and booking sites",
      "Web and mobile applications",
      "Dashboards, staff portals and business platforms",
    ],
    core: true,
    optional: false,
  },
  {
    id: "consult",
    name: "Consultation",
    title: "Business review and consultation",
    summary: "Not sure where to start? We learn how your business really runs, find what's slowing it down and tell you plainly what to fix first.",
    needIf: [
      "You're busy every day but can't see where the time goes",
      "You want an honest opinion before spending on new software",
    ],
    weDo: [
      "Sit with you and your team to see how work actually flows",
      "Spot bottlenecks, double work and what's worth automating",
      "A clear plan, in plain language, with what to do first",
    ],
    core: false,
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
    core: false,
    optional: true,
  },
];

export const coreServices = services.filter((s) => s.core);

export const automationExamples = [
  { id: "payments", pain: "I chase people to pay every week.", fix: "Payment reminders that go out on schedule by email, or WhatsApp where your setup supports it." },
  { id: "forms", pain: "My staff still fill in paper forms.", fix: "Forms on a phone that go straight into your records." },
  { id: "approvals", pain: "Approvals sit in someone's inbox for days.", fix: "Requests routed to the right person, with reminders until they're done." },
  { id: "reports", pain: "Every Friday I rebuild the same report.", fix: "A dashboard that updates itself from your records." },
  { id: "accounts", pain: "My sales and my accounts never match up.", fix: "Sales flow into your books, where your systems allow it." },
] as const;

export type WorkflowExample = {
  id: string;
  title: string;
  steps: readonly string[];
  outcome: string;
};

/** Examples of what we can design and implement; not integrations available out of the box. */
export const workflowExamples: readonly WorkflowExample[] = [
  {
    id: "sales",
    title: "Sales and customer management",
    steps: ["New enquiry captured", "Lead record created", "Right person notified", "Follow-up task scheduled"],
    outcome: "Leads get a timely response instead of going cold in an inbox.",
  },
  {
    id: "payments",
    title: "Payments and accounting",
    steps: ["Payment received", "Invoice or record updated", "Receipt or notification sent"],
    outcome: "Your records stay current without re-keying, where the provider and APIs allow it.",
  },
  {
    id: "operations",
    title: "Operations and reporting",
    steps: ["Forms and business systems", "Central records", "Live dashboards"],
    outcome: "Less duplicate entry, and no more rebuilding the same report by hand.",
  },
  {
    id: "service",
    title: "Customer service and communications",
    steps: ["Enquiry on a supported channel", "Captured and routed", "Tracked until resolved"],
    outcome: "Fewer requests lost in inboxes or message threads.",
  },
];

export const workflowNote =
  "These are examples of solutions we can design and implement, not ready-made connections. What's possible depends on your tools, access permissions, APIs, provider terms and security requirements, and we confirm it during discovery.";

export const audiences = [
  {
    id: "small",
    title: "Small businesses",
    copy: "Start with the one task that eats your day, like reminders, a form or a simple connection, and get that time back. Projects from BZ$500.",
  },
  {
    id: "growing",
    title: "Growing companies",
    copy: "More people and more tools mean more hand-offs. We connect them so work doesn't slip between teams as you grow.",
  },
  {
    id: "established",
    title: "Established organisations",
    copy: "Multi-step workflows across departments and systems, designed around your processes, access controls and security requirements.",
  },
] as const;

export const additionalServices = [
  "Business websites and online stores",
  "Web and mobile applications",
  "Dashboards and reporting",
  "Staff portals and business platforms",
  "Staff training and ongoing support",
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
    title: "Your tools first",
    copy: "We work with the systems you already use before recommending you replace anything.",
  },
  {
    title: "Honest about what's possible",
    copy: "We confirm what can connect, and how, during discovery, so there are no surprises after you've committed.",
  },
  {
    title: "Support if you want it",
    copy: "Training for your team and help after launch are there if you want them, not built into every project.",
  },
] as const;

export const lanes = [
  {
    id: "small",
    title: "Smaller projects",
    price: "From BZ$500",
    copy: "A single automation, a simple integration or a business website. We scope it with you and send a fixed quote.",
  },
  {
    id: "growing",
    title: "Complex integrations and larger organisations",
    price: "Let's talk",
    copy: "Multi-step workflows, several connected systems or enterprise needs. We start with a consultation, confirm what's technically possible, and shape the work around your business.",
  },
] as const;

export const lanesNote = {
  text: "Prices are starting points. Your final price is confirmed in a written quote before any work starts.",
  href: "/disclaimer#estimates",
  linkLabel: "Read more",
} as const;

export const howWeWorkSteps = [
  {
    title: "Discover",
    copy: "A free first conversation about your business, your tools and what's slowing you down.",
  },
  {
    title: "Map the workflow",
    copy: "We trace how work and information really move, with you and your team, and find where time is lost.",
  },
  {
    title: "Design the solution",
    copy: "A written plan and a fixed quote. We confirm what your systems can support before anything starts.",
  },
  {
    title: "Integrate and automate",
    copy: "We connect your tools, automate the steps and build anything that's missing.",
  },
  {
    title: "Test",
    copy: "We test with your real work and adjust until it runs reliably.",
  },
  {
    title: "Deploy",
    copy: "We switch it on and hand over something your team can use from day one.",
  },
  {
    title: "Improve",
    copy: "We review how it's performing and refine it as your business changes.",
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
    a: "Usually not. We start with the tools you already have and only suggest replacing something if it can't do the job.",
  },
  {
    q: "Can you connect any system?",
    a: "Many systems can be connected, but not all of them. It depends on what each tool supports, the access you have and the provider's terms. We check this during discovery and tell you plainly before you commit.",
  },
  {
    q: "Is AI part of every project?",
    a: "No. We use AI where it clearly saves time or improves results. Plenty of the best automations need none at all.",
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
  lede: keyMessage,
  story: [
    "Vision Forge started with a simple idea: businesses in Belize deserve technology that fits the way they actually work. Too often, software gets bought first and the business is bent to fit it. We do it the other way round.",
    "We listen like business owners and build like engineers, so what we make fits your day-to-day, not just a feature list.",
    "We're both a strategic partner and a hands-on studio. We help you understand where work gets stuck, automate the repetitive parts, connect the systems you already use, and build practical technology where it's needed.",
    "Sometimes the answer is a new website or an app. More often it's a simpler process and a few tools talking to each other. We'll tell you which, plainly.",
  ],
  beliefs: [
    { title: "Learn first", copy: "We understand your business before we recommend anything." },
    { title: "Explain plainly", copy: "No jargon. You'll always know what we're doing and why." },
    { title: "Build things people use", copy: "If your team won't use it, it isn't finished." },
  ],
  owned: `We're Belizean-owned and registered in Belize as ${site.legal.registeredName}, trading as ${site.legal.tradingName}.`,
} as const;

export const closing = {
  title: "Tell us what's slowing you down.",
  copy: "The first conversation is free. We'll reply within one business day.",
  cta: { label: "Tell us about your business", href: "/get-started" },
} as const;
