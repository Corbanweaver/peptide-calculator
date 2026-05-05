"use client";

import { type ReactNode, useMemo, useState } from "react";
import {
  Calculator,
  CheckCircle2,
  FileText,
  FlaskConical,
  Plus,
  UserCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { calculateDose, formatNumber } from "@/lib/calculations";

type Choice = number | "other";
type DoseInputUnit = "mcg" | "iu";
type PresetType = "reference" | "math";
type SplitPart = {
  name: string;
  percent: string;
};

type SplitBreakdownItem = {
  name: string;
  inputPercent: number;
  normalizedPercent: number;
  doseMcg: number;
  doseMg: number;
  doseIu: number;
  mcgPerSyringeUnit: number;
};

const syringeOptions = [0.3, 0.5, 1.0];
const vialOptions: Choice[] = [5, 10, 15, 20, "other"];
const waterOptions: Choice[] = [1, 2, 3, 5, "other"];
const doseOptionsByUnit: Record<DoseInputUnit, Choice[]> = {
  mcg: [50, 100, 250, 500, 1000, "other"],
  iu: [1, 2, 5, 10, 20, "other"],
};
const commonSplitCompounds = [
  "CJC-1295",
  "Ipamorelin",
  "Sermorelin",
  "Tesamorelin",
  "GHRP-2",
  "GHRP-6",
  "BPC-157",
  "TB-500",
  "GHK-Cu",
  "NAD+",
  "Glutathione",
  "L-carnitine",
  "MIC / B12",
];

export function PeptideCalculator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isCalculatorRoute = pathname === "/" || pathname === "/calculator";
  const initialPreset = useMemo(
    () => readPresetFromSearchParams(searchParams),
    [searchParams],
  );
  const [syringeMl, setSyringeMl] = useState(initialPreset.syringeMl);
  const [loadedPresetName] = useState(initialPreset.compoundName);
  const [loadedPresetDetail] = useState(initialPreset.presetDetail);
  const [loadedPresetType] = useState(initialPreset.presetType);

  const [vialChoice, setVialChoice] = useState<Choice>(
    initialPreset.vial.choice,
  );
  const [vialOther, setVialOther] = useState<number>(initialPreset.vial.other);

  const [waterChoice, setWaterChoice] = useState<Choice>(
    initialPreset.water.choice,
  );
  const [waterOther, setWaterOther] = useState<number>(initialPreset.water.other);

  const [doseChoice, setDoseChoice] = useState<Choice>(
    initialPreset.dose.choice,
  );
  const [doseOther, setDoseOther] = useState<number>(initialPreset.dose.other);
  const [doseInputUnit, setDoseInputUnit] = useState<DoseInputUnit>(
    initialPreset.doseInputUnit,
  );
  const [advancedSplitEnabled, setAdvancedSplitEnabled] = useState(
    initialPreset.split.enabled,
  );
  const [splitParts, setSplitParts] = useState<SplitPart[]>(
    initialPreset.split.parts,
  );

  const vialMg = Number(vialChoice === "other" ? vialOther : vialChoice);
  const waterMl = Number(waterChoice === "other" ? waterOther : waterChoice);
  const doseInputAmount = Number(doseChoice === "other" ? doseOther : doseChoice);
  const isIuMode = doseInputUnit === "iu";
  const concentrationMcgMl =
    vialMg > 0 && waterMl > 0 ? (vialMg * 1000) / waterMl : 0;
  const doseMcg = isIuMode
    ? doseInputAmount * (concentrationMcgMl / 100)
    : doseInputAmount;
  const doseLabel = isIuMode
    ? `${formatNumber(doseInputAmount, 2)} IU`
    : `${formatNumber(doseInputAmount, 0)} mcg`;
  const doseModeCopy = isIuMode
    ? "IU mode uses U-100 syringe marks: 1 IU = 1 mark = 0.01 mL."
    : "MCG mode uses the amount of compound in the dose.";
  const vialStepTitle = isIuMode
    ? "Total MG's in your vial for IU math"
    : "Total MG's in your vial";
  const doseStepTitle = isIuMode
    ? "What IU / mark are you taking?"
    : "What dose are you taking?";
  const doseOptionUnitLabel = isIuMode ? "IU" : "mcg";
  const doseOptions = doseOptionsByUnit[doseInputUnit];

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

  function handleDoseInputUnitChange(unit: DoseInputUnit) {
    if (unit === doseInputUnit) {
      return;
    }

    const convertedDoseAmount =
      unit === "iu" ? result?.syringeUnits : result?.doseMcg;
    const nextDose = resolveNumericChoice(
      convertedDoseAmount ?? (unit === "iu" ? 5 : 250),
      doseOptionsByUnit[unit],
      unit === "iu" ? 5 : 250,
    );

    setDoseInputUnit(unit);
    setDoseChoice(nextDose.choice);
    setDoseOther(nextDose.other);
  }

  const syringeCapacity = syringeMl * 100;
  const tooLargeForSyringe = Boolean(
    result && result.syringeUnits > syringeCapacity,
  );
  const hasReadyCalculation = Boolean(result && !tooLargeForSyringe);
  const doseAsMg = result ? result.doseMcg / 1000 : null;
  const syringeMarkLabel = formatSyringeMark(result?.syringeUnits);
  const doseDisplayValue = result
    ? isIuMode
      ? `${formatNumber(result.syringeUnits, 2)} IU (${syringeMarkLabel})`
      : `${formatNumber(result.doseMcg, 2)} mcg (${formatNumber(doseAsMg, 4)} mg)`
    : "-";
  const doseDisplayDescription = isIuMode
    ? `Based on the vial strength, that equals ${formatNumber(result?.doseMcg, 2)} mcg (${formatNumber(doseAsMg, 4)} mg).`
    : "This is the target dose used for the syringe guide.";
  const concentrationDisplayValue = isIuMode
    ? "100 IU per mL"
    : `${formatNumber(result?.concentrationMcgMl)} mcg per mL`;
  const concentrationDisplayDescription = isIuMode
    ? "On a U-100 syringe, each 1 mL contains 100 IU/marks."
    : "This is how much compound is in each mL after mixing.";
  const concentrationDisplayLabel = isIuMode
    ? "U-100 syringe scale"
    : "Strength in the vial";
  const markDisplayValue = isIuMode
    ? "1 IU per mark"
    : `${formatNumber(result?.mcgPerSyringeUnit, 3)} mcg`;
  const markDisplayDescription = isIuMode
    ? `Each IU/mark equals ${formatNumber(result?.mcgPerSyringeUnit, 3)} mcg with this vial setup.`
    : "This helps explain what each U-100 mark represents.";
  const liquidDisplayLabel = isIuMode
    ? "IU / mark draw"
    : "Amount of liquid to draw";
  const liquidDisplayValue = result
    ? isIuMode
      ? `${formatNumber(result.syringeUnits, 2)} IU (${formatNumber(result.doseMl, 4)} mL)`
      : `${formatNumber(result.doseMl, 4)} mL`
    : "-";
  const liquidDisplayDescription = isIuMode
    ? "On a U-100 syringe, IU and syringe marks match one-for-one."
    : "This is the liquid volume for one dose.";
  const drawTargetLabel = result
    ? isIuMode
      ? `${formatNumber(result.syringeUnits, 2)} IU`
      : syringeMarkLabel
    : syringeMarkLabel;
  const splitTotalPercent = useMemo(
    () => splitParts.reduce((total, part) => total + parseSplitPercent(part.percent), 0),
    [splitParts],
  );
  const splitBreakdown = useMemo(
    () =>
      advancedSplitEnabled && result
        ? buildSplitBreakdown(
            splitParts,
            result.doseMcg,
            result.syringeUnits,
            result.mcgPerSyringeUnit,
          )
        : [],
    [advancedSplitEnabled, result, splitParts],
  );

  function updateSplitPart(index: number, nextPart: Partial<SplitPart>) {
    setSplitParts((currentParts) =>
      currentParts.map((part, currentIndex) =>
        currentIndex === index ? { ...part, ...nextPart } : part,
      ),
    );
  }

  function applySplitTemplate(parts: SplitPart[]) {
    setAdvancedSplitEnabled(true);
    setSplitParts(parts);
  }

  function addSplitPart() {
    setAdvancedSplitEnabled(true);
    setSplitParts((currentParts) => {
      if (currentParts.length >= 6) {
        return currentParts;
      }

      return createSplitParts(
        currentParts.length + 1,
        currentParts
          .map((part) => part.name)
          .concat(`Compound ${currentParts.length + 1}`),
      );
    });
  }

  function removeSplitPart(index: number) {
    setSplitParts((currentParts) => {
      if (currentParts.length <= 2) {
        return currentParts;
      }

      const remainingNames = currentParts
        .filter((_, currentIndex) => currentIndex !== index)
        .map((part) => part.name);

      return createSplitParts(remainingNames.length, remainingNames);
    });
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(135deg,#9ed6e7_0%,#86c6dc_36%,#abc9dc_62%,#d6bfaa_100%)] text-slate-900">
      <div className="mx-auto flex min-w-0 max-w-[1440px]">
        <aside className="hidden min-h-screen w-[86px] shrink-0 border-r border-sky-100 bg-white/72 py-5 shadow-[12px_0_45px_rgba(14,165,233,0.09)] backdrop-blur md:flex md:flex-col md:items-center md:gap-3">
          <IconTab
            icon={<FlaskConical size={20} />}
            href="/peptides"
            label="Peptide library"
            active={pathname === "/peptides"}
          />
          <IconTab
            icon={<Calculator size={20} />}
            href="/calculator"
            label="Calculator"
            active={isCalculatorRoute}
          />
          <IconTab
            icon={<FileText size={20} />}
            href="/disclaimer"
            label="Disclaimer"
            active={pathname === "/disclaimer"}
          />
        </aside>

        <div className="min-w-0 w-full px-4 pb-10 pt-4 sm:px-6">
          <header id="home" className="flex items-center justify-end">
            <a
              href="/account"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#ffffff_0%,#e0f2fe_58%,#fff7ed_100%)] text-slate-800 shadow-[0_12px_35px_rgba(14,165,233,0.12)] ring-1 ring-sky-100 transition hover:-translate-y-0.5 hover:shadow-[0_16px_45px_rgba(14,165,233,0.18)]"
              aria-label="Account"
            >
              <UserCircle2 size={22} aria-hidden="true" />
            </a>
          </header>

          <MobileTopNav
            pathname={pathname}
            isCalculatorRoute={isCalculatorRoute}
          />

          <section
            id="calculator"
            className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]"
          >
            <div className="relative min-w-0 overflow-hidden rounded-[28px] border border-sky-100 bg-white/95 p-5 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-6">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-[linear-gradient(135deg,rgba(14,165,233,0.15)_0%,rgba(236,72,153,0.08)_48%,rgba(251,146,60,0.1)_72%,rgba(255,255,255,0)_100%)]"
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

                <div className="grid gap-2 xl:max-w-[300px]">
                  <DoseUnitSelector
                    value={doseInputUnit}
                    onChange={handleDoseInputUnitChange}
                  />
                  <p className="text-xs leading-5 text-slate-600">
                    {doseModeCopy}
                  </p>
                </div>
              </div>

              {loadedPresetName ? (
                <div className="preset-loaded-banner mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/90 p-3 text-sm leading-6 text-emerald-950 shadow-[0_18px_55px_rgba(16,185,129,0.16)]">
                  <span className="font-semibold">
                    {loadedPresetType === "math"
                      ? "Math template loaded:"
                      : "Reference preset loaded:"}
                  </span>{" "}
                  {loadedPresetName}
                  {loadedPresetDetail ? ` - ${loadedPresetDetail}` : ""}.{" "}
                  {loadedPresetType === "math"
                    ? "This is editable calculator math only, not a recommended dose or protocol."
                    : "Vial amount, water amount, and dose are still editable. Verify with the product label or prescriber before use."}
                </div>
              ) : null}

              <div className="mt-6 grid gap-4">
                <SoftPanel
                  id="syringe-size"
                  step={1}
                  title="What syringe size do you have?"
                >
                  <SyringeSizePicker
                    options={syringeOptions}
                    value={syringeMl}
                    onChange={setSyringeMl}
                  />
                </SoftPanel>

                <SoftPanel
                  id="vial-total"
                  step={2}
                  title={vialStepTitle}
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
                  step={3}
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
                  step={4}
                  title={doseStepTitle}
                  visual={<DoseIllustration unit={doseInputUnit} />}
                >
                  <ChipRow
                    options={doseOptions}
                    value={doseChoice}
                    onChange={(value) => setDoseChoice(value as Choice)}
                    formatLabel={(value) =>
                      value === "other"
                        ? "Other"
                        : `${value} ${doseOptionUnitLabel}`
                    }
                  />
                  {doseChoice === "other" ? (
                    <NumberField
                      label={`Custom dose (${doseOptionUnitLabel})`}
                      value={doseOther}
                      onChange={setDoseOther}
                    />
                  ) : null}
                </SoftPanel>

                <AdvancedSplitPanel
                  enabled={advancedSplitEnabled}
                  parts={splitParts}
                  totalPercent={splitTotalPercent}
                  baseCompoundName={loadedPresetName}
                  onToggle={setAdvancedSplitEnabled}
                  onPartChange={updateSplitPart}
                  onAddPart={addSplitPart}
                  onRemovePart={removeSplitPart}
                  onApplyTemplate={applySplitTemplate}
                />
              </div>
              </div>
            </div>

            <aside
              id="what-to-do"
              className={`min-w-0 rounded-[28px] border bg-white/95 p-5 ring-1 ring-white/70 sm:p-6 ${
                hasReadyCalculation
                  ? "calculation-ready-panel border-cyan-200 shadow-[0_28px_95px_rgba(14,165,233,0.24)]"
                  : "border-sky-100 shadow-[0_24px_80px_rgba(14,165,233,0.09)]"
              }`}
            >
              <h2 className="text-lg font-semibold">What to do</h2>
              <p className="mt-1 text-sm text-slate-600">
                Follow the blue marker on the syringe guide.
              </p>

              {tooLargeForSyringe ? (
                <Notice tone="warning">
                  This dose is larger than your selected syringe capacity of{" "}
                  {formatNumber(syringeCapacity, 0)} marks.
                </Notice>
              ) : null}

              {result?.warnings.map((warning) => (
                <Notice key={warning} tone="warning">
                  {warning}
                </Notice>
              ))}

              {result && !tooLargeForSyringe ? (
                <Notice tone="ok">
                  Ready!
                </Notice>
              ) : null}

              <div className="mt-4 rounded-3xl bg-[#f4f5f7] p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Pull syringe to
                </div>
                <div className="mt-2 font-mono text-4xl font-semibold">
                  {drawTargetLabel}
                </div>
                {isIuMode && result ? (
                  <div className="mt-1 text-sm font-semibold text-slate-500">
                    Same as {syringeMarkLabel}
                  </div>
                ) : null}
              </div>

              <DoseSyringeGuide
                units={result?.syringeUnits ?? 0}
                capacityUnits={syringeCapacity}
                doseLabel={doseLabel}
                markLabel={syringeMarkLabel}
                tooLarge={tooLargeForSyringe}
              />

              <div className="mt-5 text-sm font-semibold text-slate-950">
                Dosage breakdown
              </div>
              <div className="mt-2 grid gap-2 rounded-2xl border border-slate-200 bg-white p-3">
                <MetricRow
                  label={liquidDisplayLabel}
                  value={liquidDisplayValue}
                  description={liquidDisplayDescription}
                />
                <MetricRow
                  label={concentrationDisplayLabel}
                  value={concentrationDisplayValue}
                  description={concentrationDisplayDescription}
                />
                <MetricRow
                  label="Dose you entered"
                  value={doseDisplayValue}
                  description={doseDisplayDescription}
                />
                <MetricRow
                  label={isIuMode ? "Each IU / mark equals" : "Each syringe mark equals"}
                  value={markDisplayValue}
                  description={markDisplayDescription}
                />
                <CompoundSplitBreakdown
                  items={splitBreakdown}
                  totalPercent={splitTotalPercent}
                  displayMode={doseInputUnit}
                />
              </div>
            </aside>
          </section>
        </div>
      </div>
    </main>
  );
}

