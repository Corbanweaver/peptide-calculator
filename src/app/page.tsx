import type { Metadata } from "next";
import { Suspense } from "react";
import { PeptideCalculator } from "@/components/PeptideCalculator";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://peptidecalculator.co";

export const metadata: Metadata = {
  title: "Free Peptide Calculator: BAC Water & U-100 Syringe Marks",
  description:
    "Calculate peptide concentration, BAC water math, mL to draw, MCG-to-units conversion, and U-100 syringe marks with PeptiCalc.",
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    title: "Free Peptide Calculator: BAC Water & U-100 Syringe Marks",
    description:
      "Calculate peptide concentration, BAC water math, mL to draw, MCG-to-units conversion, and U-100 syringe marks with PeptiCalc.",
    url: `${siteUrl}/`,
    type: "website",
  },
};

const calculatorJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "PeptiCalc",
      url: `${siteUrl}/`,
    },
    {
      "@type": "SoftwareApplication",
      name: "PeptiCalc peptide calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      url: `${siteUrl}/`,
      description:
        "A free peptide calculator for BAC water math, concentration, MCG-to-units conversion, mL to draw, and U-100 syringe marks.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorJsonLd) }}
      />
      <Suspense fallback={null}>
        <PeptideCalculator />
      </Suspense>
    </>
  );
}
