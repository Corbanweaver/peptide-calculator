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
    <main className="min-h-screen bg-[#f2f3f5] text-slate-900">
      <div className="mx-auto flex max-w-[1440px]">
        <aside className="hidden min-h-screen w-[86px] shrink-0 border-r border-slate-200 bg-[#f7f7f7] py-5 md:flex md:flex-col md:items-center md:gap-3">
          <IconTab icon={<FlaskConical size={20} />} href="#home" active />
          <IconTab icon={<Home size={20} />} href="#home" />
          <IconTab icon={<Calculator size={20} />} href="#calculator" />
          <IconTab icon={<User size={20} />} href="/account" />
          <IconTab icon={<FileText size={20} />} href="/disclaimer" />
        </aside>

        <div className="w-full px-4 pb-10 pt-4 sm:px-6">
          <header id="home" className="flex items-center gap-3">
            <div className="flex h-12 flex-1 items-center gap-3 rounded-full bg-[#e7e7e5] px-4">
              <Search size={18} className="text-slate-500" aria-hidden="true" />
              <input
                value=""
                readOnly
                placeholder="Search"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
              />
            </div>
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200"
              aria-label="Account"
            >
              <UserCircle2 size={22} aria-hidden="true" />
            </button>
          </header>

          <section
            id="calculator"
            className="mt-5 grid gap-5 lg:grid-cols-[1fr_360px]"
          >
            <div className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
              <h1 className="text-3xl font-semibold sm:text-4xl">
                Peptide Calculator
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Enter your vial amount, water amount, and dose target. The app
                calculates how many U-100 units to draw.
              </p>

              <div className="mt-6 grid gap-4">
                <SoftPanel title="1) Syringe size">
                  <ChipRow
                    options={syringeOptions}
                    value={syringeMl}
                    onChange={(value) => setSyringeMl(value as number)}
                    formatLabel={(value) => `${Number(value).toFixed(1)} mL`}
                  />
                </SoftPanel>

                <SoftPanel title="2) Vial quantity">
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

                <SoftPanel title="3) Bacteriostatic water">
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

                <SoftPanel title="4) Target dose">
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

            <aside className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
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
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-[#f4f5f7] p-4">
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
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
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option === value;
        return (
          <button
            type="button"
            key={String(option)}
            onClick={() => onChange(option)}
            className={`h-9 rounded-full px-3 text-sm transition ${
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
    <div className="grid grid-cols-[1fr_auto] gap-3 rounded-xl px-1 py-1 text-sm">
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
