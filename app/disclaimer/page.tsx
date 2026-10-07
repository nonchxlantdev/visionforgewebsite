import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/layout/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer | Vision Forge Studio",
  description: "Important information about the content on visionforgestudio.app.",
  alternates: { canonical: "/disclaimer" },
};

const sections: LegalSection[] = [
  {
    id: "general",
    heading: "General information only",
    body: (
      <p>
        The content on this website is for general information about {site.legal.tradingName} and our services. It
        is not legal, financial, tax or other professional advice, and you shouldn&apos;t rely on it as such. For advice
        about your specific situation, speak to a qualified professional.
      </p>
    ),
  },
  {
    id: "results",
    heading: "No guaranteed results",
    body: (
      <p>
        We describe what our services are designed to do, but business results depend on many factors outside our
        control. We don&apos;t guarantee any particular outcome, such as revenue, rankings or savings, unless it is
        written into a signed agreement.
      </p>
    ),
  },
  {
    id: "accuracy",
    heading: "Accuracy and availability",
    body: (
      <p>
        We try to keep this website accurate and available, but we don&apos;t promise that it will always be complete,
        current or free of errors and interruptions. We may change it at any time.
      </p>
    ),
  },
  {
    id: "links",
    heading: "External links",
    body: (
      <p>
        Links to other websites, such as WhatsApp, are provided for convenience. We don&apos;t control those sites and a
        link is not an endorsement. Their own terms and privacy policies apply.
      </p>
    ),
  },
  {
    id: "estimates",
    heading: "Prices and estimates",
    body: (
      <p>
        Prices on this website and the suggestions from the project builder are typical starting points, not quotes. Your
        price is set in a written quote after we discuss your project.
      </p>
    ),
  },
  {
    id: "trademarks",
    heading: "Names and trademarks",
    body: (
      <p>
        The {site.legal.tradingName} name and logo belong to us. Other names and trademarks mentioned on this website
        belong to their respective owners.
      </p>
    ),
  },
  {
    id: "law",
    heading: "Governing law",
    body: <p>This disclaimer is governed by the laws of Belize.</p>,
  },
];

export default function DisclaimerPage() {
  return (
    <LegalLayout
      kicker="Legal"
      title="Disclaimer"
      intro={<p>A few honest notes about the information on this website.</p>}
      sections={sections}
    />
  );
}
