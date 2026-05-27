import type { Metadata } from "next";
import type { Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { GoogleAnalyticsPageView } from "@/components/GoogleAnalyticsPageView";
import { PwaRegistration } from "@/components/PwaRegistration";
import { googleAdsConversionId } from "@/lib/analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://peptidecalculator.co";
const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
const googleTagId = gaMeasurementId || googleAdsConversionId;

export const metadata: Metadata = {
  applicationName: "PeptiCalc",
  manifest: "/manifest.webmanifest",
  title: "PeptiCalc | Peptide Calculator",
  description:
    "A simple peptide calculator for concentration, syringe marks, mg to mcg conversion, BAC water math, and editable reference presets.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "peptide calculator",
    "dose conversion",
    "mcg per ml",
    "U-100 syringe units",
    "BAC water calculator",
    "peptide reconstitution",
  ],
  authors: [{ name: "PeptiCalc team" }],
  appleWebApp: {
    capable: true,
    title: "PeptiCalc",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    title: "PeptiCalc | Peptide Calculator",
    description:
      "A simple peptide calculator for concentration, syringe marks, mg to mcg conversion, BAC water math, and editable reference presets.",
    locale: "en_US",
    siteName: "PeptiCalc",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "PeptiCalc | Peptide Calculator",
    description:
      "A simple peptide calculator for concentration, syringe marks, mg to mcg conversion, BAC water math, and editable reference presets.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#075985",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <PwaRegistration />
        {googleTagId ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                window.gtag = window.gtag || function gtag(){window.dataLayer.push(arguments);}
                window.gtag('js', new Date());
                ${gaMeasurementId ? `window.gtag('config', '${gaMeasurementId}');` : ""}
                ${googleAdsConversionId ? `window.gtag('config', '${googleAdsConversionId}');` : ""}
              `}
            </Script>
            {gaMeasurementId ? (
              <GoogleAnalyticsPageView measurementId={gaMeasurementId} />
            ) : null}
          </>
        ) : null}
      </body>
    </html>
  );
}
