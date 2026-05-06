import Link from "next/link";
import { ArrowLeft, BookOpenCheck, ShieldCheck } from "lucide-react";
import { PeptideLibrary } from "@/components/PeptideLibrary";
import { PopularCalculators } from "@/components/PopularCalculators";

export const metadata = {
  title: "Peptide Library | PeptiCalc",
  description:
    "Choose editable calculator presets for peptide and compound profiles.",
};

export default function PeptidesPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eef9ff_38%,#fff7fb_70%,#fffaf1_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link
          href="/calculator"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-100 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to calculator
        </Link>

        <header className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(135deg,rgba(14,165,233,0.14)_0%,rgba(236,72,153,0.07)_52%,rgba(251,146,60,0.1)_74%,rgba(255,255,255,0)_100%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0369a1_58%,#fb923c_100%)] text-white shadow-sm">
                <BookOpenCheck size={22} aria-hidden="true" />
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Peptide library
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                Choose a pre-loaded dose for compounds. Pick a card, tap Use
                calculator, and the calculator opens with values ready to edit.
              </p>
            </div>

            <div className="rounded-[26px] border border-emerald-100 bg-emerald-50/80 p-4 text-sm leading-6 text-emerald-950">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <ShieldCheck size={18} aria-hidden="true" />
                Quick note
              </div>
              Presets are editable examples only. Always verify the vial, water
              amount, and dose with the product label or your prescriber.
            </div>
          </div>
        </header>

        <PopularCalculators />

        <PeptideLibrary />
      </div>
    </main>
  );
}
