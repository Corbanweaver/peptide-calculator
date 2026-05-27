import type { Metadata } from "next";
import { Ruler, ShieldCheck } from "lucide-react";
import { SyringeMeasurementCalculator } from "@/components/SyringeMeasurementCalculator";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  jsonLd,
  webApplicationJsonLd,
  webPageJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free U-100 Syringe Measurement Calculator",
  description:
    "Convert known label values into liquid volume and U-100 syringe marks. Free measurement calculator for mcg, mL, and syringe mark math.",
  keywords: [
    "U-100 syringe calculator",
    "syringe measurement calculator",
    "mcg to mL calculator",
    "syringe mark calculator",
    "liquid measurement calculator",
  ],
  alternates: {
    canonical: absoluteUrl("/syringe-measurement-calculator"),
  },
  openGraph: {
    title: "Free U-100 Syringe Measurement Calculator",
    description:
      "Convert known label values into liquid volume and U-100 syringe marks.",
    url: absoluteUrl("/syringe-measurement-calculator"),
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Free U-100 Syringe Measurement Calculator",
    description:
      "Convert known label values into liquid volume and U-100 syringe marks.",
  },
};

const syringeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    websiteJsonLd(),
    webPageJsonLd({
      path: "/syringe-measurement-calculator",
      title: "Free U-100 Syringe Measurement Calculator",
      description:
        "Convert known label values into liquid volume and U-100 syringe marks. Free measurement calculator for mcg, mL, and syringe mark math.",
    }),
    breadcrumbJsonLd([
      { name: "PeptiCalc", path: "/" },
      {
        name: "U-100 Syringe Measurement Calculator",
        path: "/syringe-measurement-calculator",
      },
    ]),
    webApplicationJsonLd({
      path: "/syringe-measurement-calculator",
      name: "U-100 Syringe Measurement Calculator",
      applicationCategory: "UtilitiesApplication",
      description:
        "Convert known label values into liquid volume and U-100 syringe marks.",
    }),
  ],
};

export default function SyringeMeasurementCalculatorPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#d8edf6_0%,#eaf8ff_38%,#fff9f0_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(syringeJsonLd) }}
      />
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.1)] sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(135deg,rgba(14,165,233,0.18)_0%,rgba(251,146,60,0.11)_70%,rgba(255,255,255,0)_100%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_280px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-sky-900 ring-1 ring-sky-100">
                <Ruler size={14} aria-hidden="true" />
                Free measurement tool
              </div>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                U-100 Syringe Measurement Calculator
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
                Enter the amount on the label, total liquid volume, and target
                amount. This tool shows the liquid volume and syringe mark in a
                clean visual format.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["MCG to mL", "U-100 marks", "Label-value math"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-sky-100"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[26px] border border-emerald-100 bg-emerald-50/85 p-4 text-sm leading-6 text-emerald-950">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <ShieldCheck size={18} aria-hidden="true" />
                Measurement support only
              </div>
              This page does not choose a treatment, product, schedule, or
              personalized amount. Use only verified label or professional
              instructions.
            </div>
          </div>
        </header>

        <SyringeMeasurementCalculator />

        <section className="grid gap-4 md:grid-cols-3">
          <InfoCard
            title="What you enter"
            body="Use the total amount, liquid volume, and target amount from a verified instruction source."
          />
          <InfoCard
            title="What you get"
            body="The calculator returns mL to measure, U-100 syringe mark, strength per mL, and a fit check."
          />
          <InfoCard
            title="Important limit"
            body="A calculator can reduce math errors, but it cannot verify whether any product or instruction is appropriate."
          />
        </section>

        <footer className="rounded-[26px] border border-sky-100 bg-white/90 p-5 text-sm leading-6 text-slate-600">
          <p>
            This standalone calculator is for measurement math only. It does
            not choose products, treatment plans, schedules, or personalized
            instructions.
          </p>
        </footer>
      </div>
    </main>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-[26px] border border-sky-100 bg-white/92 p-5 shadow-[0_18px_55px_rgba(14,165,233,0.07)]">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}
