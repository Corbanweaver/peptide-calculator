export const PENDING_CALCULATION_STORAGE_KEY =
  "peptidecalculator.pendingCalculation";

export type DoseInputMode = "mcg" | "iu";
export type PresetKind = "reference" | "math" | "manual";

export type SavedSplitSnapshot = {
  name: string;
  percent?: string;
  inputPercent?: number;
  normalizedPercent?: number;
  doseMcg?: number;
  doseMg?: number;
  doseIu?: number;
  mcgPerSyringeUnit?: number;
};

export type SavedCalculationScheduleItem = {
  type: "calculator_result";
  savedAt: string;
  compoundName: string | null;
  presetDetail: string | null;
  presetType: PresetKind;
  doseLabel: string;
  syringeMarkLabel: string;
  syringeMl: number;
  vialMg: number;
  waterMl: number;
  doseInputUnit: DoseInputMode;
  doseInputAmount: number;
  doseMcg: number;
  doseMl: number;
  concentrationMcgMl: number;
  syringeUnits: number;
  mcgPerSyringeUnit: number;
  splitParts: SavedSplitSnapshot[];
  splitBreakdown: SavedSplitSnapshot[];
};

export type SavedCalculationDraft = {
  compoundId: string;
  planName: string;
  doseMcg: number;
  doseMl: number;
  frequency: string;
  durationWeeks: number;
  createdAt: string;
  schedule: SavedCalculationScheduleItem[];
};

export type SavedProtocolInsert = {
  user_id: string;
  compound_id: string;
  plan_name: string;
  dose_mcg: number;
  dose_ml: number;
  frequency: string;
  duration_weeks: number;
  schedule: SavedCalculationScheduleItem[];
};

export function createSavedCalculationDraft({
  compoundName,
  presetDetail,
  presetType,
  doseLabel,
  syringeMarkLabel,
  syringeMl,
  vialMg,
  waterMl,
  doseInputUnit,
  doseInputAmount,
  doseMcg,
  doseMl,
  concentrationMcgMl,
  syringeUnits,
  mcgPerSyringeUnit,
  splitParts,
  splitBreakdown,
}: {
  compoundName: string;
  presetDetail: string;
  presetType: PresetKind;
  doseLabel: string;
  syringeMarkLabel: string;
  syringeMl: number;
  vialMg: number;
  waterMl: number;
  doseInputUnit: DoseInputMode;
  doseInputAmount: number;
  doseMcg: number;
  doseMl: number;
  concentrationMcgMl: number;
  syringeUnits: number;
  mcgPerSyringeUnit: number;
  splitParts: SavedSplitSnapshot[];
  splitBreakdown: SavedSplitSnapshot[];
}): SavedCalculationDraft {
  const savedAt = new Date().toISOString();
  const safeCompoundName = compoundName.trim() || "Custom calculation";
  const safePresetDetail = presetDetail.trim();
  const planName = safePresetDetail
    ? `${safeCompoundName} - ${safePresetDetail}`
    : `${safeCompoundName} - ${doseLabel}`;

  return {
    compoundId: slugify(safeCompoundName),
    planName,
    doseMcg: cleanNumber(doseMcg, 4),
    doseMl: cleanNumber(doseMl, 6),
    frequency: "Saved calculator result",
    durationWeeks: 1,
    createdAt: savedAt,
    schedule: [
      {
        type: "calculator_result",
        savedAt,
        compoundName: safeCompoundName,
        presetDetail: safePresetDetail || null,
        presetType,
        doseLabel,
        syringeMarkLabel,
        syringeMl: cleanNumber(syringeMl, 3),
        vialMg: cleanNumber(vialMg, 4),
        waterMl: cleanNumber(waterMl, 4),
        doseInputUnit,
        doseInputAmount: cleanNumber(doseInputAmount, 4),
        doseMcg: cleanNumber(doseMcg, 4),
        doseMl: cleanNumber(doseMl, 6),
        concentrationMcgMl: cleanNumber(concentrationMcgMl, 4),
        syringeUnits: cleanNumber(syringeUnits, 4),
        mcgPerSyringeUnit: cleanNumber(mcgPerSyringeUnit, 4),
        splitParts: splitParts.map(cleanSplitSnapshot),
        splitBreakdown: splitBreakdown.map(cleanSplitSnapshot),
      },
    ],
  };
}

export function toSavedProtocolInsert(
  userId: string,
  draft: SavedCalculationDraft,
): SavedProtocolInsert {
  return {
    user_id: userId,
    compound_id: draft.compoundId,
    plan_name: draft.planName,
    dose_mcg: draft.doseMcg,
    dose_ml: draft.doseMl,
    frequency: draft.frequency,
    duration_weeks: draft.durationWeeks,
    schedule: draft.schedule,
  };
}

export function savePendingCalculationDraft(draft: SavedCalculationDraft) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    PENDING_CALCULATION_STORAGE_KEY,
    JSON.stringify(draft),
  );
}

export function readPendingCalculationDraft() {
  if (typeof window === "undefined") {
    return null;
  }

  const storedDraft = window.localStorage.getItem(PENDING_CALCULATION_STORAGE_KEY);

  if (!storedDraft) {
    return null;
  }

  try {
    const parsedDraft = JSON.parse(storedDraft) as unknown;

    if (!isSavedCalculationDraft(parsedDraft)) {
      return null;
    }

    return parsedDraft;
  } catch {
    return null;
  }
}

export function clearPendingCalculationDraft() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PENDING_CALCULATION_STORAGE_KEY);
}

function isSavedCalculationDraft(value: unknown): value is SavedCalculationDraft {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.compoundId === "string" &&
    typeof value.planName === "string" &&
    typeof value.doseMcg === "number" &&
    typeof value.doseMl === "number" &&
    typeof value.frequency === "string" &&
    typeof value.durationWeeks === "number" &&
    Array.isArray(value.schedule)
  );
}

function cleanSplitSnapshot(part: SavedSplitSnapshot): SavedSplitSnapshot {
  return {
    name: part.name,
    percent: part.percent,
    inputPercent: cleanOptionalNumber(part.inputPercent, 4),
    normalizedPercent: cleanOptionalNumber(part.normalizedPercent, 4),
    doseMcg: cleanOptionalNumber(part.doseMcg, 4),
    doseMg: cleanOptionalNumber(part.doseMg, 6),
    doseIu: cleanOptionalNumber(part.doseIu, 4),
    mcgPerSyringeUnit: cleanOptionalNumber(part.mcgPerSyringeUnit, 4),
  };
}

function cleanOptionalNumber(value: number | undefined, decimals: number) {
  if (typeof value !== "number") {
    return undefined;
  }

  return cleanNumber(value, decimals);
}

function cleanNumber(value: number, decimals: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Number(value.toFixed(decimals));
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "custom-calculation";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
