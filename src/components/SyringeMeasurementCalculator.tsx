"use client";

import { useMemo, useState } from "react";
import { Calculator, CheckCircle2 } from "lucide-react";
import { formatNumber } from "@/lib/calculations";

const syringeSizes = [0.3, 0.5, 1];

export function SyringeMeasurementCalculator() {
  const [syringeMl, setSyringeMl] = useState(1);
  const [totalAmountMcg, setTotalAmountMcg] = useState(5000);
  const [liquidVolumeMl, setLiquidVolumeMl] = useState(2);
  const [targetAmountMcg, setTargetAmountMcg] = useState(250);

  const result = useMemo(() => {
    if (totalAmountMcg <= 0 || liquidVolumeMl <= 0 || targetAmountMcg <= 0) {
      return null;
    }

    const concentration = totalAmountMcg / liquidVolumeMl;
    const measureMl = targetAmountMcg / concentration;
    const u100Mark = measureMl * 100;
    const syringeCapacityMarks = syringeMl * 100;

    return {
      concentration,
      measureMl,
      u100Mark,
      syringeCapacityMarks,
      fits: u100Mark <= syringeCapacityMarks,
    };
  }, [liquidVolumeMl, syringeMl, targetAmountMcg, totalAmountMcg]);

  return (
    <section className="rounded-[30px] border border-sky-100 bg-white/95 p-5 shadow-[0_24px_80px_rgba(14,165,233,0.1)] sm:p-6">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="grid gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sky-800">
              Free calculator
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Enter the label values
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Use the amount on the label, the total liquid volume, and the
              target amount you already have. The calculator converts those
              values into mL and a U-100 syringe mark.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {syringeSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSyringeMl(size)}
                className={`rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  syringeMl === size
                    ? "bg-slate-950 text-white"
                    : "bg-sky-50 text-slate-700 ring-1 ring-sky-100 hover:bg-sky-100"
                }`}
              >
                {size.toFixed(1)} mL syringe
              </button>
            ))}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <NumberInput
              label="Total amount"
              suffix="mcg"
              value={totalAmountMcg}
              onChange={setTotalAmountMcg}
            />
            <NumberInput
              label="Liquid volume"
              suffix="mL"
              value={liquidVolumeMl}
              onChange={setLiquidVolumeMl}
            />
            <NumberInput
              label="Target amount"
              suffix="mcg"
              value={targetAmountMcg}
              onChange={setTargetAmountMcg}
            />
          </div>
        </div>

        <aside className="rounded-[26px] bg-[linear-gradient(135deg,#eef9ff_0%,#fff7ed_100%)] p-4 ring-1 ring-sky-100">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
            <Calculator size={18} aria-hidden="true" />
            Result
          </div>
          <div className="mt-4 rounded-3xl bg-white p-4 ring-1 ring-sky-100">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Measure to
            </p>
            <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-950">
              {result ? formatOrdinalMark(result.u100Mark) : "-"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {result
                ? `${formatNumber(result.measureMl, 4)} mL on a U-100 syringe scale.`
                : "Enter values above to calculate the syringe mark."}
            </p>
          </div>

          <div className="mt-3 grid gap-2">
            <Metric
              label="Strength"
              value={
                result
                  ? `${formatNumber(result.concentration, 2)} mcg/mL`
                  : "-"
              }
            />
            <Metric
              label="Syringe capacity"
              value={`${formatNumber(syringeMl * 100, 0)} marks`}
            />
            <Metric
              label="Fit check"
              value={
                result
                  ? result.fits
                    ? "Fits selected syringe"
                    : "Use a larger syringe"
                  : "-"
              }
            />
          </div>
        </aside>
      </div>

      <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-950">
        <div className="flex gap-2">
          <CheckCircle2 className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
          <p>
            Measurement support only. Confirm product-specific instructions,
            storage, and preparation requirements with the label or a qualified
            professional before using any calculated value.
          </p>
        </div>
      </div>
    </section>
  );
}

function NumberInput({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-slate-700">
      {label}
      <span className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 shadow-sm focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-100">
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-w-0 flex-1 bg-transparent text-base font-semibold text-slate-950 outline-none"
        />
        <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
          {suffix}
        </span>
      </span>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white/85 px-3 py-2 ring-1 ring-sky-100">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function formatOrdinalMark(value: number) {
  if (!Number.isFinite(value)) {
    return "-";
  }

  const rounded = Math.round(value);
  const abs = Math.abs(rounded);
  const suffix =
    abs % 100 >= 11 && abs % 100 <= 13
      ? "TH"
      : abs % 10 === 1
        ? "ST"
        : abs % 10 === 2
          ? "ND"
          : abs % 10 === 3
            ? "RD"
            : "TH";

  return `${rounded}${suffix} mark`;
}
