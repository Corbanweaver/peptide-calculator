"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Calculator,
  CheckCircle2,
  ExternalLink,
  FlaskConical,
  Search,
  ShieldCheck,
} from "lucide-react";

type CalculatorPreset = {
  vialMg: number;
  waterMl: number;
  doseMcg: number;
  syringeMl?: number;
  label: string;
};

type CompoundProfile = {
  name: string;
  category: "Trending" | "FDA-label" | "Clinical" | "Wellness" | "Research/blocked";
  status: string;
  tone: string;
  summary: string;
  usefulFor: string[];
  referenceDose: string;
  sourceLabel: string;
  sourceUrl?: string;
  calculatorPreset?: CalculatorPreset;
  protocolState: string;
};

const categories = [
  "All",
  "Trending",
  "FDA-label",
  "Clinical",
  "Wellness",
  "Research/blocked",
];

const editableMathPreset: CalculatorPreset = {
  vialMg: 5,
  waterMl: 2,
  doseMcg: 100,
  label: "editable math template only",
};

const profiles: CompoundProfile[] = [
  {
    name: "Semaglutide",
    category: "Trending",
    status: "FDA-label reference",
    tone: "sky",
    summary:
      "GLP-1 receptor agonist used in FDA-approved products including Wegovy and Ozempic.",
    usefulFor: ["GLP-1", "Weekly injection", "Label titration"],
    referenceDose: "Typical label start: 0.25 mg once weekly.",
    sourceLabel: "DailyMed Wegovy/Ozempic labels",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ee06186f-2aa3-4990-a760-757579d8f77b",
    calculatorPreset: {
      vialMg: 5,
      waterMl: 2,
      doseMcg: 250,
      label: "0.25 mg starter dose",
    },
    protocolState:
      "Loads a starter-dose reference only. Maintenance dosing depends on indication and prescriber direction.",
  },
  {
    name: "Tirzepatide",
    category: "Trending",
    status: "FDA-label reference",
    tone: "indigo",
    summary:
      "Dual GIP/GLP-1 receptor agonist used in FDA-approved Mounjaro and Zepbound products.",
    usefulFor: ["GLP-1/GIP", "Weekly injection", "Label titration"],
    referenceDose: "Typical label start: 2.5 mg once weekly for 4 weeks.",
    sourceLabel: "DailyMed Mounjaro/Zepbound labels",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=d2d7da5d-ad07-4228-955f-cf7e355c8cc0&version=36",
    calculatorPreset: {
      vialMg: 10,
      waterMl: 2,
      doseMcg: 2500,
      label: "2.5 mg starter dose",
    },
    protocolState:
      "Loads a starter-dose reference only. Titration and maintenance dose must come from the product label or prescriber.",
  },
  {
    name: "Retatrutide",
    category: "Trending",
    status: "Investigational",
    tone: "violet",
    summary:
      "Triple agonist discussed heavily online, but not an FDA-approved finished drug product.",
    usefulFor: ["Trending", "Investigational", "No public preset"],
    referenceDose: "No public calculator preset.",
    sourceLabel: "Investigational status",
    protocolState:
      "No dosing preset is provided because this is not an approved consumer prescription product.",
  },
  {
    name: "Cagrilintide",
    category: "Trending",
    status: "Investigational",
    tone: "cyan",
    summary:
      "Amylin analog discussed in metabolic research and combination weight-management pipelines.",
    usefulFor: ["Trending", "Investigational", "No public preset"],
    referenceDose: "No public calculator preset.",
    sourceLabel: "Investigational status",
    protocolState:
      "No dosing preset is provided until an approved product label is available.",
  },
  {
    name: "Liraglutide",
    category: "FDA-label",
    status: "FDA-label reference",
    tone: "emerald",
    summary:
      "GLP-1 receptor agonist used in FDA-approved Saxenda and Victoza products.",
    usefulFor: ["Daily injection", "GLP-1", "Label titration"],
    referenceDose: "Saxenda label start: 0.6 mg daily; target 3 mg daily.",
    sourceLabel: "DailyMed Saxenda label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3946d389-0926-4f77-a708-0acb8153b143",
    calculatorPreset: {
      vialMg: 6,
      waterMl: 1,
      doseMcg: 600,
      label: "0.6 mg starter dose",
    },
    protocolState:
      "Starter preset only. Dose escalation should follow the prescribed product label.",
  },
  {
    name: "Dulaglutide",
    category: "FDA-label",
    status: "FDA-label reference",
    tone: "sky",
    summary:
      "Once-weekly GLP-1 receptor agonist used in FDA-approved Trulicity products.",
    usefulFor: ["Weekly injection", "GLP-1", "Label titration"],
    referenceDose: "Typical adult label start: 0.75 mg once weekly.",
    sourceLabel: "DailyMed Trulicity label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=463050bd-2b1c-40f5-b3c3-0a04bb433309&version=57",
    calculatorPreset: {
      vialMg: 3,
      waterMl: 1,
      doseMcg: 750,
      label: "0.75 mg starter dose",
    },
    protocolState:
      "Loads a label-start reference only. Product pens are fixed-dose and should be used as prescribed.",
  },
  {
    name: "Exenatide",
    category: "FDA-label",
    status: "FDA-label reference",
    tone: "orange",
    summary:
      "GLP-1 receptor agonist used in immediate-release Byetta and extended-release Bydureon products.",
    usefulFor: ["GLP-1", "Microgram dose", "Diabetes label"],
    referenceDose: "Byetta label start: 5 mcg twice daily.",
    sourceLabel: "DailyMed Byetta label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=53d03c03-ebf7-418d-88a8-533eabd2ee4f",
    calculatorPreset: {
      vialMg: 0.6,
      waterMl: 2.4,
      doseMcg: 5,
      label: "5 mcg starter dose",
    },
    protocolState:
      "Loads a label-start reference only. Use the prescribed product instructions.",
  },
  {
    name: "Exenatide ER",
    category: "FDA-label",
    status: "FDA-label reference",
    tone: "orange",
    summary:
      "Extended-release exenatide product with once-weekly administration in approved labeling.",
    usefulFor: ["Weekly injection", "GLP-1", "Fixed dose"],
    referenceDose: "Bydureon BCise label: 2 mg once weekly.",
    sourceLabel: "DailyMed Bydureon BCise label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=2d18cfc4-e0de-4814-a712-c1b7c504bff5",
    calculatorPreset: {
      vialMg: 2,
      waterMl: 0.85,
      doseMcg: 2000,
      label: "2 mg weekly dose",
    },
    protocolState:
      "Reference only. Extended-release devices should be administered exactly as prescribed.",
  },
  {
    name: "Tesamorelin",
    category: "FDA-label",
    status: "FDA-label reference",
    tone: "cyan",
    summary:
      "Growth hormone-releasing factor analog used in FDA-approved Egrifta SV.",
    usefulFor: ["Reconstitution", "Daily injection", "Vial math"],
    referenceDose: "Egrifta SV label: 1.4 mg daily from a 2 mg vial.",
    sourceLabel: "DailyMed Egrifta SV label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3d783378-b02d-4f19-99dd-0fc91a042224",
    calculatorPreset: {
      vialMg: 2,
      waterMl: 0.5,
      doseMcg: 1400,
      label: "1.4 mg daily dose",
    },
    protocolState:
      "Loads the labeled Egrifta SV dose math. Use only the product-specific diluent instructions.",
  },
  {
    name: "Bremelanotide / PT-141",
    category: "FDA-label",
    status: "FDA-label reference",
    tone: "rose",
    summary:
      "Melanocortin receptor agonist used in FDA-approved Vyleesi autoinjectors.",
    usefulFor: ["As-needed injection", "Prefilled device", "Label limits"],
    referenceDose: "Vyleesi label: 1.75 mg as needed; max 1 dose/24h and 8/month.",
    sourceLabel: "DailyMed Vyleesi label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f1d0c1b5-2f39-4bad-a6a4-0066e3ad5dcf",
    calculatorPreset: {
      vialMg: 1.75,
      waterMl: 0.3,
      doseMcg: 1750,
      label: "1.75 mg labeled dose",
    },
    protocolState:
      "Reference only. This product is supplied as an autoinjector and has strict frequency limits.",
  },
  {
    name: "Octreotide acetate",
    category: "FDA-label",
    status: "FDA-label reference",
    tone: "slate",
    summary:
      "Somatostatin analog used in prescription products for acromegaly and hormone-secreting tumors.",
    usefulFor: ["Microgram dose", "Clinical use", "Label monitoring"],
    referenceDose: "Acromegaly label initial dose: 50 mcg three times daily.",
    sourceLabel: "DailyMed Octreotide label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9502860d-0261-4d69-a4be-827a5376d356",
    calculatorPreset: {
      vialMg: 0.05,
      waterMl: 1,
      doseMcg: 50,
      label: "50 mcg initial dose",
    },
    protocolState:
      "Clinical reference only. Monitoring and titration are condition-specific.",
  },
  {
    name: "Desmopressin acetate",
    category: "FDA-label",
    status: "FDA-label reference",
    tone: "indigo",
    summary:
      "Vasopressin analog used in prescription injection products with serious sodium-monitoring concerns.",
    usefulFor: ["Microgram dose", "Clinical use", "Label monitoring"],
    referenceDose: "Treatment-naive label start: 2 to 4 mcg daily.",
    sourceLabel: "DailyMed Desmopressin label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1052a869-b64d-655d-e063-6294a90ad0e2",
    calculatorPreset: {
      vialMg: 0.04,
      waterMl: 10,
      doseMcg: 2,
      label: "2 mcg starting dose",
    },
    protocolState:
      "Clinical reference only. Desmopressin requires prescriber-directed sodium and fluid guidance.",
  },
  {
    name: "Teriparatide",
    category: "FDA-label",
    status: "FDA-label reference",
    tone: "emerald",
    summary:
      "Parathyroid hormone analog used in FDA-approved osteoporosis injection products.",
    usefulFor: ["Daily injection", "Microgram dose", "Prefilled pen"],
    referenceDose: "Forteo label: 20 mcg once daily.",
    sourceLabel: "DailyMed Forteo label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?audience=consumer&setid=aae667c5-381f-4f92-93df-2ed6158d07b0",
    calculatorPreset: {
      vialMg: 0.6,
      waterMl: 2.4,
      doseMcg: 20,
      label: "20 mcg daily dose",
    },
    protocolState:
      "Reference only. Prefilled pen products measure the dose for the patient.",
  },
  {
    name: "Abaloparatide",
    category: "FDA-label",
    status: "FDA-label reference",
    tone: "emerald",
    summary:
      "PTHrP analog used in FDA-approved Tymlos products for osteoporosis-related indications.",
    usefulFor: ["Daily injection", "Microgram dose", "Prefilled pen"],
    referenceDose: "Tymlos label: 80 mcg once daily.",
    sourceLabel: "DailyMed Tymlos label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=712143d9-e21e-4013-bb3b-3426a21060a8",
    calculatorPreset: {
      vialMg: 3.12,
      waterMl: 1.56,
      doseMcg: 80,
      label: "80 mcg daily dose",
    },
    protocolState:
      "Reference only. Prefilled pen products measure the dose for the patient.",
  },
  {
    name: "Glucagon",
    category: "Clinical",
    status: "Prescription kit",
    tone: "orange",
    summary:
      "Emergency and diagnostic peptide hormone products with kit-specific instructions.",
    usefulFor: ["Emergency kit", "1 mg vial", "Follow label"],
    referenceDose: "Severe hypoglycemia label: 1 mg for adults and children >=20 kg.",
    sourceLabel: "DailyMed Glucagon label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3d8c92cf-9263-4126-8a5b-4cd761e31bc1",
    protocolState:
      "No calculator preset. Emergency products should be used exactly as supplied and prescribed.",
  },
  {
    name: "Calcitonin salmon",
    category: "Clinical",
    status: "IU-based label",
    tone: "cyan",
    summary:
      "Prescription calcitonin product with dosing commonly expressed in International Units.",
    usefulFor: ["IU dosing", "Clinical use", "Label review"],
    referenceDose: "Label examples include 100 International Units daily for some indications.",
    sourceLabel: "DailyMed Calcitonin label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=2b8c6917-c217-45bf-a0ac-a2fa0f7d497a",
    protocolState:
      "No preset yet because IU conversion must be compound-specific and label-driven.",
  },
  {
    name: "Enfuvirtide",
    category: "Clinical",
    status: "Prescription HIV therapy",
    tone: "slate",
    summary:
      "Fusion-inhibitor peptide therapy for HIV with disease-specific dosing and training requirements.",
    usefulFor: ["Reconstitution", "Clinical use", "Specialty medication"],
    referenceDose: "Adult label commonly uses 90 mg twice daily.",
    sourceLabel: "DailyMed Fuzeon label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=6935e846-d5a1-49e5-89a2-f8ebe4d5590d",
    protocolState:
      "No public preset. Specialty medications should follow pharmacy training and prescription instructions.",
  },
  {
    name: "Oxytocin",
    category: "Clinical",
    status: "Clinical setting",
    tone: "violet",
    summary:
      "Prescription hormone used in highly specific obstetric and clinical settings.",
    usefulFor: ["Clinical setting", "No public preset", "Safety gate"],
    referenceDose: "No consumer calculator preset.",
    sourceLabel: "Clinical label varies by indication",
    protocolState:
      "No preset. This is not appropriate for self-directed calculator protocols.",
  },
  {
    name: "Gonadorelin",
    category: "Clinical",
    status: "Clinical setting",
    tone: "indigo",
    summary:
      "GnRH analog used in diagnostic and specialty endocrine contexts.",
    usefulFor: ["Endocrine", "Specialty use", "No public preset"],
    referenceDose: "No consumer calculator preset.",
    sourceLabel: "Clinical label varies by indication",
    protocolState:
      "No preset. Dosing depends on diagnostic or specialty protocols.",
  },
  {
    name: "hCG",
    category: "Clinical",
    status: "IU-based prescription",
    tone: "emerald",
    summary:
      "Chorionic gonadotropin products are dosed in IU and vary greatly by indication.",
    usefulFor: ["IU dosing", "Fertility", "Clinician directed"],
    referenceDose: "No universal dose; label regimens are indication-specific.",
    sourceLabel: "Prescription labeling",
    protocolState:
      "No preset yet because IU dosing and clinical indication must be handled separately.",
  },
  {
    name: "Somatropin / HGH",
    category: "Clinical",
    status: "Prescription only",
    tone: "sky",
    summary:
      "Growth hormone products are prescription medications with weight-based and indication-specific dosing.",
    usefulFor: ["IU/mg conversion", "Clinical use", "No public preset"],
    referenceDose: "No universal dose; regimens are indication-specific.",
    sourceLabel: "Prescription labeling",
    protocolState:
      "No preset. Growth hormone should stay clinician-directed with product-specific instructions.",
  },
  {
    name: "Sermorelin",
    category: "Clinical",
    status: "Compounded/specialty",
    tone: "cyan",
    summary:
      "GHRH analog commonly discussed in clinics, but public dosing should be source-reviewed before publication.",
    usefulFor: ["Hormone axis", "Review needed", "No public preset"],
    referenceDose: "No source-reviewed public preset.",
    sourceLabel: "Review required",
    protocolState:
      "No preset until current legal status, pharmacy route, and source data are reviewed.",
  },
  {
    name: "NAD+",
    category: "Wellness",
    status: "No standard preset",
    tone: "orange",
    summary:
      "Popular wellness compound, often offered through clinics, with nonstandard protocols.",
    usefulFor: ["Wellness", "Clinic-specific", "No public preset"],
    referenceDose: "No universal reference dose.",
    sourceLabel: "Clinic protocols vary",
    protocolState:
      "No preset because concentration, route, and dose vary widely by clinic and product.",
  },
  {
    name: "Glutathione",
    category: "Wellness",
    status: "No standard preset",
    tone: "emerald",
    summary:
      "Popular injectable antioxidant compound with clinic-specific concentrations and protocols.",
    usefulFor: ["Wellness", "Clinic-specific", "No public preset"],
    referenceDose: "No universal reference dose.",
    sourceLabel: "Clinic protocols vary",
    protocolState:
      "No preset because protocols are not standardized across products or clinics.",
  },
  {
    name: "L-carnitine",
    category: "Wellness",
    status: "No standard preset",
    tone: "rose",
    summary:
      "Popular injectable wellness compound with highly variable concentrations.",
    usefulFor: ["Wellness", "Clinic-specific", "No public preset"],
    referenceDose: "No universal reference dose.",
    sourceLabel: "Clinic protocols vary",
    protocolState:
      "No preset because calculator values should come from the exact vial label.",
  },
  {
    name: "MIC / B12 blends",
    category: "Wellness",
    status: "No standard preset",
    tone: "violet",
    summary:
      "Common clinic blend category where ingredients and concentrations vary by pharmacy.",
    usefulFor: ["Blend", "Clinic-specific", "No public preset"],
    referenceDose: "No universal reference dose.",
    sourceLabel: "Pharmacy formulations vary",
    protocolState:
      "No preset because blend composition must come from the exact pharmacy label.",
  },
  {
    name: "BPC-157",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "rose",
    summary:
      "Very popular online recovery peptide, but FDA has identified safety concerns for compounding review.",
    usefulFor: ["Blocked preset", "Safety warning", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset. Do not publish protocols for compounds flagged by FDA safety-risk materials.",
  },
  {
    name: "TB-500",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "slate",
    summary:
      "Thymosin beta-4 fragment frequently discussed for recovery, without an approved consumer protocol.",
    usefulFor: ["Blocked preset", "Safety warning", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite insufficient safety information.",
  },
  {
    name: "CJC-1295",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "indigo",
    summary:
      "GHRH analog frequently paired with secretagogues in online peptide discussions.",
    usefulFor: ["Blocked preset", "Hormone axis", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite adverse events and limited clinical data.",
  },
  {
    name: "Ipamorelin",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "cyan",
    summary:
      "Growth hormone secretagogue commonly marketed online and in clinics.",
    usefulFor: ["Blocked preset", "Hormone axis", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite immunogenicity and limited route-specific safety data.",
  },
  {
    name: "AOD-9604",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "orange",
    summary:
      "Weight-management peptide fragment discussed online, without an approved public-use protocol.",
    usefulFor: ["Blocked preset", "Weight-loss trend", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite limited safety information and serious adverse events.",
  },
  {
    name: "GHK-Cu",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "cyan",
    summary:
      "Copper peptide discussed for skin and recovery; injectable use has safety-review concerns.",
    usefulFor: ["Blocked preset", "Cosmetic trend", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset for injectable use because FDA materials cite limited human safety data.",
  },
  {
    name: "MOTS-c",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "slate",
    summary:
      "Mitochondrial-derived peptide commonly discussed in longevity circles.",
    usefulFor: ["Blocked preset", "Longevity trend", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite lack of human exposure data.",
  },
  {
    name: "Melanotan II",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "rose",
    summary:
      "Tanning peptide marketed online with serious adverse-event concerns in published case reports.",
    usefulFor: ["Blocked preset", "Cosmetic trend", "Safety warning"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite serious adverse events.",
  },
  {
    name: "Thymosin alpha-1",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "emerald",
    summary:
      "Immune-focused peptide often discussed online, with inadequate safety information for compounding review.",
    usefulFor: ["Blocked preset", "Immune trend", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite inadequate safety information.",
  },
  {
    name: "GHRP-2",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "indigo",
    summary:
      "Growth hormone releasing peptide with compounding safety concerns for injectable and nasal routes.",
    usefulFor: ["Blocked preset", "Hormone axis", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite safety-risk concerns.",
  },
  {
    name: "GHRP-6",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "indigo",
    summary:
      "Growth hormone releasing peptide with limited safety data and metabolic concerns noted by FDA.",
    usefulFor: ["Blocked preset", "Hormone axis", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite safety-risk concerns.",
  },
  {
    name: "Ibutamoren / MK-677",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "orange",
    summary:
      "Oral growth hormone secretagogue often discussed in bodybuilding and longevity communities.",
    usefulFor: ["Blocked preset", "Oral compound", "Safety warning"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite potential congestive heart failure risk.",
  },
  {
    name: "Semax",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "violet",
    summary:
      "Heptapeptide discussed for cognition and nasal use, without approved U.S. consumer labeling.",
    usefulFor: ["Blocked preset", "Cognitive trend", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite limited safety information.",
  },
  {
    name: "Selank",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "violet",
    summary:
      "Peptide discussed for mood and anxiety online, without approved U.S. consumer labeling.",
    usefulFor: ["Blocked preset", "Cognitive trend", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite limited safety information.",
  },
  {
    name: "Epitalon",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "slate",
    summary:
      "Longevity peptide discussed online, without approved U.S. consumer labeling.",
    usefulFor: ["Blocked preset", "Longevity trend", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite insufficient safety information.",
  },
  {
    name: "KPV",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "emerald",
    summary:
      "Anti-inflammatory peptide fragment discussed online, without approved U.S. consumer labeling.",
    usefulFor: ["Blocked preset", "Inflammation trend", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite lack of human exposure data.",
  },
  {
    name: "LL-37",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "rose",
    summary:
      "Cathelicidin peptide discussed for immune support, with FDA safety-risk concerns.",
    usefulFor: ["Blocked preset", "Immune trend", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite limited safety data and reproductive/tumor concerns.",
  },
  {
    name: "PEG-MGF",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "slate",
    summary:
      "Mechano growth factor variant discussed for recovery and muscle, without approved U.S. labeling.",
    usefulFor: ["Blocked preset", "Recovery trend", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite lack of human exposure data.",
  },
  {
    name: "Dihexa",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "violet",
    summary:
      "Cognitive research compound discussed online, without approved U.S. consumer labeling.",
    usefulFor: ["Blocked preset", "Cognitive trend", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 / withdrawn list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite no identified human exposure data.",
  },
  {
    name: "Kisspeptin-10",
    category: "Research/blocked",
    status: "FDA safety-risk list",
    tone: "indigo",
    summary:
      "Reproductive hormone-axis peptide with limited route-specific safety information.",
    usefulFor: ["Blocked preset", "Hormone axis", "Research-only risk"],
    referenceDose: "No calculator preset.",
    sourceLabel: "FDA Category 2 list",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks",
    protocolState:
      "No dosing preset because FDA materials cite no or limited safety information.",
  },
];

export function PeptideLibrary() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProfiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return profiles.filter((profile) => {
      const matchesCategory =
        activeCategory === "All" || profile.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${profile.name} ${profile.category} ${profile.status} ${profile.summary} ${profile.referenceDose}`
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-end">
        <div className="flex h-12 min-w-0 items-center gap-3 rounded-full border border-sky-100 bg-white/90 px-4 shadow-sm md:w-full md:max-w-md">
          <Search size={18} className="shrink-0 text-sky-800" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search compounds"
            aria-label="Search peptide and compound profiles"
            className="min-w-0 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`h-10 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
              activeCategory === category
                ? "bg-slate-950 text-white shadow-[0_14px_35px_rgba(15,23,42,0.16)]"
                : "border border-sky-100 bg-white/85 text-slate-700 hover:bg-sky-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProfiles.map((profile) => (
          <article
            key={profile.name}
            className="min-w-0 rounded-[26px] border border-sky-100 bg-white/95 p-5 shadow-[0_18px_55px_rgba(14,165,233,0.08)] ring-1 ring-white/70"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <ProfileMark tone={profile.tone} />
                <div>
                  <h3 className="text-lg font-semibold text-slate-950">
                    {profile.name}
                  </h3>
                  <p className="text-sm font-medium text-slate-500">
                    {profile.category}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-900 ring-1 ring-sky-100">
                {profile.status}
              </span>
            </div>

            <p className="mt-4 min-h-20 text-sm leading-6 text-slate-700">
              {profile.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {profile.usefulFor.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-100"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-[linear-gradient(135deg,#f8fbff_0%,#fff7ed_100%)] p-3 text-xs leading-5 text-slate-700 ring-1 ring-sky-100">
              <div className="font-semibold text-slate-950">
                {profile.calculatorPreset
                  ? profile.referenceDose
                  : "Editable math template: 5 mg vial, 2 mL BAC water, 100 mcg dose."}
              </div>
              <div className="mt-1">
                {profile.protocolState}{" "}
                {!profile.calculatorPreset
                  ? "The calculator link is for measurement math only, not a recommended protocol."
                  : ""}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href={buildCalculatorHref(profile)}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-900"
              >
                <Calculator size={16} aria-hidden="true" />
                Use calculator
              </Link>

              {profile.sourceUrl ? (
                <a
                  href={profile.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center gap-1 rounded-full px-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-950"
                >
                  {profile.sourceLabel}
                  <ExternalLink size={13} aria-hidden="true" />
                </a>
              ) : (
                <span className="text-xs font-semibold text-slate-500">
                  {profile.sourceLabel}
                </span>
              )}
            </div>
          </article>
        ))}
      </div>

      {!filteredProfiles.length ? (
        <div className="rounded-[26px] border border-sky-100 bg-white/90 p-6 text-sm text-slate-700">
          No profiles match that search yet.
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-3">
        <LibraryNote
          icon={<ShieldCheck size={19} />}
          title="Legal gate"
          text="FDA-label references can preload source-based calculator math. Research-only or safety-risk compounds only get editable math templates."
        />
        <LibraryNote
          icon={<CheckCircle2 size={19} />}
          title="Editable presets"
          text="Calculator links preload a reference dose plus an editable example vial and water amount."
        />
        <LibraryNote
          icon={<FlaskConical size={19} />}
          title="Protocol builder"
          text="Future account features can save protocols after each compound has a reviewed source policy."
        />
      </div>
    </section>
  );
}

function buildCalculatorHref(profile: CompoundProfile) {
  const params = new URLSearchParams({ compound: profile.name });
  const preset = profile.calculatorPreset ?? editableMathPreset;

  params.set("preset", preset.label);
  params.set("presetType", profile.calculatorPreset ? "reference" : "math");
  params.set("vialMg", String(preset.vialMg));
  params.set("waterMl", String(preset.waterMl));
  params.set("doseMcg", String(preset.doseMcg));

  if (preset.syringeMl) {
    params.set("syringeMl", String(preset.syringeMl));
  }

  return `/calculator?${params.toString()}`;
}

function ProfileMark({ tone }: { tone: string }) {
  const colors: Record<string, string> = {
    sky: "from-sky-800 via-sky-500 to-cyan-300",
    indigo: "from-slate-950 via-indigo-700 to-sky-300",
    emerald: "from-slate-950 via-emerald-700 to-cyan-300",
    cyan: "from-sky-900 via-cyan-500 to-orange-300",
    violet: "from-slate-950 via-violet-700 to-fuchsia-300",
    rose: "from-slate-950 via-rose-700 to-orange-300",
    orange: "from-slate-950 via-orange-600 to-sky-300",
    slate: "from-slate-950 via-slate-700 to-sky-300",
  };

  return (
    <span
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${colors[tone] ?? colors.sky} text-white shadow-sm`}
    >
      <FlaskConical size={21} aria-hidden="true" />
    </span>
  );
}

function LibraryNote({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-[24px] border border-sky-100 bg-white/90 p-4 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
          {icon}
        </span>
        {title}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}
