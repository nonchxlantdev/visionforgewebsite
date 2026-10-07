import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SparksProvider } from "@/components/forge/SparkField";
import { Footer } from "@/components/layout/Footer";
import { MobileContactBar } from "@/components/layout/MobileContactBar";
import { Navbar } from "@/components/layout/Navbar";
import { site } from "@/lib/site";
import "./globals.css";

const display = localFont({
  src: "./fonts/big-shoulders-display.woff2",
  variable: "--font-display-face",
  weight: "100 900",
  display: "swap",
});

const body = localFont({
  src: "./fonts/instrument-sans.woff2",
  variable: "--font-body-face",
  weight: "400 700",
  display: "swap",
});

const mono = localFont({
  src: "./fonts/martian-mono.woff2",
  variable: "--font-mono-face",
  weight: "100 800",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0B0907",
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
  legalName: site.legal.registeredName,
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
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-forge pb-[calc(4.5rem+env(safe-area-inset-bottom))] font-sans text-chrome antialiased md:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-molten focus:px-4 focus:py-3 focus:text-on-molten"
        >
          Skip to content
        </a>
        <SparksProvider>
          <div className="grain" aria-hidden />
          <Navbar />
          <main id="main" className="relative z-10">
            {children}
          </main>
          <Footer />
          <MobileContactBar />
        </SparksProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
