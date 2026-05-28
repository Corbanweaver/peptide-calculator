import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Calculator,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ProEarlyAccess } from "@/components/ProEarlyAccess";
import { getProPriceLabel } from "@/lib/billing";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLd,
  proServiceJsonLd,
  webPageJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const priceLabel = getProPriceLabel();

const proFaqs = [
  {
    question: "Do I need Pro to use the calculator?",
    answer:
      "No. The core peptide calculator stays free. Pro is for saving repeat calculations, split-compound math, notes, reminders, and printable sheets.",
  },
  {
    question: "What happens after Stripe checkout?",
    answer:
      "After checkout, return to your PeptiCalc account. The site syncs your Stripe subscription and unlocks Pro features for that signed-in account.",
  },
  {
    question: "Can I manage billing later?",
    answer:
      "Yes. Signed-in Pro users can open Stripe billing management from the account page or Pro panels on the site.",
  },
  {
    question: "Does Pro give medical dosing advice?",
    answer:
      "No. PeptiCalc Pro is still calculator math only. It does not prescribe, diagnose, or replace label, pharmacy, or prescriber instructions.",
  },
];

export const metadata: Metadata = {
  title: "PeptiCalc Pro | Paid Peptide Calculator Tools",
  description:
    "PeptiCalc Pro adds saved calculations, advanced compound splits, printable protocol sheets, saved notes, and reminder planning.",
  alternates: {
    canonical: absoluteUrl("/pro"),
  },
  openGraph: {
    title: "PeptiCalc Pro",
    description:
      "Saved calculations, advanced compound splits, printable sheets, saved notes, and reminder planning for PeptiCalc users.",
    url: absoluteUrl("/pro"),
    type: "website",
  },
};

const proJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    websiteJsonLd(),
    webPageJsonLd({
      path: "/pro",
      title: "PeptiCalc Pro | Paid Peptide Calculator Tools",
      description:
        "PeptiCalc Pro adds saved calculations, advanced compound splits, printable protocol sheets, saved notes, and reminder planning.",
    }),
    breadcrumbJsonLd([
      { name: "PeptiCalc", path: "/" },
      { name: "PeptiCalc Pro", path: "/pro" },
    ]),
    proServiceJsonLd({ priceLabel }),
    {
      "@type": "FAQPage",
      mainEntity: proFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

const proFeatures = [
  {
    icon: <FileText size={20} aria-hidden="true" />,
    title: "Saved calculations",
    text: "Save calculator snapshots to your account and reopen repeat workflows without rebuilding the same setup.",
  },
  {
    icon: <Bell size={20} aria-hidden="true" />,
    title: "Reminder plans",
    text: "Attach start dates, repeat cadence, and timing notes to saved calculations for repeat review.",
  },
  {
    icon: <Calculator size={20} aria-hidden="true" />,
    title: "Advanced splits",
    text: "Split one dose across mixed compounds and see the per-compound breakdown in the calculator result.",
  },
];

const comparisonRows = [
  {
    feature: "Calculator math",
    free: "Run the core calculator and open SEO presets",
    pro: "Run everything in Free",
  },
  {
    feature: "Saved snapshots",
    free: "Copy a share link manually",
    pro: "Save calculations to your account",
  },
  {
    feature: "Repeat workflows",
    free: "Re-enter values each time",
    pro: "Reopen saved setups from your account",
  },
  {
    feature: "Mixed compounds",
    free: "Basic single-result math",
    pro: "Advanced split-compound breakdowns",
  },
  {
    feature: "Notes and printouts",
    free: "No saved notes",
    pro: "Saved notes, reminder plans, and printable sheets",
  },
];

export default function ProPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eefbff_42%,#fff7ed_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(proJsonLd) }}
      />
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
                A paid workspace for people who save calculations, use compound
                splits, print sheets, and keep repeat protocol notes organized
                around the calculator.
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

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="overflow-hidden rounded-[30px] border border-sky-100 bg-white/95 shadow-[0_22px_70px_rgba(14,165,233,0.08)] ring-1 ring-white/70">
            <div className="border-b border-sky-100 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-sky-800">
                Free vs Pro
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
                Upgrade when you repeat calculations
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                The free calculator gets users to the answer. Pro is for people
                who want to keep, reopen, print, and organize the math they use
                more than once.
              </p>
            </div>

            <div className="grid divide-y divide-sky-100">
              <div className="hidden grid-cols-[1fr_1fr_1fr] gap-3 bg-sky-50/70 px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-sky-950 sm:grid">
                <span>Feature</span>
                <span>Free</span>
                <span>Pro</span>
              </div>
              {comparisonRows.map((row) => (
                <div
                  key={row.feature}
                  className="grid gap-3 px-5 py-4 text-sm sm:grid-cols-[1fr_1fr_1fr]"
                >
                  <div className="font-semibold text-slate-950">
                    {row.feature}
                  </div>
                  <div className="text-slate-600">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-400 sm:hidden">
                      Free
                    </span>
                    {row.free}
                  </div>
                  <div className="font-semibold text-slate-900">
                    <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-sky-800 sm:hidden">
                      Pro
                    </span>
                    {row.pro}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section className="rounded-[30px] border border-emerald-100 bg-[linear-gradient(135deg,#ecfdf5_0%,#ffffff_62%,#f0f9ff_100%)] p-5 shadow-[0_22px_70px_rgba(14,165,233,0.08)]">
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
              <CheckCircle2 size={18} aria-hidden="true" />
              Good fit for Pro
            </div>
            <ul className="mt-4 grid gap-3 text-sm leading-6 text-slate-700">
              {[
                "You reuse the same vial, BAC water, and dose setups.",
                "You want saved notes beside each calculation.",
                "You use mixed-compound split math.",
                "You want printable calculation sheets.",
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2
                    className="mt-1 shrink-0 text-emerald-700"
                    size={16}
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 rounded-2xl bg-white/80 p-3 text-xs leading-5 text-slate-500 ring-1 ring-emerald-100">
              Pro keeps the calculator useful without turning it into medical
              advice. Every saved setup should still match the label, pharmacy,
              or prescriber instructions you already have.
            </p>
          </section>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {proFaqs.map((faq) => (
            <article
              key={faq.question}
              className="rounded-[26px] border border-sky-100 bg-white/92 p-5 shadow-[0_18px_55px_rgba(14,165,233,0.07)]"
            >
              <h2 className="text-base font-semibold text-slate-950">
                {faq.question}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {faq.answer}
              </p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 rounded-[32px] border border-sky-100 bg-white/95 p-5 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-6 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-sky-800">
              Ready to save your next calculation?
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-normal text-slate-950">
              Start Pro, then save calculations from the result panel.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Checkout is handled by Stripe. Billing status stays tied to your
              signed-in PeptiCalc account so Pro-only save and split tools can
              unlock across the site.
            </p>
          </div>

          <ProEarlyAccess source="pro-page" placement="pro-page-bottom" />
        </section>
      </div>
    </main>
  );
}
