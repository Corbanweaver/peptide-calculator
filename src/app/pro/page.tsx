import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Calculator,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ProEarlyAccess } from "@/components/ProEarlyAccess";
import { getProPriceLabel } from "@/lib/billing";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://peptidecalculator.co";
const priceLabel = getProPriceLabel();

export const metadata: Metadata = {
  title: "PeptiCalc Pro | Paid Peptide Calculator Tools",
  description:
    "PeptiCalc Pro adds printable protocol sheets, saved notes, reminder planning, and advanced peptide calculator workflows.",
  alternates: {
    canonical: `${siteUrl}/pro`,
  },
  openGraph: {
    title: "PeptiCalc Pro",
    description:
      "Printable sheets, saved notes, reminder planning, and advanced calculator workflows for PeptiCalc users.",
    url: `${siteUrl}/pro`,
    type: "website",
  },
};

const proFeatures = [
  {
    icon: <FileText size={20} aria-hidden="true" />,
    title: "Printable sheets",
    text: "Turn a saved calculator result into a clean protocol sheet with dose math, vial notes, and safety context.",
  },
  {
    icon: <Bell size={20} aria-hidden="true" />,
    title: "Reminder plans",
    text: "Attach start dates, repeat cadence, and timing notes to saved calculations for repeat review.",
  },
  {
    icon: <Calculator size={20} aria-hidden="true" />,
    title: "Advanced workflows",
    text: "Keep deeper tools close to your saved calculations instead of rebuilding the same setup every time.",
  },
];

export default function ProPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eefbff_42%,#fff7ed_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link
          href="/calculator"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-100 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to calculator
        </Link>

        <section className="overflow-hidden rounded-[32px] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-center">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                <Sparkles size={22} aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm font-semibold uppercase tracking-[0.08em] text-sky-800">
                {priceLabel}
              </p>
              <h1 className="mt-2 max-w-3xl text-4xl font-semibold tracking-normal text-slate-950 sm:text-5xl">
                PeptiCalc Pro
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                A paid workspace for people who save calculations, print sheets,
                and keep repeat protocol notes organized around the calculator.
              </p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1.5 ring-1 ring-sky-100">
                  <ShieldCheck size={14} aria-hidden="true" />
                  Stripe checkout
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 ring-1 ring-emerald-100">
                  <FileText size={14} aria-hidden="true" />
                  Pro saved tools
                </span>
              </div>
            </div>

            <ProEarlyAccess source="pro-page" placement="pro-page-hero" />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {proFeatures.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[26px] border border-sky-100 bg-white/90 p-5 shadow-[0_18px_55px_rgba(14,165,233,0.07)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
                {feature.icon}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.text}
              </p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
