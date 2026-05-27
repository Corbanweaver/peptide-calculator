import type { Metadata } from "next";
import { Suspense } from "react";
import { PeptideCalculator } from "@/components/PeptideCalculator";
import {
  absoluteUrl,
  jsonLd,
  webApplicationJsonLd,
  webPageJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Peptide Calculator: BAC Water & U-100 Syringe Marks",
  description:
    "Calculate peptide concentration, BAC water math, mL to draw, MCG-to-units conversion, and U-100 syringe marks with PeptiCalc.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "Free Peptide Calculator: BAC Water & U-100 Syringe Marks",
    description:
      "Calculate peptide concentration, BAC water math, mL to draw, MCG-to-units conversion, and U-100 syringe marks with PeptiCalc.",
    url: absoluteUrl("/"),
    type: "website",
  },
};

const calculatorJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    websiteJsonLd(),
    webPageJsonLd({
      path: "/",
      title: "Free Peptide Calculator: BAC Water & U-100 Syringe Marks",
      description:
        "Calculate peptide concentration, BAC water math, mL to draw, MCG-to-units conversion, and U-100 syringe marks with PeptiCalc.",
    }),
    webApplicationJsonLd({
      path: "/",
      name: "PeptiCalc peptide calculator",
      description:
        "A free peptide calculator for BAC water math, concentration, MCG-to-units conversion, mL to draw, and U-100 syringe marks.",
    }),
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(calculatorJsonLd) }}
      />
      <Suspense fallback={null}>
        <PeptideCalculator />
      </Suspense>
    </>
  );
}
