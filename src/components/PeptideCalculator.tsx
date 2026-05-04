"use client";

import {
  AlertTriangle,
  ArrowRightLeft,
  BookOpen,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  Gauge,
  Info,
  Search,
  ShieldCheck,
  ShieldAlert,
  FileText,
} from "lucide-react";
import { type ReactNode, useMemo, useState } from "react";
import {
  compounds,
  getCompoundById,
  getStatusLabel,
  sourceLinks,
  type Compound,
} from "@/data/compounds";
import {
  buildSchedule,
  calculateDose,
  formatDate,
  formatNumber,
  frequencyLabels,
  fromMcg,
  type Frequency,
  type MassUnit,
} from "@/lib/calculations";

const statusClasses: Record<Compound["status"], string> = {
  fda_approved_rx: "border-emerald-300 bg-emerald-50 text-emerald-900",
  approved_compounding_concern: "border-amber-300 bg-amber-50 text-amber-950",
  restricted_reference: "border-rose-300 bg-rose-50 text-rose-950",
  research_unapproved: "border-slate-300 bg-slate-100 text-slate-800",
};

const statusDots: Record<Compound["status"], string> = {
  fda_approved_rx: "bg-emerald-500",
  approved_compounding_concern: "bg-amber-500",
  restricted_reference: "bg-rose-500",
  research_unapproved: "bg-slate-500",
};

const unitOptions: { label: string; value: MassUnit }[] = [
  { label: "mcg", value: "mcg" },
  { label: "mg", value: "mg" },
  { label: "IU", value: "iu" },
];

const frequencyOptions: Frequency[] = [
  "daily",
  "every_other_day",
  "twice_weekly",
  "weekly",
  "monthly",
];

