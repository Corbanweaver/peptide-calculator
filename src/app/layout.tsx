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
