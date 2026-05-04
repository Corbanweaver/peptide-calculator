import { Suspense } from "react";
import { PeptideCalculator } from "@/components/PeptideCalculator";

export const metadata = {
  title: "Calculator | PeptiCalc",
  description: "Use the PeptiCalc peptide calculator.",
};

export default function CalculatorPage() {
  return (
    <Suspense fallback={null}>
      <PeptideCalculator />
    </Suspense>
  );
}
