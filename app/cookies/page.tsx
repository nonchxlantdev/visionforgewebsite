import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/layout/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookies & Local Storage | Vision Forge Studio",
  description: "visionforgestudio.app uses no cookies and stores nothing in your browser.",
  alternates: { canonical: "/cookies" },
};

const sections: LegalSection[] = [
  {
    id: "no-tracking",
    heading: "No tracking cookies",
    body: (
      <p>
        This website does not use cookies for tracking, analytics or advertising, and it doesn&apos;t share your
        browsing with anyone. That&apos;s why there is no cookie banner.
      </p>
    ),
  },
  {
    id: "what-we-store",
    heading: "Nothing stored in your browser",
    body: (
      <p>
        The site doesn&apos;t save anything in your browser: no cookies, no local storage. The project builder keeps your
        answers on the page only until you close it or choose to send them to us yourself.
      </p>
    ),
  },
  {
    id: "third-party",
    heading: "Third-party sites",
    body: (
      <p>
        If you follow a link to another site, such as WhatsApp, that site may set its own cookies under its own
        policy.
      </p>
    ),
  },
  {
    id: "updates",
    heading: "If this changes",
    body: (
      <p>
        If we ever add analytics or other cookies, we will update this page first and ask for your consent where
        required under the laws of Belize. Questions go to <a href={site.support.href}>{site.support.display}</a>.
      </p>
    ),
  },
];

export default function CookiesPage() {
  return (
    <LegalLayout
      kicker="Legal"
      title="Cookies & Local Storage"
      intro={<p>Very little to see here, on purpose.</p>}
      sections={sections}
    />
  );
}
