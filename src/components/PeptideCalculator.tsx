"use client";

import { type ReactNode, useMemo, useState } from "react";
import {
  Calculator,
  CheckCircle2,
  FileText,
  FlaskConical,
  Home,
  Search,
  User,
  UserCircle2,
  AlertTriangle,
} from "lucide-react";
import { calculateDose, formatNumber } from "@/lib/calculations";

type Choice = number | "other";
type DoseInputUnit = "mcg" | "iu";

const syringeOptions = [0.3, 0.5, 1.0];
const vialOptions: Choice[] = [5, 10, 15, 20, "other"];
const waterOptions: Choice[] = [1, 2, 3, 5, "other"];
const doseOptionsByUnit: Record<DoseInputUnit, Choice[]> = {
  mcg: [50, 100, 250, 500, 1000, "other"],
  iu: [1, 2, 5, 10, 20, "other"],
};

const searchItems = [
  {
    label: "Syringe size",
    eyebrow: "Step 1",
    detail: "Choose 0.3, 0.5, or 1.0 mL",
    href: "#syringe-size",
    keywords: "syringe needle injection size units u100",
  },
  {
    label: "Total MG's in your vial",
    eyebrow: "Step 2",
    detail: "Pick the total peptide amount",
    href: "#vial-total",
    keywords: "vial mg peptide powder quantity amount",
  },
  {
    label: "BAC water",
    eyebrow: "Step 3",
    detail: "Choose how much BAC water to add",
    href: "#bac-water",
    keywords: "water bacteriostatic bac diluent ml",
  },
  {
    label: "Dose",
    eyebrow: "Step 4",
    detail: "Choose MCG or IU dose",
    href: "#dose-target",
    keywords: "dose dosage mcg iu amount target",
  },
  {
    label: "What to do",
    eyebrow: "Result",
    detail: "See where to pull the syringe",
    href: "#what-to-do",
    keywords: "result guide pull syringe units marker",
  },
  {
    label: "Customer profile",
    eyebrow: "Account",
    detail: "Sign in or create an account",
    href: "/account",
    keywords: "account profile sign in login customer saved protocols",
  },
  {
    label: "Disclaimer",
    eyebrow: "Legal",
    detail: "Read important safety information",
    href: "/disclaimer",
    keywords: "legal disclaimer safety prescription",
  },
];

