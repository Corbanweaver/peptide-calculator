import Link from "next/link";
import { ArrowLeft, Calculator, FlaskConical } from "lucide-react";

export const metadata = {
  title: "Peptide Library | PeptiCalc",
  description: "A simple PeptiCalc screen for future peptide protocols.",
};

export default function PeptidesPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eef9ff_38%,#fff7fb_70%,#fffaf1_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-100 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to calculator
        </Link>

        <section className="rounded-[28px] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0369a1_58%,#fb923c_100%)] text-white shadow-sm">
            <FlaskConical size={22} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-4xl font-semibold">Peptide library</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
            This will become the separate screen for compound profiles and
            protocol builders. For now, the calculator stays the main tool.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl bg-[linear-gradient(135deg,#f0f9ff_0%,#ffffff_100%)] p-4 ring-1 ring-sky-100">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                Status
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-950">
                Coming soon
              </div>
            </div>
            <div className="rounded-3xl bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_100%)] p-4 ring-1 ring-orange-100">
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                Focus
              </div>
              <div className="mt-1 text-lg font-semibold text-slate-950">
                Legal U.S. info
              </div>
            </div>
            <Link
              href="/calculator"
              className="rounded-3xl bg-slate-950 p-4 text-white shadow-[0_18px_45px_rgba(15,23,42,0.16)] transition hover:bg-sky-900"
            >
              <Calculator size={18} aria-hidden="true" />
              <div className="mt-3 text-lg font-semibold">Open calculator</div>
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
