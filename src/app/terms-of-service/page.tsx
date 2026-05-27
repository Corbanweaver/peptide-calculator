import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, CircleAlert, FileText, Scale, ShieldCheck } from "lucide-react";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service | PeptiCalc",
  description:
    "Terms of service for PeptiCalc, including calculator use, medical disclaimer, account responsibilities, and acceptable use.",
  alternates: {
    canonical: absoluteUrl("/terms-of-service"),
  },
};

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              These terms explain how PeptiCalc may be used. The site provides
              calculator math and educational information, not medical advice,
              diagnosis, prescriptions, or treatment plans.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Last updated May 12, 2026
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <TermsCard
            icon={<CircleAlert size={20} />}
            title="Calculator only"
            text="PeptiCalc converts user-entered values into measurement math such as concentration, liquid volume, and U-100 syringe marks. It does not choose a dose or decide whether a compound is appropriate."
          />
          <TermsCard
            icon={<ShieldCheck size={20} />}
            title="Verify before use"
            text="You are responsible for checking every value against the product label, pharmacy instructions, prescription directions, or guidance from a licensed professional."
          />
          <TermsCard
            icon={<Scale size={20} />}
            title="No professional relationship"
            text="Using the site does not create a doctor-patient, pharmacist-patient, attorney-client, or other professional relationship."
          />
          <TermsCard
            icon={<FileText size={20} />}
            title="Accounts"
            text="If account features are enabled, you are responsible for keeping your sign-in information secure and for reviewing any saved calculator result before relying on it."
          />
        </section>

        <section className="rounded-[28px] border border-sky-100 bg-white/95 p-6 text-sm leading-7 text-slate-700 shadow-[0_18px_55px_rgba(14,165,233,0.07)]">
          <h2 className="text-xl font-semibold text-slate-950">
            Acceptable use
          </h2>
          <p className="mt-3">
            Do not use PeptiCalc to promote unsafe, illegal, misleading, or
            unauthorized medical activity. Do not attempt to disrupt the site,
            scrape it at abusive volume, or use it to store information you are
            not allowed to store.
          </p>
          <p className="mt-3">
            PeptiCalc may change, pause, or remove features as needed for
            safety, legal compliance, product quality, or site security.
          </p>
        </section>
      </div>
    </main>
  );
}

function TermsCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-[26px] border border-sky-100 bg-white/95 p-5 shadow-[0_18px_55px_rgba(14,165,233,0.07)]">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
