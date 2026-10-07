import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/layout/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookies & Local Storage | Vision Forge Studio",
  description: "visionforgestudio.app uses no tracking cookies. Here is the little it stores in your browser.",
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
    heading: "What is stored in your browser",
    body: (
      <>
        <p>Two small items may be saved on your own device, and they are never sent to us:</p>
        <ul>
          <li>
            <strong>vf-best</strong> (local storage): your best score in the forge game, so you can try to beat it.
          </li>
          <li>
            <strong>vf-ignited</strong> (session storage): remembers that the short intro animation has played, so it
            doesn&apos;t replay on every page. It clears when you close the tab.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "clearing",
    heading: "Clearing it",
    body: (
      <p>
        You can delete these at any time by clearing site data for visionforgestudio.app in your browser settings
        (usually under Privacy or Site settings). The website works exactly the same without them.
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
