import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  CircleAlert,
  Database,
  ExternalLink,
  FileText,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Safety and Legal Policy | PeptiCalc",
  description:
    "Legal disclosure, safety policy, and source review standards for PeptiCalc.",
  alternates: {
    canonical: absoluteUrl("/disclaimer"),
  },
};

const policies = [
  {
    icon: <CircleAlert size={20} />,
    title: "Not medical advice",
    text: "PeptiCalc is a calculator and reference tool. It does not diagnose, prescribe, or replace a licensed clinician or pharmacist.",
  },
  {
    icon: <ShieldCheck size={20} />,
    title: "Prescription first",
    text: "Users should follow their prescription label, pharmacy instructions, and clinician guidance over anything displayed in the app.",
  },
  {
    icon: <LockKeyhole size={20} />,
    title: "Protocol locks",
    text: "Protocol generation should remain disabled for compounds that have not passed source, legal, and safety review.",
  },
  {
    icon: <Database size={20} />,
    title: "Source review",
    text: "Compound pages should cite public sources and be updated when U.S. regulatory guidance changes.",
  },
];

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eef9ff_38%,#fff7fb_70%,#fffaf1_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link
          href="/calculator"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-100 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to calculator
        </Link>

        <header className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(135deg,rgba(14,165,233,0.14)_0%,rgba(236,72,153,0.07)_52%,rgba(251,146,60,0.1)_74%,rgba(255,255,255,0)_100%)]" />
          <div className="relative">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0369a1_58%,#fb923c_100%)] text-white shadow-sm">
              <FileText size={22} aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Safety and legal policy
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              PeptiCalc provides reference calculations only. It is built to
              support safer math, clearer labels, and source-reviewed education,
              not personalized treatment recommendations.
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {policies.map((policy) => (
            <article
              key={policy.title}
              className="rounded-[26px] border border-sky-100 bg-white/95 p-5 shadow-[0_18px_55px_rgba(14,165,233,0.07)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
                {policy.icon}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">
                {policy.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {policy.text}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-[28px] border border-sky-100 bg-white/95 p-6 shadow-[0_18px_55px_rgba(14,165,233,0.07)]">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-50 text-orange-700 ring-1 ring-orange-100">
              <Scale size={20} aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Review standard
              </p>
              <h2 className="text-xl font-semibold text-slate-950">
                What must be true before a protocol goes public
              </h2>
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm leading-6 text-slate-700 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              Legal status is checked for the U.S. market and the page avoids
              restricted or research-only protocols.
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              Dosing language is reviewed so it does not become personalized
              treatment advice.
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              Calculator math is separated from medical decisions and points
              users back to prescription instructions.
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-sky-100 bg-white/95 p-6 shadow-[0_18px_55px_rgba(14,165,233,0.07)]">
          <h2 className="text-xl font-semibold text-slate-950">
            Public source policy
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-700">
            Compound status can change. PeptiCalc should maintain source notes
            from public U.S. references and treat those references as a starting
            point, not a substitute for professional review.
          </p>
          <a
            href="https://www.fda.gov/drugs/human-drug-compounding/bulk-drug-substances-used-compounding-under-section-503a-fdc-act"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-900"
          >
            FDA compounding reference
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </section>
      </div>
    </main>
  );
}
