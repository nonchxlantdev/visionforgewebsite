import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/layout/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Vision Forge Studio",
  description: "How Vision Forge Studio collects, uses and protects personal information.",
  alternates: { canonical: "/privacy" },
};

const { legal } = site;

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <p>
        This policy explains how <strong>{legal.registeredName}</strong>, trading as {legal.tradingName} and based in
        Belize, handles personal information. We are responsible for the information described here. Questions or
        requests go to <a href={site.support.href}>{site.support.display}</a>.
      </p>
    ),
  },
  {
    id: "what-we-collect",
    heading: "What we collect",
    body: (
      <>
        <p>
          This website has no contact forms, no analytics and no advertising or tracking cookies. We only receive
          personal information when you choose to contact us, for example:
        </p>
        <ul>
          <li>your name, email address and phone number;</li>
          <li>your business name and the details you share about your project;</li>
          <li>messages you send us by email, WhatsApp or phone.</li>
        </ul>
        <p>
          Like most websites, our hosting provider may automatically log basic technical information (such as IP
          address, browser type and the pages requested) to keep the site secure and running.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-it",
    heading: "How we use it",
    body: (
      <ul>
        <li>to reply to your enquiry and prepare quotes and proposals;</li>
        <li>to deliver, support and invoice the work we agree on;</li>
        <li>to meet legal, tax and accounting obligations;</li>
        <li>to keep our website and systems secure.</li>
      </ul>
    ),
  },
  {
    id: "sharing",
    heading: "Who we share it with",
    body: (
      <>
        <p>We don&apos;t sell or rent personal information. We only share it with:</p>
        <ul>
          <li>service providers who help us operate, such as email, hosting and file-storage providers;</li>
          <li>WhatsApp (Meta), when you choose to message us there, under its own privacy policy;</li>
          <li>authorities, where the law requires it.</li>
        </ul>
      </>
    ),
  },
  {
    id: "international",
    heading: "Storage outside Belize",
    body: (
      <p>
        Some of our service providers may store information outside Belize. We choose reputable providers that take
        appropriate steps to protect it.
      </p>
    ),
  },
  {
    id: "retention",
    heading: "How long we keep it",
    body: (
      <p>
        We keep personal information only as long as we need it for the purposes above, including any legal or
        accounting requirements, and then delete it or make it anonymous.
      </p>
    ),
  },
  {
    id: "security",
    heading: "Keeping it safe",
    body: (
      <p>
        We use reasonable technical and organisational measures to protect personal information, including access
        controls, secure accounts and encrypted connections. No method of transmission or storage is completely
        secure, but we work to protect what you share with us.
      </p>
    ),
  },
  {
    id: "your-rights",
    heading: "Your choices and rights",
    body: (
      <>
        <p>You can ask us to:</p>
        <ul>
          <li>tell you what personal information we hold about you and give you a copy;</li>
          <li>correct information that is wrong or incomplete;</li>
          <li>delete your information where we no longer need to keep it;</li>
          <li>stop or limit how we use it, or stop sending you messages.</li>
        </ul>
        <p>
          Email <a href={site.support.href}>{site.support.display}</a> and we will respond within a reasonable time. We
          handle personal information in line with the applicable data protection laws of Belize, and you may raise a
          concern with the relevant authority in Belize if you are not satisfied with our response.
        </p>
      </>
    ),
  },
  {
    id: "children",
    heading: "Children",
    body: <p>Our services are for businesses and adults. We don&apos;t knowingly collect information from children.</p>,
  },
  {
    id: "updates",
    heading: "Changes to this policy",
    body: (
      <p>
        We may update this policy from time to time. The latest version will always be on this page with the date it
        was last updated.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalLayout
      kicker="Legal"
      title="Privacy Policy"
      intro={
        <p>
          Short version: we only know what you tell us, we use it to work with you, and we never sell it. Here are the
          details.
        </p>
      }
      sections={sections}
    />
  );
}