export function PeptideCalculator() {
  const [compoundId, setCompoundId] = useState("semaglutide");
  const [vialAmount, setVialAmount] = useState(5);
  const [vialUnit, setVialUnit] = useState<MassUnit>("mg");
  const [diluentMl, setDiluentMl] = useState(2);
  const [doseAmount, setDoseAmount] = useState(250);
  const [doseUnit, setDoseUnit] = useState<MassUnit>("mcg");
  const [mcgPerIu, setMcgPerIu] = useState(0);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Compound["status"]>(
    "all",
  );
  const [startDate, setStartDate] = useState("");
  const [durationWeeks, setDurationWeeks] = useState(8);
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [planName, setPlanName] = useState("Clinician-provided plan");

  const selectedCompound = getCompoundById(compoundId);
  const iuFactor = mcgPerIu > 0 ? mcgPerIu : undefined;

  const result = useMemo(
    () =>
      calculateDose({
        vialAmount,
        vialUnit,
        diluentMl,
        doseAmount,
        doseUnit,
        mcgPerIu: iuFactor,
      }),
    [vialAmount, vialUnit, diluentMl, doseAmount, doseUnit, iuFactor],
  );

  const filteredCompounds = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return compounds.filter((compound) => {
      const matchesStatus =
        statusFilter === "all" || compound.status === statusFilter;
      const matchesQuery =
        !needle ||
        compound.name.toLowerCase().includes(needle) ||
        compound.category.toLowerCase().includes(needle) ||
        compound.aliases.some((alias) => alias.toLowerCase().includes(needle));

      return matchesStatus && matchesQuery;
    });
  }, [query, statusFilter]);

  const schedule = useMemo(
    () => buildSchedule(startDate, frequency, durationWeeks),
    [startDate, frequency, durationWeeks],
  );

  const convertedDoseMg = result ? fromMcg(result.doseMcg, "mg") : null;
  const convertedDoseIu =
    result && iuFactor ? fromMcg(result.doseMcg, "iu", iuFactor) : null;
  const protocolDisabled = !selectedCompound.protocolEligible;
  const visibleSchedule = schedule.slice(0, 12);
  const totalDoseMcg = result ? result.doseMcg * schedule.length : null;
  const totalVolumeMl = result ? result.doseMl * schedule.length : null;

  return (
    <main className="min-h-screen bg-[#f8f6f0] text-slate-950">
      <section className="border-b border-slate-200 bg-[#f2efe7]">
        <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <a href="#calculator" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-950 text-white">
              <FlaskConical size={20} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                PeptiCalc
              </span>
              <span className="block text-xs text-slate-600">
                U.S. reference build
              </span>
            </span>
          </a>
          <nav className="hidden items-center gap-1 text-sm font-medium text-slate-700 md:flex">
            <NavLink href="#calculator">Calculator</NavLink>
            <NavLink href="#protocol">Protocol</NavLink>
            <NavLink href="#library">Library</NavLink>
            <NavLink href="#compliance">Compliance</NavLink>
            <a
              href="/disclaimer"
              className="rounded-md px-3 py-2 transition hover:bg-white hover:text-slate-950"
            >
              Disclaimer
            </a>
          </nav>
        </header>

        <div
          id="calculator"
          className="mx-auto grid max-w-7xl gap-8 px-4 pb-10 pt-4 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)] lg:px-8 lg:pb-14 lg:pt-8"
        >
          <div className="flex min-w-0 flex-col justify-between gap-8">
            <div className="max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white px-3 py-1 text-sm font-medium text-teal-800 shadow-sm">
                <ShieldCheck size={16} aria-hidden="true" />
                Prescription-aware calculations
              </div>
              <h1 className="text-5xl font-semibold leading-[1.02] text-slate-950 sm:text-6xl lg:text-7xl">
                <span className="block">Peptide</span>
                <span className="block">Calculator</span>
              </h1>
              <p className="mt-5 max-w-[34ch] text-lg leading-8 text-slate-700 sm:max-w-xl">
                Concentration, reconstitution, syringe volume, IU potency
                conversion, and a protocol schedule from verified dose inputs.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Stat
                icon={<Gauge size={18} aria-hidden="true" />}
                label="Runtime"
                value="Static client math"
              />
              <Stat
                icon={<BookOpen size={18} aria-hidden="true" />}
                label="Library"
                value={`${compounds.length} seeded compounds`}
              />
              <Stat
                icon={<ShieldCheck size={18} aria-hidden="true" />}
                label="Scope"
                value="U.S. FDA status"
              />
            </div>
          </div>

          <section className="min-w-0 rounded-lg border border-slate-300 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Dose Calculator</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    U-100 volume is syringe volume, not drug potency.
                  </p>
                </div>
                <Calculator className="text-teal-700" size={24} aria-hidden="true" />
              </div>
            </div>

            <div className="grid gap-5 p-5">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Compound
                <select
                  value={compoundId}
                  onChange={(event) => setCompoundId(event.target.value)}
                  className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                >
                  {compounds.map((compound) => (
                    <option value={compound.id} key={compound.id}>
                      {compound.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_128px]">
                <NumberField
                  label="Vial amount"
                  value={vialAmount}
                  onChange={setVialAmount}
                  step="0.01"
                />
                <UnitSelect
                  label="Unit"
                  value={vialUnit}
                  onChange={setVialUnit}
                />
              </div>

              <NumberField
                label="Diluent volume (mL)"
                value={diluentMl}
                onChange={setDiluentMl}
                step="0.01"
              />

              <div className="grid gap-4 sm:grid-cols-[1fr_128px]">
                <NumberField
                  label="Prescribed dose"
                  value={doseAmount}
                  onChange={setDoseAmount}
                  step="0.01"
                />
                <UnitSelect
                  label="Unit"
                  value={doseUnit}
                  onChange={setDoseUnit}
                />
              </div>

              <NumberField
                label="mcg per IU"
                value={mcgPerIu}
                onChange={setMcgPerIu}
                step="0.001"
              />

              <StatusNotice compound={selectedCompound} />

              <div className="rounded-lg border border-slate-200">
                <MetricRow
                  label="Concentration"
                  value={`${formatNumber(result?.concentrationMcgMl)} mcg/mL`}
                />
                <MetricRow
                  label="Concentration"
                  value={`${formatNumber(result?.concentrationMgMl)} mg/mL`}
                />
                <MetricRow
                  label="Dose volume"
                  value={`${formatNumber(result?.doseMl, 4)} mL`}
                />
                <MetricRow
                  label="U-100 syringe volume"
                  value={`${formatNumber(result?.syringeUnits, 2)} units`}
                />
                <MetricRow
                  label="Doses per vial"
                  value={`${formatNumber(result?.dosesPerVial, 1)}`}
                />
                <MetricRow
                  label="Dose conversion"
                  value={`${formatNumber(convertedDoseMg, 4)} mg${
                    convertedDoseIu ? ` / ${formatNumber(convertedDoseIu, 3)} IU` : ""
                  }`}
                />
              </div>

              {result?.warnings.length ? (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <AlertTriangle size={17} aria-hidden="true" />
                    Measurement check
                  </div>
                  <ul className="grid gap-1">
                    {result.warnings.map((warning) => (
                      <li key={warning}>{warning}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </section>
        </div>
      </section>

      <section
        id="protocol"
        className="border-b border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[420px_1fr]">
          <div>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#175e65] text-white">
              <CalendarDays size={22} aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-semibold">Protocol Builder</h2>
            <p className="mt-4 text-base leading-7 text-slate-700">
              Builds a clean schedule from the selected compound, dose,
              concentration, frequency, and duration.
            </p>
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              <strong className="text-slate-950">Guardrail:</strong> this
              builder does not recommend a dose. It formats dose instructions
              that came from a licensed prescriber, label, or pharmacist.
            </div>
          </div>

          <div className="rounded-lg border border-slate-300 bg-[#fbfaf6]">
            <div className="grid gap-5 p-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Plan name
                <input
                  value={planName}
                  onChange={(event) => setPlanName(event.target.value)}
                  className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Start date
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Frequency
                <select
                  value={frequency}
                  onChange={(event) => setFrequency(event.target.value as Frequency)}
                  className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                >
                  {frequencyOptions.map((option) => (
                    <option value={option} key={option}>
                      {frequencyLabels[option]}
                    </option>
                  ))}
                </select>
              </label>
              <NumberField
                label="Duration (weeks)"
                value={durationWeeks}
                onChange={setDurationWeeks}
                step="1"
              />
            </div>

            <div className="border-t border-slate-200 p-5">
              {protocolDisabled ? (
                <div className="rounded-lg border border-rose-300 bg-rose-50 p-5 text-rose-950">
                  <div className="mb-2 flex items-center gap-2 font-semibold">
                    <AlertTriangle size={18} aria-hidden="true" />
                    Protocol disabled
                  </div>
                  <p className="text-sm leading-6">
                    {selectedCompound.name} is not eligible because its current
                    status is {getStatusLabel(selectedCompound.status)}.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5">
                  <div className="grid gap-3 md:grid-cols-4">
                    <Summary label="Plan" value={planName || "Untitled"} />
                    <Summary
                      label="Events"
                      value={`${schedule.length || 0}`}
                    />
                    <Summary
                      label="Total dose"
                      value={`${formatNumber(totalDoseMcg)} mcg`}
                    />
                    <Summary
                      label="Total volume"
                      value={`${formatNumber(totalVolumeMl, 3)} mL`}
                    />
                  </div>

                  <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <div className="grid grid-cols-[72px_1fr_120px] border-b border-slate-200 bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
                      <span>#</span>
                      <span>Date</span>
                      <span className="text-right">Volume</span>
                    </div>
                    {visibleSchedule.length ? (
                      visibleSchedule.map((date, index) => (
                        <div
                          key={`${date.toISOString()}-${index}`}
                          className="grid grid-cols-[72px_1fr_120px] border-b border-slate-100 px-4 py-3 text-sm last:border-b-0"
                        >
                          <span className="font-medium text-slate-500">
                            {index + 1}
                          </span>
                          <span className="text-slate-900">{formatDate(date)}</span>
                          <span className="text-right font-mono text-slate-900">
                            {formatNumber(result?.doseMl, 4)} mL
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-sm text-slate-600">
                        Select a valid start date.
                      </div>
                    )}
                  </div>

                  {schedule.length > visibleSchedule.length ? (
                    <p className="text-sm text-slate-600">
                      Showing first {visibleSchedule.length} of {schedule.length} events.
                    </p>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="library"
        className="border-b border-slate-200 bg-[#eef5f2] px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#7f1d49] text-white">
                <BookOpen size={22} aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-semibold">Compound Library</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                Searchable status data with FDA references and disabled
                protocol generation for unapproved research compounds.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(240px,1fr)_220px]">
              <label className="relative block">
                <span className="sr-only">Search compounds</span>
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={18}
                  aria-hidden="true"
                />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search compounds"
                  className="h-11 w-full rounded-md border border-slate-300 bg-white pl-10 pr-3 text-base text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                />
              </label>
              <label className="block">
                <span className="sr-only">Filter status</span>
                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value as "all" | Compound["status"])
                  }
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                >
                  <option value="all">All statuses</option>
                  <option value="fda_approved_rx">FDA-approved Rx</option>
                  <option value="approved_compounding_concern">
                    Approved, compounding concern
                  </option>
                  <option value="restricted_reference">Restricted reference</option>
                  <option value="research_unapproved">Research/unapproved</option>
                </select>
              </label>
            </div>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {filteredCompounds.map((compound) => (
              <CompoundCard
                compound={compound}
                key={compound.id}
                selected={compound.id === compoundId}
                onSelect={() => {
                  setCompoundId(compound.id);
                  document
                    .getElementById("calculator")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="compliance"
        className="bg-slate-950 px-4 py-12 text-white sm:px-6 lg:px-8"
      >
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1fr]">
          <div>
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg bg-teal-500 text-slate-950">
              <Info size={22} aria-hidden="true" />
            </div>
            <h2 className="text-3xl font-semibold">Compliance Model</h2>
            <p className="mt-4 text-base leading-7 text-slate-300">
              This build favors FDA-approved prescription references, transparent
              status labels, and calculator workflows that require verified
              input values.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <ComplianceItem
              icon={<CheckCircle2 size={20} aria-hidden="true" />}
              title="Allowed"
              body="Mass-to-volume math, mcg/mL concentration, U-100 syringe volume, and plans based on prescribed inputs."
            />
            <ComplianceItem
              icon={<AlertTriangle size={20} aria-hidden="true" />}
              title="Blocked"
              body="Personalized dosing advice, research-peptide protocols, and unverified IU conversions."
            />
            <ComplianceItem
              icon={<ArrowRightLeft size={20} aria-hidden="true" />}
              title="IU handling"
              body="IU is compound-specific. The app requires a potency factor before converting IU to mass."
            />
            <ComplianceItem
              icon={<ShieldCheck size={20} aria-hidden="true" />}
              title="Traffic posture"
              body="The calculator runs in the browser and can be deployed as a cacheable Next.js static experience."
            />
          </div>

          <div className="lg:col-span-2">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-teal-300">
              Source links
            </h3>
            <div className="grid gap-3 md:grid-cols-2">
              {sourceLinks.map((source) => (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                  key={source.url}
                  className="flex items-center justify-between gap-4 rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-100 transition hover:border-teal-300 hover:bg-white/10"
                >
                  <span>{source.label}</span>
                  <ExternalLink size={16} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 rounded-lg border border-slate-200 bg-slate-50 p-6 md:grid-cols-[auto_1fr]">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[#175e65] text-white">
            <ShieldAlert size={22} aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-950">
              Medical legal posture
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              This site does not provide medical advice or personalize treatment
              decisions. Protocols are generated only from values you enter and are
              not a substitute for clinician review.
            </p>
            <a
              href="/disclaimer"
              className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#175e65] hover:text-slate-950"
            >
              Read full disclaimer
              <FileText size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="rounded-md px-3 py-2 transition hover:bg-white hover:text-slate-950"
    >
      {children}
    </a>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <input
        type="number"
        value={Number.isFinite(value) ? value : ""}
        min="0"
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
      />
    </label>
  );
}

function UnitSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: MassUnit;
  onChange: (value: MassUnit) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as MassUnit)}
        className="h-11 rounded-md border border-slate-300 bg-white px-3 text-base text-slate-950 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
      >
        {unitOptions.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-4 border-b border-slate-200 px-4 py-3 text-sm last:border-b-0">
      <span className="text-slate-600">{label}</span>
      <span className="text-right font-mono font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function StatusNotice({ compound }: { compound: Compound }) {
  return (
    <div className={`rounded-lg border p-4 ${statusClasses[compound.status]}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${statusDots[compound.status]}`} />
        <span className="text-sm font-semibold">{getStatusLabel(compound.status)}</span>
      </div>
      <p className="text-sm leading-6">{compound.legalSummary}</p>
      <p className="mt-2 text-sm leading-6">{compound.iuSupport.note}</p>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </span>
      <span className="mt-2 block truncate font-mono text-base font-semibold text-slate-950">
        {value}
      </span>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-slate-300 bg-white/80 p-4">
      <div className="mb-3 text-[#175e65]">{icon}</div>
      <div className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function CompoundCard({
  compound,
  selected,
  onSelect,
}: {
  compound: Compound;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <article className="rounded-lg border border-slate-300 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-slate-950">{compound.name}</h3>
            <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusClasses[compound.status]}`}>
              {getStatusLabel(compound.status)}
            </span>
          </div>
          <p className="mt-2 text-sm font-medium text-slate-600">
            {compound.category}
          </p>
        </div>
        <button
          type="button"
          onClick={onSelect}
          className="h-10 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-[#175e65] disabled:cursor-default disabled:bg-slate-300 disabled:text-slate-600"
          disabled={selected}
        >
          {selected ? "Selected" : "Select"}
        </button>
      </div>

      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="font-semibold text-slate-900">Legal summary</dt>
          <dd className="mt-1 leading-6 text-slate-700">{compound.legalSummary}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Route</dt>
          <dd className="mt-1 leading-6 text-slate-700">{compound.route}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Protocol</dt>
          <dd className="mt-1 leading-6 text-slate-700">
            {compound.protocolEligible ? compound.referenceNote : "Disabled"}
          </dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        {compound.aliases.slice(0, 5).map((alias) => (
          <span
            key={alias}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600"
          >
            {alias}
          </span>
        ))}
      </div>

      <a
        href={compound.sourceUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#175e65] hover:text-slate-950"
      >
        {compound.sourceLabel}
        <ExternalLink size={15} aria-hidden="true" />
      </a>
    </article>
  );
}

function ComplianceItem({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-white/15 bg-white/5 p-5">
      <div className="mb-3 text-teal-300">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
    </div>
  );
}
