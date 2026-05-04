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

const syringeOptions = [0.3, 0.5, 1.0];
const vialOptions: Choice[] = [5, 10, 15, 20, "other"];
const waterOptions: Choice[] = [1, 2, 3, 5, "other"];
const doseOptions: Choice[] = [50, 100, 250, 500, 1000, "other"];

export function PeptideCalculator() {
  const [syringeMl, setSyringeMl] = useState(1);

  const [vialChoice, setVialChoice] = useState<Choice>(10);
  const [vialOther, setVialOther] = useState(10);

  const [waterChoice, setWaterChoice] = useState<Choice>(2);
  const [waterOther, setWaterOther] = useState(2);

  const [doseChoice, setDoseChoice] = useState<Choice>(250);
  const [doseOther, setDoseOther] = useState(250);

  const [mcgPerIu, setMcgPerIu] = useState(0);

  const vialMg = vialChoice === "other" ? vialOther : vialChoice;
  const waterMl = waterChoice === "other" ? waterOther : waterChoice;
  const doseMcg = doseChoice === "other" ? doseOther : doseChoice;

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
  const doseAsIu = result && mcgPerIu > 0 ? result.doseMcg / mcgPerIu : null;

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f2f3f5] text-slate-900">
      <div className="mx-auto flex min-w-0 max-w-[1440px]">
        <aside className="hidden min-h-screen w-[86px] shrink-0 border-r border-slate-200 bg-[#f7f7f7] py-5 md:flex md:flex-col md:items-center md:gap-3">
          <IconTab icon={<FlaskConical size={20} />} href="#home" active />
          <IconTab icon={<Home size={20} />} href="#home" />
          <IconTab icon={<Calculator size={20} />} href="#calculator" />
          <IconTab icon={<User size={20} />} href="/account" />
          <IconTab icon={<FileText size={20} />} href="/disclaimer" />
        </aside>

        <div className="min-w-0 w-full px-4 pb-10 pt-4 sm:px-6">
          <header id="home" className="flex items-center gap-3">
            <div className="flex h-12 min-w-0 flex-1 items-center gap-3 rounded-full bg-[#e7e7e5] px-4">
              <Search size={18} className="text-slate-500" aria-hidden="true" />
              <input
                value=""
                readOnly
                placeholder="Search"
                className="min-w-0 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
              />
            </div>
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200"
              aria-label="Account"
            >
              <UserCircle2 size={22} aria-hidden="true" />
            </button>
          </header>

          <section
            id="calculator"
            className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"
          >
            <div className="min-w-0 rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Peptide Calculator
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Enter your vial amount, water amount, and dose target. The app
                calculates how many U-100 units to draw.
              </p>

              <div className="mt-6 grid gap-4">
                <SoftPanel title="1) Syringe size">
                  <SyringeSizePicker
                    options={syringeOptions}
                    value={syringeMl}
                    onChange={setSyringeMl}
                  />
                </SoftPanel>

                <SoftPanel
                  title="2) Vial quantity"
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
                  title="3) Bacteriostatic water"
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
                  title="4) Target dose"
                  visual={<DoseIllustration />}
                >
                  <ChipRow
                    options={doseOptions}
                    value={doseChoice}
                    onChange={(value) => setDoseChoice(value as Choice)}
                    formatLabel={(value) =>
                      value === "other" ? "Other" : `${value} mcg`
                    }
                  />
                  {doseChoice === "other" ? (
                    <NumberField
                      label="Custom dose (mcg)"
                      value={doseOther}
                      onChange={setDoseOther}
                    />
                  ) : null}
                </SoftPanel>

                <SoftPanel title="Optional IU conversion">
                  <label className="grid gap-1 text-xs font-semibold text-slate-600">
                    mcg per IU
                    <input
                      type="number"
                      min="0"
                      step="0.001"
                      value={mcgPerIu}
                      onChange={(event) => setMcgPerIu(Number(event.target.value))}
                      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                  </label>
                </SoftPanel>
              </div>
            </div>

            <aside className="min-w-0 rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Result</h2>
              <p className="mt-1 text-sm text-slate-600">
                How far to draw on a U-100 syringe.
              </p>

              <div className="mt-4 rounded-3xl bg-[#f4f5f7] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Draw to
                </div>
                <div className="mt-2 font-mono text-4xl font-semibold">
                  {formatNumber(result?.syringeUnits, 2)} units
                </div>
              </div>

              <DoseSyringeGuide
                units={result?.syringeUnits ?? 0}
                capacityUnits={syringeCapacity}
                doseMcg={doseMcg}
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
                  label="Dose conversion"
                  value={`${formatNumber(doseAsMg, 4)} mg${
                    doseAsIu ? ` / ${formatNumber(doseAsIu, 3)} IU` : ""
                  }`}
                />
                <MetricRow
                  label="mcg per unit"
                  value={`${formatNumber(result?.mcgPerSyringeUnit, 3)} mcg`}
                />
              </div>

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
                  Calculation ready. Verify with your prescription instructions.
                </Notice>
              ) : null}
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
          ? "bg-slate-900 text-white"
          : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
      }`}
    >
      {icon}
    </a>
  );
}

function SoftPanel({
  title,
  visual,
  children,
}: {
  title: string;
  visual?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-[#f4f5f7] p-4">
      <div
        className={
          visual
            ? "grid grid-cols-[48px_minmax(0,1fr)] items-center gap-3 sm:grid-cols-[64px_minmax(0,1fr)] sm:gap-4"
            : ""
        }
      >
        {visual ? (
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 sm:h-14 sm:w-14">
            {visual}
          </div>
        ) : null}
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
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
                ? "border-sky-400 bg-white shadow-sm"
                : "border-white bg-white/70 hover:border-slate-200 hover:bg-white"
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
  const fillWidth = 30 + capacityMl * 20;

  return (
    <svg
      viewBox="0 0 220 44"
      role="img"
      aria-label={`${capacityMl.toFixed(1)} mL syringe`}
      className="h-11 w-full min-w-0"
    >
      <line x1="5" x2="35" y1="22" y2="22" stroke="#64748b" strokeWidth="2" />
      <rect x="35" y="13" width="128" height="18" rx="5" fill="#ffffff" />
      <rect
        x="35"
        y="13"
        width={fillWidth}
        height="18"
        rx="5"
        fill={selected ? "#38bdf8" : "#cbd5e1"}
        opacity={selected ? "0.95" : "0.55"}
      />
      <rect
        x="35"
        y="13"
        width="128"
        height="18"
        rx="5"
        fill="none"
        stroke="#0f172a"
        strokeWidth="2"
      />
      {Array.from({ length: 9 }, (_, index) => {
        const x = 48 + index * 12;
        return (
          <line
            key={x}
            x1={x}
            x2={x}
            y1="14"
            y2={index % 2 === 0 ? 28 : 23}
            stroke="#0f172a"
            strokeWidth="1.5"
          />
        );
      })}
      <rect x="163" y="17" width="34" height="10" rx="5" fill="#fb923c" />
      <circle cx="202" cy="22" r="13" fill="#fb923c" />
      <rect x="156" y="9" width="7" height="26" rx="3.5" fill="#e2e8f0" />
    </svg>
  );
}

function DoseSyringeGuide({
  units,
  capacityUnits,
  doseMcg,
  tooLarge,
}: {
  units: number;
  capacityUnits: number;
  doseMcg: number;
  tooLarge: boolean;
}) {
  const safeCapacity = Math.max(capacityUnits, 1);
  const safeUnits = Number.isFinite(units) ? Math.max(units, 0) : 0;
  const cappedUnits = Math.min(safeUnits, safeCapacity);
  const barrelX = 78;
  const barrelY = 58;
  const barrelWidth = 402;
  const barrelHeight = 78;
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
            Syringe guide
          </h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            For {formatNumber(doseMcg, 0)} mcg, draw to{" "}
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
          <line
            x1="20"
            x2={barrelX}
            y1="97"
            y2="97"
            stroke="#0f172a"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect x="48" y="79" width="30" height="36" rx="4" fill="#0f172a" />
          <rect
            x={barrelX}
            y={barrelY}
            width={barrelWidth}
            height={barrelHeight}
            rx="8"
            fill="#ffffff"
          />
          <rect
            x={barrelX}
            y={barrelY}
            width={fillWidth}
            height={barrelHeight}
            rx="8"
            fill={tooLarge ? "#f59e0b" : "#0ea5e9"}
            opacity="0.9"
          />
          <rect
            x={barrelX}
            y={barrelY}
            width={barrelWidth}
            height={barrelHeight}
            rx="8"
            fill="none"
            stroke="#0f172a"
            strokeWidth="8"
          />
          {minorTicks.map((tick) => {
            const x = barrelX + (tick / safeCapacity) * barrelWidth;
            const isMajor = tick % majorStep === 0;
            return (
              <line
                key={`minor-${tick}`}
                x1={x}
                x2={x}
                y1="64"
                y2={isMajor ? 111 : 88}
                stroke="#334155"
                strokeWidth={isMajor ? "2.8" : "1.8"}
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
                  y="129"
                  textAnchor="middle"
                  className="fill-slate-700 text-[16px] font-semibold"
                >
                  {tick}
                </text>
              );
            })}
          <line
            x1={markerX}
            x2={markerX}
            y1="50"
            y2="144"
            stroke={tooLarge ? "#92400e" : "#0369a1"}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <rect
            x={barrelX + barrelWidth}
            y="76"
            width="42"
            height="42"
            rx="8"
            fill="#0f172a"
          />
          <rect x="520" y="70" width="8" height="54" rx="4" fill="#0f172a" />
          <ellipse cx="535" cy="97" rx="18" ry="46" fill="#0f172a" />
        </svg>
      </div>
    </section>
  );
}

function VialIllustration({ tone }: { tone: "amber" | "sky" }) {
  const liquid = tone === "amber" ? "#f59e0b" : "#38bdf8";

  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Peptide vial" className="h-10 w-10">
      <rect x="17" y="5" width="14" height="8" rx="3" fill="#475569" />
      <rect x="14" y="12" width="20" height="30" rx="6" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
      <path d="M15 28h18v8a6 6 0 0 1-6 6h-6a6 6 0 0 1-6-6z" fill={liquid} opacity="0.8" />
      <rect x="17" y="19" width="14" height="8" rx="2" fill="#e2e8f0" />
      <circle cx="24" cy="23" r="2.5" fill="#0ea5e9" />
    </svg>
  );
}

function WaterIllustration() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Water vial" className="h-10 w-10">
      <path d="M24 5c6 8 12 15 12 24a12 12 0 0 1-24 0c0-9 6-16 12-24z" fill="#bae6fd" stroke="#0f172a" strokeWidth="2" />
      <path d="M17 31c3 4 10 5 14 0" fill="none" stroke="#0ea5e9" strokeLinecap="round" strokeWidth="2" />
      <circle cx="18" cy="25" r="2" fill="#ffffff" opacity="0.8" />
    </svg>
  );
}

function DoseIllustration() {
  return (
    <svg viewBox="0 0 48 48" role="img" aria-label="Dose target" className="h-10 w-10">
      <circle cx="24" cy="24" r="17" fill="#fef3c7" stroke="#0f172a" strokeWidth="2" />
      <circle cx="24" cy="24" r="10" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
      <circle cx="24" cy="24" r="4" fill="#0ea5e9" />
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
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-xl px-1 py-1 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-mono text-slate-900">{value}</span>
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