export function PeptideCalculator() {
  const [syringeMl, setSyringeMl] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [vialChoice, setVialChoice] = useState<Choice>(10);
  const [vialOther, setVialOther] = useState(10);

  const [waterChoice, setWaterChoice] = useState<Choice>(2);
  const [waterOther, setWaterOther] = useState(2);

  const [doseChoice, setDoseChoice] = useState<Choice>(250);
  const [doseOther, setDoseOther] = useState(250);
  const [doseInputUnit, setDoseInputUnit] = useState<DoseInputUnit>("mcg");

  const vialMg = vialChoice === "other" ? vialOther : vialChoice;
  const waterMl = waterChoice === "other" ? waterOther : waterChoice;
  const doseInputAmount = doseChoice === "other" ? doseOther : doseChoice;
  const concentrationMcgMl =
    vialMg > 0 && waterMl > 0 ? (vialMg * 1000) / waterMl : 0;
  const doseMcg =
    doseInputUnit === "mcg"
      ? doseInputAmount
      : doseInputAmount * (concentrationMcgMl / 100);
  const doseLabel =
    doseInputUnit === "mcg"
      ? `${formatNumber(doseInputAmount, 0)} mcg`
      : `${formatNumber(doseInputAmount, 2)} IU`;
  const doseOptions = doseOptionsByUnit[doseInputUnit];

  function handleDoseInputUnitChange(unit: DoseInputUnit) {
    setDoseInputUnit(unit);
    setDoseChoice(unit === "mcg" ? 250 : 5);
    setDoseOther(unit === "mcg" ? 250 : 5);
  }

  const result = useMemo(
    () =>
      calculateDose({
        vialAmount: vialMg,
        vialUnit: "mg",
        diluentMl: waterMl,
        doseAmount: doseMcg,
        doseUnit: "mcg",
      }),
    [doseMcg, vialMg, waterMl],
  );

  const syringeCapacity = syringeMl * 100;
  const tooLargeForSyringe = Boolean(
    result && result.syringeUnits > syringeCapacity,
  );
  const doseAsMg = result ? result.doseMcg / 1000 : null;
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredSearchItems = useMemo(() => {
    if (!normalizedSearchQuery) {
      return [];
    }

    return searchItems
      .filter((item) =>
        `${item.label} ${item.eyebrow} ${item.detail} ${item.keywords}`
          .toLowerCase()
          .includes(normalizedSearchQuery),
      )
      .slice(0, 5);
  }, [normalizedSearchQuery]);

  function handleSearchSelect(href: string) {
    if (href.startsWith("#")) {
      document
        .querySelector(href)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.assign(href);
    }

    setSearchQuery("");
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#f8fbff_0%,#eef9ff_38%,#fff7fb_70%,#fffaf1_100%)] text-slate-900">
      <div className="mx-auto flex min-w-0 max-w-[1440px]">
        <aside className="hidden min-h-screen w-[86px] shrink-0 border-r border-sky-100 bg-white/70 py-5 shadow-[12px_0_45px_rgba(14,165,233,0.06)] backdrop-blur md:flex md:flex-col md:items-center md:gap-3">
          <IconTab icon={<FlaskConical size={20} />} href="#home" active />
          <IconTab icon={<Home size={20} />} href="#home" />
          <IconTab icon={<Calculator size={20} />} href="#calculator" />
          <IconTab icon={<User size={20} />} href="/account" />
          <IconTab icon={<FileText size={20} />} href="/disclaimer" />
        </aside>

        <div className="min-w-0 w-full px-4 pb-10 pt-4 sm:px-6">
          <header id="home" className="flex items-center gap-3">
            <div className="relative min-w-0 flex-1">
              <div className="flex h-12 min-w-0 items-center gap-3 rounded-full bg-white/80 px-4 shadow-[0_14px_45px_rgba(14,165,233,0.09)] ring-1 ring-sky-100 backdrop-blur">
                <Search size={18} className="text-sky-800" aria-hidden="true" />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && filteredSearchItems[0]) {
                      event.preventDefault();
                      handleSearchSelect(filteredSearchItems[0].href);
                    }

                    if (event.key === "Escape") {
                      setSearchQuery("");
                    }
                  }}
                  placeholder="Search calculator"
                  aria-label="Search peptide calculator"
                  className="min-w-0 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
                />
              </div>
              {normalizedSearchQuery ? (
                <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 rounded-3xl border border-sky-100 bg-white/95 p-2 shadow-[0_22px_65px_rgba(15,23,42,0.14)] backdrop-blur">
                  {filteredSearchItems.length ? (
                    filteredSearchItems.map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleSearchSelect(item.href)}
                        onMouseDown={(event) => event.preventDefault()}
                        className="grid w-full gap-0.5 rounded-2xl px-4 py-3 text-left transition hover:bg-sky-50"
                      >
                        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-800">
                          {item.eyebrow}
                        </span>
                        <span className="text-sm font-semibold text-slate-950">
                          {item.label}
                        </span>
                        <span className="text-xs text-slate-500">
                          {item.detail}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="rounded-2xl px-4 py-3 text-sm text-slate-500">
                      No calculator match yet. Try dose, vial, water, or account.
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <a
              href="/account"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#ffffff_0%,#e0f2fe_58%,#fff7ed_100%)] text-slate-800 shadow-[0_12px_35px_rgba(14,165,233,0.12)] ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(14,165,233,0.18)]"
              aria-label="Account"
            >
              <UserCircle2 size={22} aria-hidden="true" />
            </a>
          </header>

          <section
            id="calculator"
            className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"
          >
            <div className="relative min-w-0 overflow-hidden rounded-[28px] border border-sky-100 bg-white/95 p-5 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(14,165,233,0.16)_0%,rgba(236,72,153,0.08)_48%,rgba(251,146,60,0.12)_100%)]"
              />
              <div className="relative">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <h1 className="text-3xl font-semibold sm:text-4xl">
                    Peptide Calculator
                  </h1>
                  <p className="mt-2 text-sm font-semibold text-slate-900 sm:text-base">
                    How to use peptide calculator
                  </p>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                    Pick your syringe, vial amount, BAC water, and dose. The app
                    shows exactly where to pull the syringe.
                  </p>
                </div>

                <DoseUnitSelector
                  value={doseInputUnit}
                  onChange={handleDoseInputUnitChange}
                />
              </div>

              <GuideStrip doseInputUnit={doseInputUnit} />

              <div className="mt-6 grid gap-4">
                <SoftPanel id="syringe-size" title="What syringe size do you have?">
                  <SyringeSizePicker
                    options={syringeOptions}
                    value={syringeMl}
                    onChange={setSyringeMl}
                  />
                </SoftPanel>

                <SoftPanel
                  id="vial-total"
                  title="Total MG's in your vial"
                  visual={<VialIllustration tone="amber" />}
                >
                  <ChipRow
                    options={vialOptions}
                    value={vialChoice}
                    onChange={(value) => setVialChoice(value as Choice)}
                    formatLabel={(value) =>
                      value === "other" ? "Other" : `${value} mg`
                    }
                  />
                  {vialChoice === "other" ? (
                    <NumberField
                      label="Custom vial amount (mg)"
                      value={vialOther}
                      onChange={setVialOther}
                    />
                  ) : null}
                </SoftPanel>

                <SoftPanel
                  id="bac-water"
                  title="How much BAC water do you want to add?"
                  visual={<WaterIllustration />}
                >
                  <ChipRow
                    options={waterOptions}
                    value={waterChoice}
                    onChange={(value) => setWaterChoice(value as Choice)}
                    formatLabel={(value) =>
                      value === "other" ? "Other" : `${value} mL`
                    }
                  />
                  {waterChoice === "other" ? (
                    <NumberField
                      label="Custom water amount (mL)"
                      value={waterOther}
                      onChange={setWaterOther}
                    />
                  ) : null}
                </SoftPanel>

                <SoftPanel
                  id="dose-target"
                  title="What dose are you taking?"
                  visual={<DoseIllustration />}
                >
                  <ChipRow
                    options={doseOptions}
                    value={doseChoice}
                    onChange={(value) => setDoseChoice(value as Choice)}
                    formatLabel={(value) =>
                      value === "other"
                        ? "Other"
                        : `${value} ${doseInputUnit === "mcg" ? "mcg" : "IU"}`
                    }
                  />
                  {doseChoice === "other" ? (
                    <NumberField
                      label={`Custom dose (${doseInputUnit === "mcg" ? "mcg" : "IU"})`}
                      value={doseOther}
                      onChange={setDoseOther}
                    />
                  ) : null}
                </SoftPanel>
              </div>
              </div>
            </div>

            <aside
              id="what-to-do"
              className="min-w-0 rounded-[28px] border border-sky-100 bg-white/95 p-5 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-6"
            >
              <h2 className="text-lg font-semibold">What to do</h2>
              <p className="mt-1 text-sm text-slate-600">
                Follow the blue marker on the syringe guide.
              </p>

              {tooLargeForSyringe ? (
                <Notice tone="warning">
                  This dose is larger than your selected syringe capacity of{" "}
                  {formatNumber(syringeCapacity, 0)} units.
                </Notice>
              ) : null}

              {result?.warnings.map((warning) => (
                <Notice key={warning} tone="warning">
                  {warning}
                </Notice>
              ))}

              {result && !tooLargeForSyringe ? (
                <Notice tone="ok">
                  Ready: draw the syringe to {formatNumber(result.syringeUnits, 2)}{" "}
                  units.
                </Notice>
              ) : null}

              <div className="mt-4 rounded-3xl bg-[#f4f5f7] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Pull syringe to
                </div>
                <div className="mt-2 font-mono text-4xl font-semibold">
                  {formatNumber(result?.syringeUnits, 2)} units
                </div>
              </div>

              <DoseSyringeGuide
                units={result?.syringeUnits ?? 0}
                capacityUnits={syringeCapacity}
                doseLabel={doseLabel}
                tooLarge={tooLargeForSyringe}
              />

              <div className="mt-4 grid gap-2 rounded-2xl border border-slate-200 bg-white p-3">
                <MetricRow
                  label="Dose volume"
                  value={`${formatNumber(result?.doseMl, 4)} mL`}
                />
                <MetricRow
                  label="Concentration"
                  value={`${formatNumber(result?.concentrationMcgMl)} mcg/mL`}
                />
                <MetricRow
                  label="Dose amount"
                  value={`${formatNumber(result?.doseMcg, 2)} mcg / ${formatNumber(doseAsMg, 4)} mg`}
                />
                <MetricRow
                  label="mcg per unit"
                  value={`${formatNumber(result?.mcgPerSyringeUnit, 3)} mcg`}
                />
              </div>
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}

function IconTab({
  icon,
  href,
  active = false,
}: {
  icon: ReactNode;
  href: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      className={`grid h-12 w-12 place-items-center rounded-2xl transition ${
        active
          ? "bg-[linear-gradient(135deg,#0f172a_0%,#075985_100%)] text-white shadow-[0_12px_28px_rgba(14,165,233,0.18)]"
          : "bg-white/80 text-slate-700 ring-1 ring-sky-100 hover:bg-sky-50"
      }`}
    >
      {icon}
    </a>
  );
}

function DoseUnitSelector({
  value,
  onChange,
}: {
  value: DoseInputUnit;
  onChange: (value: DoseInputUnit) => void;
}) {
  return (
    <div className="w-full rounded-2xl border border-sky-100 bg-white/75 p-2 shadow-sm xl:w-auto">
      <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-[0.08em] text-sky-900">
        Dose unit
      </div>
      <div className="grid grid-cols-2 gap-1 rounded-full bg-sky-50 p-1">
        {(["mcg", "iu"] as const).map((unit) => {
          const selected = unit === value;
          return (
            <button
              key={unit}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(unit)}
              className={`h-9 rounded-full px-4 text-sm font-semibold transition ${
                selected
                  ? "bg-[linear-gradient(135deg,#0f172a_0%,#075985_100%)] text-white shadow-sm"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              {unit === "mcg" ? "MCG" : "IU"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SoftPanel({
  id,
  title,
  visual,
  children,
}: {
  id?: string;
  title: string;
  visual?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-4 rounded-2xl bg-[linear-gradient(145deg,#fbfdff_0%,#f1f9ff_58%,#fffaf7_100%)] p-4 ring-1 ring-sky-50"
    >
      <div
        className={
          visual
            ? "grid grid-cols-[48px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-4"
            : ""
        }
      >
        {visual ? (
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-[0_12px_30px_rgba(14,165,233,0.08)] ring-1 ring-sky-100 sm:h-14 sm:w-14">
            {visual}
          </div>
        ) : null}
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <div className="mt-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

function SyringeSizePicker({
  options,
  value,
  onChange,
}: {
  options: number[];
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid min-w-0 gap-2">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            className={`grid min-h-16 grid-cols-[58px_minmax(0,1fr)] items-center gap-3 rounded-2xl border px-3 py-2 text-left transition ${
              selected
                ? "border-sky-400 bg-white shadow-[0_12px_30px_rgba(14,165,233,0.10)]"
                : "border-white bg-white/75 hover:border-sky-100 hover:bg-white"
            }`}
          >
            <span className="text-sm font-semibold text-slate-900">
              {option.toFixed(1)} mL
            </span>
            <MiniSyringe selected={selected} capacityMl={option} />
          </button>
        );
      })}
    </div>
  );
}

function MiniSyringe({
  selected,
  capacityMl,
}: {
  selected: boolean;
  capacityMl: number;
}) {
  const fillWidth = 18 + capacityMl * 23;
  const idPart = String(capacityMl).replace(".", "");
  const fillGradientId = `mini-fill-${idPart}-${selected ? "selected" : "idle"}`;
  const barrelGradientId = `mini-barrel-${idPart}`;

  return (
    <svg
      viewBox="0 0 260 52"
      role="img"
      aria-label={`${capacityMl.toFixed(1)} mL syringe`}
      className="h-11 w-full min-w-0"
    >
      <defs>
        <linearGradient id={barrelGradientId} x1="52" x2="200" y1="14" y2="38">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.48" stopColor="#eef7ff" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id={fillGradientId} x1="52" x2="120" y1="14" y2="38">
          <stop offset="0" stopColor={selected ? "#22d3ee" : "#dbe4ee"} />
          <stop offset="0.72" stopColor={selected ? "#38bdf8" : "#cbd5e1"} />
          <stop offset="1" stopColor={selected ? "#0ea5e9" : "#e2e8f0"} />
        </linearGradient>
      </defs>
      <line
        x1="8"
        x2="43"
        y1="26"
        y2="26"
        stroke="#9aa7b7"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <rect x="34" y="22" width="7" height="8" rx="1.5" fill="#0f172a" />
      <rect x="41" y="20" width="11" height="12" rx="2.5" fill="#111827" />
      <rect
        x="52"
        y="14"
        width="148"
        height="24"
        rx="6"
        fill={`url(#${barrelGradientId})`}
      />
      <path d="M58 18h134" stroke="#ffffff" strokeLinecap="round" strokeWidth="2.2" />
      <path d="M59 34h130" stroke="#cbd5e1" strokeLinecap="round" strokeWidth="1.1" />
      <rect
        x="52"
        y="14"
        width={fillWidth}
        height="24"
        rx="4"
        fill={`url(#${fillGradientId})`}
        opacity={selected ? "0.95" : "0.48"}
      />
      <rect
        x="52"
        y="14"
        width="148"
        height="24"
        rx="6"
        fill="none"
        stroke="#111827"
        strokeWidth="2.5"
      />
      {Array.from({ length: 12 }, (_, index) => {
        const x = 65 + index * 10.5;
        const longTick = index % 5 === 0;
        return (
          <line
            key={x}
            x1={x}
            x2={x}
            y1="15"
            y2={longTick ? 38 : 30}
            stroke="#111827"
            strokeWidth={longTick ? "2" : "1.4"}
          />
        );
      })}
      <rect x="199" y="9" width="7" height="34" rx="3.5" fill="#dbe4ee" />
      <rect x="206" y="22" width="29" height="8" rx="4" fill="#fb923c" />
      <path d="M207 23h26" stroke="#fed7aa" strokeLinecap="round" strokeWidth="1.5" />
      <circle cx="244" cy="26" r="14" fill="#fb923c" />
      <circle cx="239" cy="22" r="4" fill="#fdba74" opacity="0.72" />
      <rect x="229" y="21" width="8" height="10" rx="2" fill="#fdba74" />
      <path d="M214 23h14" stroke="#fed7aa" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function DoseSyringeGuide({
  units,
  capacityUnits,
  doseLabel,
  tooLarge,
}: {
  units: number;
  capacityUnits: number;
  doseLabel: string;
  tooLarge: boolean;
}) {
  const safeCapacity = Math.max(capacityUnits, 1);
  const safeUnits = Number.isFinite(units) ? Math.max(units, 0) : 0;
  const cappedUnits = Math.min(safeUnits, safeCapacity);
  const barrelX = 72;
  const barrelY = 64;
  const barrelWidth = 356;
  const barrelHeight = 50;
  const fillWidth = (cappedUnits / safeCapacity) * barrelWidth;
  const markerX = barrelX + fillWidth;
  const majorStep = safeCapacity <= 30 ? 5 : 10;
  const minorStep = safeCapacity <= 50 ? 1 : 2;
  const minorTicks = Array.from(
    { length: Math.floor(safeCapacity / minorStep) + 1 },
    (_, index) => index * minorStep,
  );
  const majorTicks = Array.from(
    { length: Math.floor(safeCapacity / majorStep) + 1 },
    (_, index) => index * majorStep,
  );

  return (
    <section className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Match the blue marker
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            For {doseLabel}, stop the plunger at{" "}
            <span className="font-mono font-semibold text-slate-900">
              {formatNumber(units, 2)}
            </span>{" "}
            units.
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            tooLarge
              ? "bg-amber-100 text-amber-900"
              : "bg-sky-100 text-sky-900"
          }`}
        >
          U-100
        </span>
      </div>

      <div className="mt-3 overflow-hidden rounded-2xl bg-[#f6f7f8] p-2">
        <svg
          viewBox="0 0 560 180"
          role="img"
          aria-label={`Syringe filled to ${formatNumber(units, 2)} units out of ${formatNumber(capacityUnits, 0)} units`}
          className="h-auto w-full"
        >
          <defs>
            <linearGradient id="guide-barrel" x1="72" x2="428" y1="64" y2="114">
              <stop offset="0" stopColor="#ffffff" />
              <stop offset="0.52" stopColor="#eef7ff" />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="guide-dose-fill" x1="72" x2="180" y1="64" y2="114">
              <stop offset="0" stopColor={tooLarge ? "#fbbf24" : "#22d3ee"} />
              <stop offset="0.7" stopColor={tooLarge ? "#f59e0b" : "#0ea5e9"} />
              <stop offset="1" stopColor={tooLarge ? "#d97706" : "#0284c7"} />
            </linearGradient>
          </defs>
          <rect x="19" y="87" width="45" height="4" rx="2" fill="#94a3b8" />
          <line
            x1="9"
            x2={barrelX}
            y1="89"
            y2="89"
            stroke="#111827"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <rect x="52" y="75" width="20" height="28" rx="4" fill="#111827" />
          <rect
            x={barrelX}
            y={barrelY}
            width={barrelWidth}
            height={barrelHeight}
            rx="8"
            fill="url(#guide-barrel)"
            opacity="0.96"
          />
          <rect
            x={barrelX}
            y={barrelY}
            width={fillWidth}
            height={barrelHeight}
            rx="6"
            fill="url(#guide-dose-fill)"
            opacity="0.92"
          />
          <path
            d={`M${barrelX + 8} ${barrelY + 9}h${barrelWidth - 20}`}
            stroke="#ffffff"
            strokeLinecap="round"
            strokeWidth="3"
            opacity="0.9"
          />
          <path
            d={`M${barrelX + 12} ${barrelY + barrelHeight - 8}h${barrelWidth - 24}`}
            stroke="#cbd5e1"
            strokeLinecap="round"
            strokeWidth="1.6"
          />
          <rect
            x={barrelX}
            y={barrelY}
            width={barrelWidth}
            height={barrelHeight}
            rx="8"
            fill="none"
            stroke="#111827"
            strokeWidth="5"
          />
          {minorTicks.map((tick) => {
            const x = barrelX + (tick / safeCapacity) * barrelWidth;
            const isMajor = tick % majorStep === 0;
            return (
              <line
                key={`minor-${tick}`}
                x1={x}
                x2={x}
                y1="66"
                y2={isMajor ? 111 : 91}
                stroke="#111827"
                strokeWidth={isMajor ? "2.2" : "1.35"}
              />
            );
          })}
          {majorTicks
            .filter((tick) => tick > 0)
            .map((tick) => {
              const x = barrelX + (tick / safeCapacity) * barrelWidth;
              return (
                <text
                  key={`label-${tick}`}
                  x={x}
                  y="132"
                  textAnchor="middle"
                  className="fill-slate-700 text-[13px] font-semibold"
                >
                  {tick}
                </text>
              );
            })}
          <line
            x1={markerX}
            x2={markerX}
            y1="54"
            y2="122"
            stroke={tooLarge ? "#92400e" : "#0369a1"}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <rect
            x={barrelX + barrelWidth}
            y="58"
            width="9"
            height="62"
            rx="4.5"
            fill="#dbe4ee"
          />
          <rect
            x={barrelX + barrelWidth + 9}
            y="82"
            width="52"
            height="13"
            rx="6.5"
            fill="#fb923c"
          />
          <circle cx="522" cy="88.5" r="25" fill="#fb923c" />
          <circle cx="513" cy="79" r="7" fill="#fdba74" opacity="0.7" />
          <rect x="480" y="79" width="20" height="19" rx="4" fill="#fdba74" />
        </svg>
      </div>
    </section>
  );
}

function GuideStrip({ doseInputUnit }: { doseInputUnit: DoseInputUnit }) {
  const steps = [
    {
      label: "Syringe",
      visual: <GuideSyringeIcon />,
    },
    {
      label: "Vial",
      visual: <VialIllustration tone="amber" />,
    },
    { label: "BAC water", visual: <WaterIllustration /> },
    {
      label: "Dose",
      visual: <DoseIllustration />,
    },
  ];

  return (
    <section className="mt-5 rounded-[22px] border border-sky-100 bg-[linear-gradient(135deg,#eef9ff_0%,#fff7fb_56%,#fffaf1_100%)] p-3 shadow-[0_16px_45px_rgba(14,165,233,0.08)]">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-xs font-bold uppercase tracking-[0.12em] text-sky-900">
          Steps
        </div>
        <div className="text-xs font-semibold text-slate-500">
          {doseInputUnit === "mcg" ? "MCG mode" : "IU mode"}
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className="flex items-center gap-3 rounded-2xl border border-white/80 bg-white/90 px-3 py-2 shadow-[0_10px_25px_rgba(15,23,42,0.06)] ring-1 ring-sky-50"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#0f172a_0%,#075985_100%)] text-xs font-semibold text-white shadow-sm">
              {index + 1}
            </span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white shadow-sm ring-1 ring-sky-100">
              {step.visual}
            </span>
            <span className="min-w-0">
              <span className="block text-base font-semibold leading-5 text-slate-900">
                {step.label}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function GuideSyringeIcon() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Syringe" className="h-8 w-8">
      <line
        x1="6"
        x2="16"
        y1="24"
        y2="24"
        stroke="#94a3b8"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <rect
        x="15"
        y="18"
        width="20"
        height="12"
        rx="3"
        fill="#ffffff"
        stroke="#111827"
        strokeWidth="2"
      />
      <path d="M15 18h9v12h-9z" fill="#38bdf8" opacity="0.9" />
      <line x1="23" x2="23" y1="19" y2="29" stroke="#111827" strokeWidth="1.3" />
      <line x1="28" x2="28" y1="19" y2="27" stroke="#111827" strokeWidth="1.3" />
      <rect x="35" y="20" width="2.5" height="8" rx="1.2" fill="#cbd5e1" />
      <rect x="37" y="22" width="6" height="4" rx="2" fill="#fb923c" />
      <circle cx="43" cy="24" r="4" fill="#fb923c" />
    </svg>
  );
}

function VialIllustration({ tone }: { tone: "amber" | "sky" }) {
  const powder = tone === "amber" ? "#e2e8f0" : "#dbeafe";
  const glassGradientId = `vial-glass-${tone}`;
  const capGradientId = `vial-cap-${tone}`;

  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Peptide vial"
      className="h-10 w-10"
    >
      <defs>
        <linearGradient id={glassGradientId} x1="14" x2="34" y1="13" y2="42">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.62" stopColor="#eef7ff" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id={capGradientId} x1="17" x2="31" y1="5" y2="12">
          <stop offset="0" stopColor="#0f172a" />
          <stop offset="1" stopColor="#64748b" />
        </linearGradient>
      </defs>
      <rect x="17" y="5" width="14" height="7" rx="2.5" fill={`url(#${capGradientId})`} />
      <rect x="18" y="9" width="12" height="5" rx="1.5" fill="#94a3b8" />
      <rect
        x="14"
        y="13"
        width="20"
        height="29"
        rx="6"
        fill={`url(#${glassGradientId})`}
        stroke="#111827"
        strokeWidth="2"
      />
      <path d="M16 35c4-4 11-4 16 0v2a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5z" fill={powder} />
      <path
        d="M18 35c3-2 9-2 12 0"
        fill="none"
        stroke="#cbd5e1"
        strokeLinecap="round"
        strokeWidth="1.5"
      />
      <circle cx="20" cy="32" r="1" fill="#cbd5e1" />
      <circle cx="25" cy="31" r="0.9" fill="#e2e8f0" />
      <circle cx="29" cy="33" r="0.8" fill="#cbd5e1" />
      <rect
        x="17"
        y="19"
        width="14"
        height="8"
        rx="2"
        fill="#f8fafc"
        stroke="#cbd5e1"
      />
      <path d="M21 23h6" stroke="#0ea5e9" strokeLinecap="round" strokeWidth="2" />
      <path
        d="M18 16c3-1 7-1 12 0"
        stroke="#ffffff"
        strokeLinecap="round"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </svg>
  );
}

function WaterIllustration() {
  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="Bacteriostatic water"
      className="h-10 w-10"
    >
      <defs>
        <linearGradient id="water-glass" x1="14" x2="34" y1="13" y2="42">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.58" stopColor="#eef7ff" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient id="water-fill" x1="16" x2="32" y1="27" y2="41">
          <stop offset="0" stopColor="#7dd3fc" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <rect x="17" y="5" width="14" height="7" rx="2.5" fill="#64748b" />
      <rect
        x="14"
        y="13"
        width="20"
        height="29"
        rx="6"
        fill="url(#water-glass)"
        stroke="#111827"
        strokeWidth="2"
      />
      <path d="M16 27h16v9a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5z" fill="url(#water-fill)" opacity="0.72" />
      <rect
        x="17"
        y="18"
        width="14"
        height="8"
        rx="2"
        fill="#ffffff"
        stroke="#cbd5e1"
      />
      <path
        d="M24 19c2 3 4 5 4 7a4 4 0 0 1-8 0c0-2 2-4 4-7z"
        fill="#38bdf8"
        opacity="0.9"
      />
      <path
        d="M19 35c3 3 7 3 10 0"
        fill="none"
        stroke="#0ea5e9"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function DoseIllustration() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Dose amount" className="h-10 w-10">
      <defs>
        <linearGradient id="dose-card" x1="9" x2="39" y1="9" y2="39">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.56" stopColor="#f0f9ff" />
          <stop offset="1" stopColor="#fff7ed" />
        </linearGradient>
        <linearGradient id="dose-drop" x1="16" x2="24" y1="22" y2="34">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <rect x="9" y="9" width="30" height="30" rx="8" fill="url(#dose-card)" stroke="#111827" strokeWidth="2" />
      <rect x="14" y="15" width="16" height="4" rx="2" fill="#e2e8f0" />
      <path
        d="M20 22c2 3 4 5 4 8a4 4 0 0 1-8 0c0-3 2-5 4-8z"
        fill="url(#dose-drop)"
        opacity="0.95"
      />
      <text
        x="29"
        y="31"
        textAnchor="middle"
        className="fill-slate-900 text-[8px] font-bold"
      >
        mcg
      </text>
      <path d="M33 12h6v6" fill="none" stroke="#fb923c" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ChipRow<T extends Choice>({
  options,
  value,
  onChange,
  formatLabel,
}: {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  formatLabel: (value: T) => string;
}) {
  return (
    <div className="flex min-w-0 flex-wrap gap-2">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            type="button"
            key={String(option)}
            onClick={() => onChange(option)}
            className={`h-9 shrink-0 rounded-full px-3 text-sm transition ${
              selected
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
            }`}
          >
            {formatLabel(option)}
          </button>
        );
      })}
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mt-3 grid gap-1 text-xs font-semibold text-slate-600">
      {label}
      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />
    </label>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 rounded-2xl bg-[linear-gradient(135deg,#ffffff_0%,#f4f9ff_100%)] px-3 py-2 text-sm ring-1 ring-sky-100">
      <span className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
        {label}
      </span>
      <span className="text-lg font-semibold leading-7 tracking-normal text-slate-950 tabular-nums">
        {value}
      </span>
    </div>
  );
}

function Notice({
  tone,
  children,
}: {
  tone: "ok" | "warning";
  children: ReactNode;
}) {
  const isWarning = tone === "warning";
  return (
    <div
      className={`mt-3 rounded-2xl border p-3 text-sm ${
        isWarning
          ? "border-amber-300 bg-amber-50 text-amber-950"
          : "border-emerald-300 bg-emerald-50 text-emerald-950"
      }`}
    >
      <div className="flex items-start gap-2">
        {isWarning ? (
          <AlertTriangle size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        ) : (
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
        )}
        <span>{children}</span>
      </div>
    </div>
  );
}