function MobileTopNav({
  pathname,
  isCalculatorRoute,
}: {
  pathname: string;
  isCalculatorRoute: boolean;
}) {
  return (
    <nav
      aria-label="Primary mobile navigation"
      className="sticky top-2 z-20 mt-3 grid grid-cols-3 gap-2 rounded-[24px] border border-sky-100 bg-white/85 p-2 shadow-[0_16px_45px_rgba(14,165,233,0.12)] backdrop-blur md:hidden"
    >
      <IconTab
        icon={<FlaskConical size={20} />}
        href="/peptides"
        label="Peptide library"
        active={pathname === "/peptides"}
      />
      <IconTab
        icon={<Calculator size={20} />}
        href="/calculator"
        label="Calculator"
        active={isCalculatorRoute}
      />
      <IconTab
        icon={<FileText size={20} />}
        href="/disclaimer"
        label="Disclaimer"
        active={pathname === "/disclaimer"}
      />
    </nav>
  );
}

function IconTab({
  icon,
  href,
  label,
  active = false,
}: {
  icon: ReactNode;
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      className={`mx-auto grid h-12 w-12 place-items-center rounded-2xl transition ${
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

function AdvancedSplitPanel({
  enabled,
  parts,
  totalPercent,
  baseCompoundName,
  onToggle,
  onPartChange,
  onAddPart,
  onRemovePart,
  onApplyTemplate,
}: {
  enabled: boolean;
  parts: SplitPart[];
  totalPercent: number;
  baseCompoundName: string;
  onToggle: (enabled: boolean) => void;
  onPartChange: (index: number, nextPart: Partial<SplitPart>) => void;
  onAddPart: () => void;
  onRemovePart: (index: number) => void;
  onApplyTemplate: (parts: SplitPart[]) => void;
}) {
  return (
    <section className="rounded-2xl border border-sky-100 bg-[linear-gradient(145deg,#ffffff_0%,#f3fbff_58%,#fff7ed_100%)] p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-900">
            Advanced
          </p>
          <h3 className="mt-1 text-base font-semibold text-slate-900">
            Split the dose between compounds
          </h3>
          <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
            Use this for mixed vials. Pick or type each compound, set its
            percentage, and the breakdown will show each compound amount.
          </p>
        </div>

        <button
          type="button"
          aria-pressed={enabled}
          onClick={() => onToggle(!enabled)}
          className={`flex h-10 w-28 shrink-0 items-center rounded-full px-1 text-sm font-semibold transition ${
            enabled ? "bg-sky-100 text-sky-950" : "bg-slate-100 text-slate-500"
          }`}
        >
          <span
            className={`grid h-8 w-14 place-items-center rounded-full transition ${
              enabled
                ? "translate-x-12 bg-[linear-gradient(135deg,#0f172a_0%,#075985_100%)] text-white sm:translate-x-12"
                : "translate-x-0 bg-white text-slate-600"
            }`}
          >
            {enabled ? "On" : "Off"}
          </span>
        </button>
      </div>

      {enabled ? (
        <div className="mt-4 grid gap-3">
          <datalist id="compound-split-options">
            {commonSplitCompounds.map((compound) => (
              <option key={compound} value={compound} />
            ))}
          </datalist>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap gap-2">
              <SplitTemplateButton
                label="2-way equal"
                onClick={() =>
                  onApplyTemplate(
                    createSplitParts(2, [
                      baseCompoundName || "Compound 1",
                      "Compound 2",
                    ]),
                  )
                }
              />
              <SplitTemplateButton
                label="3-way equal"
                onClick={() => onApplyTemplate(createSplitParts(3))}
              />
              <SplitTemplateButton
                label="4-way equal"
                onClick={() => onApplyTemplate(createSplitParts(4))}
              />
            </div>

            <button
              type="button"
              onClick={onAddPart}
              disabled={parts.length >= 6}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#0f172a_0%,#075985_100%)] px-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
            >
              <Plus size={15} aria-hidden="true" />
              Add Compound Split
            </button>
          </div>

          <div className="grid gap-2">
            {parts.map((part, index) => (
              <div
                key={`split-${index}`}
                className="grid min-w-0 gap-2 rounded-2xl bg-white/85 p-3 ring-1 ring-sky-100 sm:grid-cols-[minmax(0,1fr)_96px_auto]"
              >
                <label className="grid min-w-0 gap-1 text-xs font-semibold text-slate-500">
                  Compound {index + 1}
                  <input
                    list="compound-split-options"
                    value={part.name}
                    placeholder="Search or type compound"
                    onChange={(event) =>
                      onPartChange(index, { name: event.target.value })
                    }
                    className="h-10 w-full min-w-0 max-w-full truncate rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </label>

                <label className="grid min-w-0 gap-1 text-xs font-semibold text-slate-500">
                  Split %
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={part.percent}
                    onChange={(event) =>
                      onPartChange(index, { percent: event.target.value })
                    }
                    className="h-10 w-full max-w-full rounded-xl border border-slate-200 bg-white px-2 text-center text-sm font-semibold tabular-nums text-slate-900 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                  />
                </label>

                {parts.length > 2 ? (
                  <button
                    type="button"
                    onClick={() => onRemovePart(index)}
                    aria-label={`Remove compound ${index + 1}`}
                    className="grid h-10 w-10 place-items-center self-end rounded-xl bg-white text-slate-500 ring-1 ring-slate-200 transition hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-100"
                  >
                    <X size={16} aria-hidden="true" />
                  </button>
                ) : (
                  <span className="hidden sm:block" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>

          <p className="rounded-2xl bg-sky-50 px-3 py-2 text-xs leading-5 text-sky-950 ring-1 ring-sky-100">
            Entered split: {formatNumber(totalPercent, 2)}%.{" "}
            {Math.abs(totalPercent - 100) > 0.01
              ? "The breakdown normalizes these percentages so the full dose still equals 100%."
              : "The split adds up to 100%."}
          </p>
        </div>
      ) : null}
    </section>
  );
}

function SplitTemplateButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-9 rounded-full bg-white px-3 text-sm font-semibold text-slate-700 ring-1 ring-sky-100 transition hover:bg-sky-50"
    >
      {label}
    </button>
  );
}

function SoftPanel({
  id,
  step,
  title,
  visual,
  children,
}: {
  id?: string;
  step: number;
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
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[linear-gradient(135deg,#0f172a_0%,#075985_100%)] px-3 py-1 text-xs font-semibold text-white shadow-sm">
              Step {step}
            </span>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          </div>
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

function createSplitParts(count: number, names: string[] = []) {
  const safeCount = Math.min(Math.max(Math.round(count), 2), 6);
  const basePercent = Math.floor(100 / safeCount);
  const extraPercentCount = 100 - basePercent * safeCount;

  return Array.from({ length: safeCount }, (_, index) => ({
    name: names[index] || `Compound ${index + 1}`,
    percent: String(
      basePercent + (index >= safeCount - extraPercentCount ? 1 : 0),
    ),
  }));
}

function parseSplitPercent(value: string) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : 0;
}

function buildSplitBreakdown(
  parts: SplitPart[],
  totalDoseMcg: number,
  totalDoseIu: number,
  totalMcgPerSyringeUnit: number,
) {
  const safeParts = parts.filter((part) => parseSplitPercent(part.percent) > 0);
  const totalPercent = safeParts.reduce(
    (total, part) => total + parseSplitPercent(part.percent),
    0,
  );

  if (!totalPercent || !Number.isFinite(totalDoseMcg)) {
    return [];
  }

  return safeParts.map((part, index) => {
    const inputPercent = parseSplitPercent(part.percent);
    const normalizedPercent = (inputPercent / totalPercent) * 100;
    const doseMcg = totalDoseMcg * (normalizedPercent / 100);
    const doseIu = totalDoseIu * (normalizedPercent / 100);

    return {
      name: part.name.trim() || `Compound ${index + 1}`,
      inputPercent,
      normalizedPercent,
      doseMcg,
      doseMg: doseMcg / 1000,
      doseIu,
      mcgPerSyringeUnit:
        totalMcgPerSyringeUnit * (normalizedPercent / 100),
    };
  });
}

function parsePositiveNumber(value: string | null) {
  if (!value) {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : null;
}

function findClosestChoice(value: number, options: number[]) {
  return options.reduce((closest, option) =>
    Math.abs(option - value) < Math.abs(closest - value) ? option : closest,
  );
}

function readPresetFromSearchParams(params: { get: (name: string) => string | null }) {
  const syringeParam = parsePositiveNumber(params.get("syringeMl"));
  const vialParam = parsePositiveNumber(params.get("vialMg"));
  const waterParam = parsePositiveNumber(params.get("waterMl"));
  const requestedDoseUnit = (params.get("doseUnit") ?? params.get("unit") ?? "")
    .toLowerCase()
    .trim();
  const doseInputUnit: DoseInputUnit =
    requestedDoseUnit === "iu" ? "iu" : "mcg";
  const doseParam = parsePositiveNumber(
    doseInputUnit === "iu" ? params.get("doseIu") : params.get("doseMcg"),
  );
  const defaultDose = doseInputUnit === "iu" ? 5 : 250;
  const compoundName = params.get("compound") ?? "";
  const presetType: PresetType =
    params.get("presetType") === "math" ? "math" : "reference";

  return {
    compoundName,
    presetDetail: params.get("preset") ?? "",
    presetType,
    syringeMl: syringeParam ? findClosestChoice(syringeParam, syringeOptions) : 1,
    vial: resolveNumericChoice(vialParam, vialOptions, 10),
    water: resolveNumericChoice(waterParam, waterOptions, 2),
    dose: resolveNumericChoice(
      doseParam,
      doseOptionsByUnit[doseInputUnit],
      defaultDose,
    ),
    doseInputUnit,
    split: readSplitFromSearchParams(params, compoundName),
  };
}

function readSplitFromSearchParams(
  params: { get: (name: string) => string | null },
  compoundName: string,
) {
  const splitParam = params.get("split");

  if (!splitParam) {
    return {
      enabled: false,
      parts: createSplitParts(2, [compoundName || "Compound 1", "Compound 2"]),
    };
  }

  const parsedParts = splitParam
    .split(",")
    .map((segment) => {
      const [rawName, rawPercent] = segment.split(":");
      return {
        name: (rawName ?? "").trim(),
        percent: String(parseSplitPercent(rawPercent ?? "")),
      };
    })
    .filter((part) => part.name && parseSplitPercent(part.percent) > 0)
    .slice(0, 4);

  return {
    enabled: parsedParts.length > 1,
    parts:
      parsedParts.length > 1
        ? parsedParts
        : createSplitParts(2, [compoundName || "Compound 1", "Compound 2"]),
  };
}

function resolveNumericChoice(
  value: number | null,
  options: Choice[],
  defaultValue: number,
): { choice: Choice; other: number } {
  if (!value) {
    return { choice: defaultValue as Choice, other: defaultValue };
  }

  const matchedOption = options.find(
    (option): option is number =>
      typeof option === "number" && Math.abs(option - value) < 0.0001,
  );

  if (matchedOption) {
    return { choice: matchedOption, other: matchedOption };
  }

  return { choice: "other" as Choice, other: value };
}

function formatSyringeMark(value?: number | null) {
  const safeValue = Number.isFinite(value) ? Number(value) : 0;
  const roundedValue = Math.round(safeValue);

  if (Math.abs(safeValue - roundedValue) < 0.005) {
    return `${formatNumber(roundedValue, 0)}${getOrdinalSuffix(roundedValue)} Mark`;
  }

  return `${formatNumber(safeValue, 2)} Mark`;
}

function getOrdinalSuffix(value: number) {
  const absoluteValue = Math.abs(value);
  const lastTwoDigits = absoluteValue % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return "TH";
  }

  switch (absoluteValue % 10) {
    case 1:
      return "ST";
    case 2:
      return "ND";
    case 3:
      return "RD";
    default:
      return "TH";
  }
}

function DoseSyringeGuide({
  units,
  capacityUnits,
  doseLabel,
  markLabel,
  tooLarge,
}: {
  units: number;
  capacityUnits: number;
  doseLabel: string;
  markLabel: string;
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
              {markLabel}.
            </span>
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
          aria-label={`Syringe filled to ${markLabel} out of ${formatNumber(capacityUnits, 0)} marks`}
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
            <linearGradient id="guide-plunger" x1="480" x2="545" y1="72" y2="105">
              <stop offset="0" stopColor="#fdba74" />
              <stop offset="0.58" stopColor="#fb923c" />
              <stop offset="1" stopColor="#f97316" />
            </linearGradient>
            <filter id="guide-syringe-shadow" x="-10%" y="-20%" width="120%" height="140%">
              <feDropShadow dx="0" dy="3" floodColor="#0f172a" floodOpacity="0.14" stdDeviation="3" />
            </filter>
          </defs>
          <g filter="url(#guide-syringe-shadow)">
            <line
              x1="9"
              x2="50"
              y1="89"
              y2="89"
              stroke="#111827"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <rect x="46" y="82" width="12" height="14" rx="3" fill="#94a3b8" />
            <rect x="55" y="74" width="17" height="30" rx="4" fill="#111827" />
            <rect
              x={barrelX}
              y={barrelY}
              width={barrelWidth}
              height={barrelHeight}
              rx="8"
              fill="url(#guide-barrel)"
              opacity="0.97"
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
              fill="url(#guide-plunger)"
            />
            <rect x="480" y="79" width="20" height="19" rx="4" fill="#fdba74" />
            <circle cx="522" cy="88.5" r="25" fill="url(#guide-plunger)" />
            <circle cx="513" cy="79" r="7" fill="#fed7aa" opacity="0.7" />
            <path d="M491 84h20" stroke="#fed7aa" strokeLinecap="round" strokeWidth="2" opacity="0.8" />
          </g>
        </svg>
      </div>
    </section>
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

function DoseIllustration({ unit }: { unit: DoseInputUnit }) {
  const label = unit === "iu" ? "IU" : "mcg";

  return (
    <svg viewBox="0 0 48 48" role="img" aria-label={`${label} dose amount`} className="h-10 w-10">
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
        {label}
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
  const [draftValue, setDraftValue] = useState(() => String(value));

  return (
    <label className="mt-3 grid gap-1 text-xs font-semibold text-slate-600">
      {label}
      <input
        type="number"
        min="0"
        step="0.01"
        value={draftValue}
        onChange={(event) => {
          const nextValue = event.target.value;
          setDraftValue(nextValue);

          if (nextValue === "") {
            onChange(0);
            return;
          }

          const parsedValue = Number(nextValue);
          if (Number.isFinite(parsedValue)) {
            onChange(parsedValue);
          }
        }}
        className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />
    </label>
  );
}

function MetricRow({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="grid gap-1 rounded-2xl bg-[linear-gradient(135deg,#ffffff_0%,#f4f9ff_100%)] px-3 py-2 text-sm ring-1 ring-sky-100">
      <span className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
        {label}
      </span>
      <span className="text-lg font-semibold leading-7 tracking-normal text-slate-950 tabular-nums">
        {value}
      </span>
      <span className="text-xs leading-5 text-slate-500">{description}</span>
    </div>
  );
}

function CompoundSplitBreakdown({
  items,
  totalPercent,
  displayMode,
}: {
  items: SplitBreakdownItem[];
  totalPercent: number;
  displayMode: DoseInputUnit;
}) {
  if (!items.length) {
    return null;
  }

  const isIuMode = displayMode === "iu";

  return (
    <div className="rounded-2xl bg-[linear-gradient(135deg,#f0fbff_0%,#fff7ed_100%)] p-3 ring-1 ring-cyan-100">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
          Split compound breakdown
        </span>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-sky-900 ring-1 ring-sky-100">
          {formatNumber(totalPercent, 2)}% entered
        </span>
      </div>

      {Math.abs(totalPercent - 100) > 0.01 ? (
        <p className="mt-2 text-xs leading-5 text-slate-500">
          The entered split does not equal 100%, so these numbers are normalized
          to match the full dose.
        </p>
      ) : null}

      <div className="mt-3 grid gap-2">
        {items.map((item) => (
          <div
            key={`${item.name}-${item.inputPercent}`}
            className="rounded-2xl bg-white/85 p-3 ring-1 ring-sky-100"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-slate-950">{item.name}</span>
              <span className="text-sm font-semibold text-sky-900">
                {formatNumber(item.normalizedPercent, 2)}%
              </span>
            </div>
            <div className="mt-1 text-base font-semibold tabular-nums text-slate-950">
              {isIuMode
                ? `${formatNumber(item.doseIu, 2)} IU`
                : `${formatNumber(item.doseMcg, 2)} mcg`}{" "}
              <span className="text-sm font-medium text-slate-500">
                {isIuMode
                  ? `(${formatNumber(item.doseMcg, 2)} mcg / ${formatNumber(item.doseMg, 4)} mg)`
                  : `(${formatNumber(item.doseMg, 4)} mg)`}
              </span>
            </div>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              {isIuMode
                ? `This compound is ${formatNumber(item.normalizedPercent, 2)}% of the total IU draw.`
                : `This compound contributes ${formatNumber(item.mcgPerSyringeUnit, 3)} mcg per syringe mark.`}
            </p>
          </div>
        ))}
      </div>
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
