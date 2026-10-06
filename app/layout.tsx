import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050606",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: site.url,
    title: site.title,
    description: site.description,
    siteName: site.name,
    locale: "en_US",
    images: [
      {
        url: "/brand/vision-forge-logo.png",
        width: 819,
        height: 819,
        alt: "Vision Forge Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    images: ["/brand/vision-forge-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  url: site.url,
  image: `${site.url}/brand/vision-forge-logo.png`,
  logo: `${site.url}/brand/vision-forge-logo.png`,
  description: site.description,
  email: site.sales.display,
  telephone: "+501-613-9219",
  areaServed: {
    "@type": "Country",
    name: "Belize",
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "BZ",
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+501-615-7575",
      contactType: "sales",
      email: site.sales.display,
      availableLanguage: ["English"],
      url: site.whatsapp.href,
    },
    {
      "@type": "ContactPoint",
      telephone: "+501-613-9219",
      contactType: "customer support",
      email: site.support.display,
      availableLanguage: ["English"],
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-void font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-gold focus:px-4 focus:py-3 focus:text-[#1c1408]"
        >
          Skip to content
        </a>
        <div className="atmosphere" aria-hidden />
        <div className="grain" aria-hidden />
        <div className="relative z-10 mx-auto min-h-dvh max-w-[1760px] border-x border-line bg-canvas">
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
