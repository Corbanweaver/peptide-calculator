import Link from "next/link";
import { ExternalLink, FileText } from "lucide-react";

export const metadata = {
  title: "Disclaimer | PeptiCalc",
  description:
    "Legal disclosure and safety policy for PeptiCalc calculations and protocol workflows.",
};

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-7">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#175e65] hover:text-slate-950"
        >
          ← Back to calculator
        </Link>

        <header className="space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#175e65] text-white">
            <FileText size={22} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-semibold">Disclaimer</h1>
          <p className="text-lg leading-8 text-slate-700">
            PeptiCalc provides reference calculations only. It is not a medical
            consultation tool and does not provide personalized treatment advice.
          </p>
        </header>

        <section className="rounded-lg border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-xl font-semibold">Safety policy</h2>
          <ul className="mt-4 list-disc space-y-2 pl-6 text-sm leading-7 text-slate-700">
            <li>
              Dose math is based on user-provided inputs; verify all values with your
              clinician or pharmacist before use.
            </li>
            <li>
              The app is designed for informational reference for legally regulated
              compounds in U.S. contexts only.
            </li>
            <li>
              Protocol generation is disabled for unapproved or research compounds and
              never creates treatment recommendations.
            </li>
            <li>
              Use proper pharmacy-grade compounding and labeling workflows; users are
              responsible for checking local laws and pharmacy requirements.
            </li>
          </ul>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold">Data source policy</h2>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Compound status references are maintained from U.S. public references and
            may change as guidance updates. We do not replace professional labels,
            pharmacist review, or prescription instructions.
          </p>
          <a
            href="https://www.fda.gov/drugs/human-drug-compounding/bulk-drug-substances-used-compounding-under-section-503a-fdc-act"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#175e65] hover:text-slate-950"
          >
            FDA 503A compound bulk list
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
