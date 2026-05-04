export type MassUnit = "mcg" | "mg" | "iu";
export type Frequency = "daily" | "every_other_day" | "twice_weekly" | "weekly" | "monthly";

export type CalculationInput = {
  vialAmount: number;
  vialUnit: MassUnit;
  diluentMl: number;
  doseAmount: number;
  doseUnit: MassUnit;
  mcgPerIu?: number;
};

export type CalculationResult = {
  vialMcg: number;
  doseMcg: number;
  concentrationMcgMl: number;
  concentrationMgMl: number;
  doseMl: number;
  syringeUnits: number;
  dosesPerVial: number;
  mcgPerSyringeUnit: number;
  warnings: string[];
};

export const frequencyLabels: Record<Frequency, string> = {
  daily: "Daily",
  every_other_day: "Every other day",
  twice_weekly: "Twice weekly",
  weekly: "Weekly",
  monthly: "Monthly",
};

export function toMcg(value: number, unit: MassUnit, mcgPerIu?: number) {
  if (!Number.isFinite(value) || value <= 0) return null;

  if (unit === "mcg") return value;
  if (unit === "mg") return value * 1000;
  if (!mcgPerIu || mcgPerIu <= 0) return null;
  return value * mcgPerIu;
}

export function fromMcg(value: number, unit: MassUnit, mcgPerIu?: number) {
  if (!Number.isFinite(value) || value <= 0) return null;

  if (unit === "mcg") return value;
  if (unit === "mg") return value / 1000;
  if (!mcgPerIu || mcgPerIu <= 0) return null;
  return value / mcgPerIu;
}

export function calculateDose(input: CalculationInput): CalculationResult | null {
  const vialMcg = toMcg(input.vialAmount, input.vialUnit, input.mcgPerIu);
  const doseMcg = toMcg(input.doseAmount, input.doseUnit, input.mcgPerIu);

  if (!vialMcg || !doseMcg || !input.diluentMl || input.diluentMl <= 0) {
    return null;
  }

  const concentrationMcgMl = vialMcg / input.diluentMl;
  const doseMl = doseMcg / concentrationMcgMl;
  const syringeUnits = doseMl * 100;
  const dosesPerVial = vialMcg / doseMcg;
  const mcgPerSyringeUnit = concentrationMcgMl / 100;
  const warnings: string[] = [];

  if (input.vialUnit === "iu" || input.doseUnit === "iu") {
    if (!input.mcgPerIu || input.mcgPerIu <= 0) {
      warnings.push("IU conversion needs a compound-specific potency value.");
    }
  }

  if (doseMl > 1) {
    warnings.push("Calculated injection volume is over 1 mL. Verify concentration and route with a clinician.");
  }

  if (doseMl > 0 && doseMl < 0.03) {
    warnings.push("Calculated volume is very small. Confirm syringe type and measurement precision.");
  }

  if (syringeUnits > 0 && syringeUnits < 1) {
    warnings.push("Calculated U-100 syringe volume is below 1 unit.");
  }

  return {
    vialMcg,
    doseMcg,
    concentrationMcgMl,
    concentrationMgMl: concentrationMcgMl / 1000,
    doseMl,
    syringeUnits,
    dosesPerVial,
    mcgPerSyringeUnit,
    warnings,
  };
}

export function buildSchedule(start: string, frequency: Frequency, durationWeeks: number) {
  const startDate = new Date(`${start}T12:00:00`);
  const safeWeeks = Math.min(Math.max(Math.round(durationWeeks || 1), 1), 52);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + safeWeeks * 7);

  if (Number.isNaN(startDate.getTime())) return [];

  const events: Date[] = [];
  const cursor = new Date(startDate);

  while (cursor < endDate && events.length < 160) {
    events.push(new Date(cursor));

    if (frequency === "daily") {
      cursor.setDate(cursor.getDate() + 1);
    } else if (frequency === "every_other_day") {
      cursor.setDate(cursor.getDate() + 2);
    } else if (frequency === "twice_weekly") {
      const last = events.length > 1 ? events[events.length - 2] : null;
      const gap = last ? daysBetween(last, cursor) : 0;
      cursor.setDate(cursor.getDate() + (gap === 3 ? 4 : 3));
    } else if (frequency === "weekly") {
      cursor.setDate(cursor.getDate() + 7);
    } else {
      cursor.setMonth(cursor.getMonth() + 1);
    }
  }

  return events;
}

function daysBetween(left: Date, right: Date) {
  return Math.round((right.getTime() - left.getTime()) / 86_400_000);
}

export function formatNumber(value: number | null | undefined, maxDigits = 3) {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return "-";
  }

  if (Math.abs(value) >= 1000) {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: maxDigits,
    minimumFractionDigits: value > 0 && value < 1 ? Math.min(maxDigits, 3) : 0,
  }).format(value);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function todayInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}
