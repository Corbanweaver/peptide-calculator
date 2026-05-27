import type { Metadata } from "next";
import { Suspense } from "react";
import { PeptideCalculator } from "@/components/PeptideCalculator";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Peptide Calculator: MCG, BAC Water & Syringe Units",
  description:
    "Use PeptiCalc to calculate peptide concentration, BAC water math, mL to draw, MCG-to-units conversion, and U-100 syringe marks.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    title: "Peptide Calculator: MCG, BAC Water & Syringe Units",
    description:
      "Use PeptiCalc to calculate peptide concentration, BAC water math, mL to draw, MCG-to-units conversion, and U-100 syringe marks.",
    url: absoluteUrl("/"),
    type: "website",
  },
};

export default function CalculatorPage() {
  return (
    <Suspense fallback={null}>
      <PeptideCalculator />
    </Suspense>
  );
}
