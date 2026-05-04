import { Suspense } from "react";
import { PeptideCalculator } from "@/components/PeptideCalculator";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <PeptideCalculator />
    </Suspense>
  );
}
