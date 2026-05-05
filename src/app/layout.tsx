import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "PeptiCalc | Peptide Calculator",
  description:
    "A prescription-aware peptide calculator for concentration, syringe volume, IU conversion, and protocol schedules.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "peptide calculator",
    "dose conversion",
    "mcg per ml",
    "IU conversion",
    "compound protocol",
  ],
  authors: [{ name: "PeptiCalc team" }],
  openGraph: {
    type: "website",
    title: "PeptiCalc | Peptide Calculator",
    description:
      "A prescription-aware peptide calculator for concentration, syringe volume, IU conversion, and protocol schedules.",
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
      "A prescription-aware peptide calculator for concentration, syringe volume, IU conversion, and protocol schedules.",
  },
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
