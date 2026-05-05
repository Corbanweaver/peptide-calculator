import Link from "next/link";
import { ArrowLeft, Calculator, ExternalLink, ShieldCheck } from "lucide-react";
import type { SeoPage } from "@/lib/seo-pages";

export function SeoLandingPage({
  page,
  backHref,
  backLabel,
}: {
  page: SeoPage;
  backHref: string;
  backLabel: string;
}) {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eef9ff_38%,#fff7fb_70%,#fffaf1_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <Link
          href={backHref}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-100 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          {backLabel}
        </Link>

        <header className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-[linear-gradient(135deg,rgba(14,165,233,0.16)_0%,rgba(236,72,153,0.07)_52%,rgba(251,146,60,0.1)_74%,rgba(255,255,255,0)_100%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sky-800">
                {page.eyebrow}
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                {page.title}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                {page.description}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={page.calculatorHref}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-sky-900"
                >
                  <Calculator size={17} aria-hidden="true" />
                  Open calculator
                </Link>
                {page.sourceUrl ? (
                  <a
                    href={page.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-slate-600 ring-1 ring-sky-100 transition hover:text-slate-950"
                  >
                    {page.sourceLabel}
                    <ExternalLink size={15} aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </div>

            <div className="rounded-[26px] border border-emerald-100 bg-emerald-50/80 p-4 text-sm leading-6 text-emerald-950">
              <div className="mb-2 flex items-center gap-2 font-semibold">
                <ShieldCheck size={18} aria-hidden="true" />
                Math support only
              </div>
              This page is for calculator math and education. It does not
              diagnose, prescribe, or replace product-label or prescriber
              instructions.
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {page.sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[26px] border border-sky-100 bg-white/92 p-5 shadow-[0_18px_55px_rgba(14,165,233,0.07)]"
            >
              <h2 className="text-lg font-semibold text-slate-950">
                {section.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {section.body}
              </p>
            </article>
          ))}
        </section>

        <section className="rounded-[30px] border border-sky-100 bg-white/95 p-5 shadow-[0_24px_80px_rgba(14,165,233,0.08)] sm:p-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            Frequently asked questions
          </h2>
          <div className="mt-4 grid gap-3">
            {page.faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-100"
              >
                <h3 className="font-semibold text-slate-950">{faq.question}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-sky-100 bg-white/90 p-5">
          <h2 className="text-lg font-semibold text-slate-950">Related tools</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {page.related.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-900 ring-1 ring-sky-100 transition hover:bg-sky-100"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
