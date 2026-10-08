import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Footer } from "@/components/layout/Footer";
import { MobileContactBar } from "@/components/layout/MobileContactBar";
import { Navbar } from "@/components/layout/Navbar";
import { LOGO_SIZE } from "@/lib/logo-variants";
import { site } from "@/lib/site";
import "./globals.css";

const archivo = localFont({
  src: "./fonts/archivo-var.woff2",
  variable: "--font-archivo",
  weight: "100 900",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

const instrument = localFont({
  src: "./fonts/instrument-sans-var.woff2",
  variable: "--font-instrument",
  weight: "400 700",
  display: "swap",
});

const plex = localFont({
  src: "./fonts/plex-mono-500.woff2",
  variable: "--font-plex",
  weight: "500",
  display: "swap",
});

const caveat = localFont({
  src: "./fonts/caveat-600.woff2",
  variable: "--font-caveat",
  weight: "600",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0d0c0b",
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
        width: LOGO_SIZE.width,
        height: LOGO_SIZE.height,
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
    <html lang="en" className={`${archivo.variable} ${instrument.variable} ${plex.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full bg-bg pb-[calc(4.75rem+env(safe-area-inset-bottom))] font-sans text-steel antialiased md:pb-0">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[70] focus:bg-gold focus:px-4 focus:py-3 focus:text-on-gold"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <MobileContactBar />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}
