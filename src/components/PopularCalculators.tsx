import Link from "next/link";
import { ArrowRight, Calculator, Sparkles } from "lucide-react";

const popularCalculators = [
  {
    label: "Semaglutide calculator",
    detail: "Free syringe mark calculator",
    href: "/peptides/semaglutide-calculator",
  },
  {
    label: "Tirzepatide calculator",
    detail: "Free syringe mark calculator",
    href: "/peptides/tirzepatide-calculator",
  },
  {
    label: "MCG to units calculator",
    detail: "U-100 syringe converter",
    href: "/tools/mcg-to-units-calculator",
  },
  {
    label: "mL to units calculator",
    detail: "U-100 volume conversion",
    href: "/tools/ml-to-units-calculator",
  },
  {
    label: "Units to mL calculator",
    detail: "Syringe marks to volume",
    href: "/tools/units-to-ml-calculator",
  },
  {
    label: "BPC-157 calculator",
    detail: "BAC water and U-100 marks",
    href: "/peptides/bpc-157-calculator",
  },
  {
    label: "TB-500 calculator",
    detail: "BAC water and U-100 marks",
    href: "/peptides/tb-500-calculator",
  },
  {
    label: "NAD+ calculator",
    detail: "mL to draw and syringe marks",
    href: "/peptides/nad-plus-calculator",
  },
  {
    label: "B12 injection calculator",
    detail: "mcg/mL conversion support",
    href: "/peptides/vitamin-b12-injection-calculator",
  },
];

export function PopularCalculators({
  className = "",
}: {
  className?: string;
}) {
  return (
    <section
      className={`rounded-[28px] border border-sky-100 bg-white/92 p-5 shadow-[0_22px_70px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-6 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-sky-900 ring-1 ring-sky-100">
            <Sparkles size={14} aria-hidden="true" />
            Popular calculators
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
            Quick links people search for
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            These pages help visitors jump straight into the most common
            peptide and injection math searches.
          </p>
        </div>
        <Link
          href="/peptides"
          className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-900"
        >
          Peptide library
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {popularCalculators.map((calculator) => (
          <Link
            key={calculator.href}
            href={calculator.href}
            className="group flex min-w-0 items-center gap-3 rounded-2xl border border-sky-100 bg-[linear-gradient(135deg,#ffffff_0%,#f3fbff_62%,#fff7ed_100%)] p-3 transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_18px_45px_rgba(14,165,233,0.12)]"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white shadow-sm transition group-hover:bg-sky-900">
              <Calculator size={18} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-slate-950">
                {calculator.label}
              </span>
              <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">
                {calculator.detail}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
