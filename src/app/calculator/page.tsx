import type { Metadata } from "next";
import { Suspense } from "react";
import { PeptideCalculator } from "@/components/PeptideCalculator";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://peptidecalculator.co";

export const metadata: Metadata = {
  title: "Peptide Calculator: MCG, BAC Water & Syringe Units",
  description:
    "Use PeptiCalc to calculate peptide concentration, BAC water math, mL to draw, MCG-to-units conversion, and U-100 syringe marks.",
  alternates: {
    canonical: `${siteUrl}/`,
  },
  openGraph: {
    title: "Peptide Calculator: MCG, BAC Water & Syringe Units",
    description:
      "Use PeptiCalc to calculate peptide concentration, BAC water math, mL to draw, MCG-to-units conversion, and U-100 syringe marks.",
    url: `${siteUrl}/`,
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
