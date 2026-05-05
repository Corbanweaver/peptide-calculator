import Link from "next/link";
import { ArrowLeft, Calculator, FlaskConical } from "lucide-react";
import { toolSeoPages } from "@/lib/seo-pages";

export const metadata = {
  title: "Peptide Calculator Tools | PeptiCalc",
  description:
    "Browse peptide calculator tools for reconstitution, U-100 syringe units, mg to mcg, BAC water, and split-compound math.",
};

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#e6f8ff_0%,#f4fbff_42%,#fff7fb_75%,#fffaf1_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link
          href="/calculator"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-100 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to calculator
        </Link>

        <header className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(135deg,rgba(14,165,233,0.16)_0%,rgba(236,72,153,0.07)_52%,rgba(251,146,60,0.12)_74%,rgba(255,255,255,0)_100%)]" />
          <div className="relative">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0369a1_58%,#fb923c_100%)] text-white shadow-sm">
              <Calculator size={22} aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Calculator tools
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
              Simple pages for common peptide math questions. Pick a tool, open
              the calculator, and edit the values to match your label or
              prescriber instructions.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {toolSeoPages.map((page) => (
            <article
              key={page.slug}
              className="rounded-[26px] border border-sky-100 bg-white/95 p-5 shadow-[0_18px_55px_rgba(14,165,233,0.08)] ring-1 ring-white/70"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
                <FlaskConical size={19} aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-xl font-semibold text-slate-950">
                {page.title}
              </h2>
              <p className="mt-2 min-h-[4.5rem] text-sm leading-6 text-slate-600">
                {page.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link
                  href={`/tools/${page.slug}`}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-900"
                >
                  Read guide
                </Link>
                <Link
                  href={page.calculatorHref}
                  className="inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-sm font-semibold text-sky-800 ring-1 ring-sky-100 transition hover:bg-sky-50"
                >
                  Open calculator
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
