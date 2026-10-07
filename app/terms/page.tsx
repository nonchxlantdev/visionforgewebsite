import type { Metadata } from "next";
import { LegalLayout, type LegalSection } from "@/components/layout/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service | Vision Forge Studio",
  description: "The terms that apply when you use visionforgestudio.app or work with Vision Forge Studio.",
  alternates: { canonical: "/terms" },
};

const { legal } = site;

const sections: LegalSection[] = [
  {
    id: "who-we-are",
    heading: "Who we are",
    body: (
      <>
        <p>
          {legal.tradingName} is the trading name of <strong>{legal.registeredName}</strong>, a business registered in
          Belize. In these terms, &ldquo;we&rdquo;, &ldquo;us&rdquo; and &ldquo;our&rdquo; mean {legal.registeredName}
          , and &ldquo;you&rdquo; means the person or organisation using this website or engaging our services.
        </p>
        <p>
          You can reach us at <a href={site.sales.href}>{site.sales.display}</a> or{" "}
          <a href={site.support.href}>{site.support.display}</a>.
        </p>
      </>
    ),
  },
  {
    id: "scope",
    heading: "What these terms cover",
    body: (
      <>
        <p>
          These terms apply to your use of this website and form the general basis on which we provide services. Most
          projects also have a written proposal, quote or project agreement. If that document conflicts with these
          terms, the project document takes priority for that project.
        </p>
        <p>By using this website or accepting a proposal from us, you agree to these terms.</p>
      </>
    ),
  },
  {
    id: "website-use",
    heading: "Using this website",
    body: (
      <ul>
        <li>Use the website lawfully and don&apos;t try to disrupt, damage or gain unauthorised access to it.</li>
        <li>Don&apos;t copy or reuse our content, design, code or branding without our written permission.</li>
        <li>We may update, change or remove parts of the website at any time without notice.</li>
      </ul>
    ),
  },
  {
    id: "quotes",
    heading: "Quotes and proposals",
    body: (
      <p>
        Quotes and proposals are based on the information available when they are prepared, and they remain valid for
        the period stated on them. Work begins once you accept the proposal in writing (including by email or other
        electronic means) and any initial payment it requires has been received.
      </p>
    ),
  },
  {
    id: "payment",
    heading: "Fees and payment",
    body: (
      <>
        <p>
          Fees, deposits, milestones and payment due dates are set out in your proposal or invoice. Unless agreed
          otherwise, amounts are quoted in Belize dollars.
        </p>
        <p>
          If an invoice is overdue, we may pause work after giving you notice until payment is received. Any change to
          the timeline caused by a pause or late payment is not our responsibility.
        </p>
      </>
    ),
  },
  {
    id: "your-responsibilities",
    heading: "Your responsibilities",
    body: (
      <ul>
        <li>Provide content, information, access and feedback when they are needed so the project can move forward.</li>
        <li>Make sure you have the right to use any material you give us, such as text, images, logos and data.</li>
        <li>Review and approve work within a reasonable time, and tell us promptly if something isn&apos;t right.</li>
      </ul>
    ),
  },
  {
    id: "changes",
    heading: "Changes and revisions",
    body: (
      <p>
        Each proposal describes the work included and any rounds of revision. Requests outside that scope are
        welcome. We will tell you about any effect on cost or timing before we carry them out.
      </p>
    ),
  },
  {
    id: "ip",
    heading: "Intellectual property",
    body: (
      <>
        <p>
          Once you have paid in full, you own the final deliverables we create specifically for you, unless your
          proposal says otherwise.
        </p>
        <p>
          We keep ownership of our pre-existing tools, code libraries, templates, methods and know-how. Where these
          form part of your deliverables, you receive a non-exclusive, ongoing licence to use them with that project.
          Third-party and open-source components remain subject to their own licences.
        </p>
      </>
    ),
  },
  {
    id: "portfolio",
    heading: "Portfolio",
    body: (
      <p>
        We may show completed work in our portfolio and marketing unless you ask us not to in writing. We never
        publish confidential information.
      </p>
    ),
  },
  {
    id: "confidentiality",
    heading: "Confidentiality",
    body: (
      <p>
        Each of us will keep the other&apos;s confidential information private and use it only for the project,
        except where disclosure is required by law.
      </p>
    ),
  },
  {
    id: "warranties",
    heading: "Our commitment",
    body: (
      <p>
        We carry out our work with reasonable skill and care. Beyond what is written in your proposal or agreement, we
        do not make any other promises about the services, including that they will be uninterrupted or error-free.
      </p>
    ),
  },
  {
    id: "liability",
    heading: "Limitation of liability",
    body: (
      <>
        <p>
          To the fullest extent permitted by law, we are not liable for any indirect or consequential loss, or for loss
          of profit, revenue, data or business opportunity.
        </p>
        <p>
          Our total liability in connection with any project is limited to the extent permitted by law and as set out
          in the relevant proposal or agreement. Nothing in these terms limits liability that cannot be limited by
          law.
        </p>
      </>
    ),
  },
  {
    id: "third-parties",
    heading: "Third-party services",
    body: (
      <p>
        Hosting, domains, payment providers, app stores, APIs and other third-party services are provided under those
        providers&apos; own terms. We are not responsible for their availability, pricing or changes.
      </p>
    ),
  },
  {
    id: "termination",
    heading: "Ending an engagement",
    body: (
      <p>
        Either of us may end an engagement by giving written notice. You will pay for work completed and costs
        incurred up to the end date, and we will hand over any work you have paid for.
      </p>
    ),
  },
  {
    id: "electronic",
    heading: "Electronic communications",
    body: (
      <p>
        You agree that proposals, approvals, notices and signatures may be given electronically, including by email,
        and that they are as valid as paper versions.
      </p>
    ),
  },
  {
    id: "law",
    heading: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of Belize. If a dispute arises, we will both first try to resolve it in
        good faith. If that fails, the courts of Belize will have jurisdiction.
      </p>
    ),
  },
  {
    id: "updates",
    heading: "Changes to these terms",
    body: (
      <p>
        We may update these terms from time to time. The latest version will always be on this page, with the date it
        was last updated. Changes do not affect projects already agreed unless both of us agree in writing.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalLayout
      kicker="Legal"
      title="Terms of Service"
      intro={
        <p>
          The plain-English terms for using this website and working with {legal.tradingName}. If anything is unclear,
          email <a href={site.support.href}>{site.support.display}</a> and we&apos;ll explain.
        </p>
      }
      sections={sections}
    />
  );
}
