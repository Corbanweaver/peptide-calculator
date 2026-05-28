export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoExample = {
  title: string;
  intro: string;
  calculatorHref: string;
  rows: {
    label: string;
    value: string;
  }[];
  result: string;
};

export type SeoPage = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  calculatorHref: string;
  searchPhrase?: string;
  ctaLabel?: string;
  sourceLabel?: string;
  sourceUrl?: string;
  example?: SeoExample;
  sections: {
    title: string;
    body: string;
  }[];
  faqs: SeoFaq[];
  related: {
    label: string;
    href: string;
  }[];
};

const sharedCalculatorFaqs: SeoFaq[] = [
  {
    question: "Is this a prescription or protocol?",
    answer:
      "No. PeptiCalc is a measurement calculator. It helps translate vial strength, BAC water, and a selected dose into syringe marks, but it does not prescribe treatment.",
  },
  {
    question: "Can I edit the preloaded values?",
    answer:
      "Yes. Every value that opens in the calculator is editable, including vial amount, BAC water, syringe size, and dose.",
  },
  {
    question: "Why do syringe marks matter?",
    answer:
      "Most U-100 insulin syringes show 100 marks per mL. The calculator converts the liquid dose into the mark to pull to on that syringe scale.",
  },
];

type CompoundSeoSeed = {
  slug: string;
  name: string;
  doseLabel: string;
  doseMcg: number;
  vialMg: number;
  waterMl: number;
  description: string;
  sourceLabel: string;
  sourceUrl: string;
  frequencyNote: string;
  related?: {
    label: string;
    href: string;
  }[];
};

type MathOnlyCompoundSeoSeed = {
  slug: string;
  name: string;
  description: string;
  sourceLabel: string;
  sourceUrl: string;
  regulatoryNote: string;
  searchAngle: string;
  exampleVialMg?: number;
  exampleWaterMl?: number;
  exampleDoseMcg?: number;
  related?: {
    label: string;
    href: string;
  }[];
};

const fda503aBulkListUrl =
  "https://www.fda.gov/media/94155/download?attachment=";
const fdaCompoundingSafetyUrl =
  "https://www.fda.gov/drugs/human-drug-compounding/certain-bulk-drug-substances-use-compounding-may-present-significant-safety-risks";
const fdaGlp1ConcernsUrl =
  "https://www.fda.gov/drugs/drug-alerts-and-statements/fdas-concerns-unapproved-glp-1-drugs-used-weight-loss";
const lillyRetatrutideStatusUrl =
  "https://www.lilly.com/news/stories/what-to-know-about-retatrutide";
const novoQ12026InvestorPresentationUrl =
  "https://www.novonordisk.com/content/dam/nncorp/global/en/investors/pdfs/financial-results/2026/Q1-2026-investor-presentation.pdf";

const additionalCompoundSeoSeeds: CompoundSeoSeed[] = [
  {
    slug: "liraglutide-calculator",
    name: "Liraglutide",
    doseLabel: "0.6 mg starter reference",
    doseMcg: 600,
    vialMg: 6,
    waterMl: 1,
    description:
      "Open an editable liraglutide calculator preset for dose math, concentration, and U-100 syringe marks.",
    sourceLabel: "DailyMed Saxenda label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3946d389-0926-4f77-a708-0acb8153b143",
    frequencyNote:
      "This preset uses a starter-dose reference. Any escalation or ongoing schedule must come from the actual product label or prescriber.",
  },
  {
    slug: "dulaglutide-calculator",
    name: "Dulaglutide",
    doseLabel: "0.75 mg weekly reference",
    doseMcg: 750,
    vialMg: 3,
    waterMl: 1,
    description:
      "Open an editable dulaglutide calculator preset for reference dose math and syringe mark planning.",
    sourceLabel: "DailyMed Trulicity label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=463050bd-2b1c-40f5-b3c3-0a04bb433309&version=57",
    frequencyNote:
      "Dulaglutide is commonly supplied in fixed-dose products, so this page is for comparison math only unless a prescriber or pharmacy provides exact vial instructions.",
  },
  {
    slug: "exenatide-calculator",
    name: "Exenatide",
    doseLabel: "5 mcg starter reference",
    doseMcg: 5,
    vialMg: 0.6,
    waterMl: 2.4,
    description:
      "Open an editable exenatide calculator preset for microgram dose math and U-100 syringe marks.",
    sourceLabel: "DailyMed Byetta label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=53d03c03-ebf7-418d-88a8-533eabd2ee4f",
    frequencyNote:
      "This is a microgram reference example only. Timing, meals, and dose changes should come from product-specific instructions.",
  },
  {
    slug: "exenatide-er-calculator",
    name: "Exenatide ER",
    doseLabel: "2 mg weekly reference",
    doseMcg: 2000,
    vialMg: 2,
    waterMl: 0.85,
    description:
      "Open an editable exenatide ER calculator preset for weekly reference math and concentration checks.",
    sourceLabel: "DailyMed Bydureon BCise label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/lookup.cfm?setid=2d18cfc4-e0de-4814-a712-c1b7c504bff5",
    frequencyNote:
      "Extended-release products have device-specific instructions, so do not use this page to replace a supplied pen or kit workflow.",
  },
  {
    slug: "tesamorelin-calculator",
    name: "Tesamorelin",
    doseLabel: "1.4 mg daily reference",
    doseMcg: 1400,
    vialMg: 2,
    waterMl: 0.5,
    description:
      "Open an editable tesamorelin calculator preset for vial math, BAC water, and syringe marks.",
    sourceLabel: "DailyMed Egrifta SV label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=3d783378-b02d-4f19-99dd-0fc91a042224",
    frequencyNote:
      "Use only product-specific diluent and storage instructions. This page is limited to measurement math.",
  },
  {
    slug: "bremelanotide-pt-141-calculator",
    name: "Bremelanotide / PT-141",
    doseLabel: "1.75 mg reference",
    doseMcg: 1750,
    vialMg: 1.75,
    waterMl: 0.3,
    description:
      "Open an editable bremelanotide calculator preset for reference dose math and syringe scale translation.",
    sourceLabel: "DailyMed Vyleesi label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=f1d0c1b5-2f39-4bad-a6a4-0066e3ad5dcf",
    frequencyNote:
      "This product has strict use-frequency limits in labeling. This page is not a recommendation to use compounded or non-labeled products.",
  },
  {
    slug: "octreotide-calculator",
    name: "Octreotide acetate",
    doseLabel: "50 mcg initial reference",
    doseMcg: 50,
    vialMg: 0.05,
    waterMl: 1,
    description:
      "Open an editable octreotide calculator preset for microgram concentration math and syringe marks.",
    sourceLabel: "DailyMed Octreotide label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=9502860d-0261-4d69-a4be-827a5376d356",
    frequencyNote:
      "Octreotide use and monitoring are condition-specific. Use this only to format already-provided instructions.",
  },
  {
    slug: "desmopressin-calculator",
    name: "Desmopressin acetate",
    doseLabel: "2 mcg starting reference",
    doseMcg: 2,
    vialMg: 0.04,
    waterMl: 10,
    description:
      "Open an editable desmopressin calculator preset for very small microgram dose math.",
    sourceLabel: "DailyMed Desmopressin label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=1052a869-b64d-655d-e063-6294a90ad0e2",
    frequencyNote:
      "Desmopressin can require sodium and fluid monitoring. Do not use this page to choose a dose.",
  },
  {
    slug: "teriparatide-calculator",
    name: "Teriparatide",
    doseLabel: "20 mcg daily reference",
    doseMcg: 20,
    vialMg: 0.6,
    waterMl: 2.4,
    description:
      "Open an editable teriparatide calculator preset for microgram dose math and syringe mark translation.",
    sourceLabel: "DailyMed Forteo label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?audience=consumer&setid=aae667c5-381f-4f92-93df-2ed6158d07b0",
    frequencyNote:
      "Prefilled pen products measure the dose for the user. This page is for calculator education and label comparison only.",
  },
  {
    slug: "abaloparatide-calculator",
    name: "Abaloparatide",
    doseLabel: "80 mcg daily reference",
    doseMcg: 80,
    vialMg: 3.12,
    waterMl: 1.56,
    description:
      "Open an editable abaloparatide calculator preset for microgram dose math and concentration checks.",
    sourceLabel: "DailyMed Tymlos label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=712143d9-e21e-4013-bb3b-3426a21060a8",
    frequencyNote:
      "Prefilled pen products have their own dose delivery. This page should not replace product instructions.",
  },
];

const mathOnlyCompoundSeoSeeds: MathOnlyCompoundSeoSeed[] = [
  {
    slug: "retatrutide-calculator",
    name: "Retatrutide",
    description:
      "Open a math-only retatrutide calculator page for editable vial amount, BAC water, concentration, and syringe marks.",
    sourceLabel: "Lilly retatrutide status",
    sourceUrl: lillyRetatrutideStatusUrl,
    regulatoryNote:
      "Lilly says retatrutide is investigational, not currently FDA approved, and should not be taken outside Lilly-sponsored clinical trials. FDA also says retatrutide cannot be used in compounding under federal law. This page is only a measurement calculator entry point.",
    searchAngle:
      "Retatrutide calculator searches are growing because people want GLP-1/GIP/glucagon syringe math. This page captures that high-intent traffic while clearly avoiding dosing instructions or approval claims.",
    exampleVialMg: 5,
    exampleWaterMl: 2,
    exampleDoseMcg: 250,
    related: [
      { label: "CagriSema calculator", href: "/peptides/cagrisema-calculator" },
      { label: "Semaglutide calculator", href: "/peptides/semaglutide-calculator" },
      { label: "Tirzepatide calculator", href: "/peptides/tirzepatide-calculator" },
      { label: "Cagrilintide calculator", href: "/peptides/cagrilintide-calculator" },
    ],
  },
  {
    slug: "cagrilintide-calculator",
    name: "Cagrilintide",
    description:
      "Open a math-only cagrilintide calculator page for editable concentration, dose volume, and U-100 syringe marks.",
    sourceLabel: "FDA GLP-1 compounding concerns",
    sourceUrl: fdaGlp1ConcernsUrl,
    regulatoryNote:
      "FDA says cagrilintide is not a component of an FDA-approved drug, has not been found safe and effective for any condition, and cannot be used in compounding under federal law. This page does not provide a cagrilintide protocol.",
    searchAngle:
      "Cagrilintide calculator searches overlap with CagriSema and amylin-analogue traffic. A focused math-only page gives those users a safer calculator path without claiming approval or choosing a dose.",
    exampleVialMg: 5,
    exampleWaterMl: 2,
    exampleDoseMcg: 250,
    related: [
      { label: "CagriSema calculator", href: "/peptides/cagrisema-calculator" },
      { label: "Retatrutide calculator", href: "/peptides/retatrutide-calculator" },
      { label: "Semaglutide calculator", href: "/peptides/semaglutide-calculator" },
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
    ],
  },
  {
    slug: "cagrisema-calculator",
    name: "CagriSema",
    description:
      "Open a math-only CagriSema calculator page for editable cagrilintide/semaglutide vial math, concentration, and syringe marks.",
    sourceLabel: "Novo Nordisk Q1 2026 pipeline update",
    sourceUrl: novoQ12026InvestorPresentationUrl,
    regulatoryNote:
      "Novo Nordisk describes CagriSema as cagrilintide 2.4 mg plus semaglutide 2.4 mg in its Q1 2026 investor materials. FDA says cagrilintide is not a component of an FDA-approved drug, has not been found safe and effective for any condition, and cannot be used in compounding under federal law. This page is not a CagriSema protocol or approval claim.",
    searchAngle:
      "CagriSema calculator searches are high-intent because users are looking for combination GLP-1/amylin measurement math. This page gives Google a focused, safety-limited calculator result instead of sending that traffic to a generic calculator.",
    exampleVialMg: 5,
    exampleWaterMl: 2,
    exampleDoseMcg: 250,
    related: [
      { label: "Cagrilintide calculator", href: "/peptides/cagrilintide-calculator" },
      { label: "Semaglutide calculator", href: "/peptides/semaglutide-calculator" },
      { label: "Retatrutide calculator", href: "/peptides/retatrutide-calculator" },
    ],
  },
  {
    slug: "bpc-157-calculator",
    name: "BPC-157",
    description:
      "Open a math-only BPC-157 calculator page for vial amount, BAC water, dose math, and syringe-mark conversion.",
    sourceLabel: "FDA 503A bulk substance update",
    sourceUrl: fda503aBulkListUrl,
    regulatoryNote:
      "FDA's April 22, 2026 503A update says BPC-157 was removed from category 2 because nominations were withdrawn and that PCAC consultation is planned for July 23, 2026. This page is not legal clearance, a product claim, or a use protocol.",
    searchAngle:
      "People search for BPC-157 calculator, BPC-157 reconstitution, and BPC-157 units when they need simple measurement math. This page gives that search a calculator path without recommending a dose.",
    exampleVialMg: 5,
    exampleWaterMl: 2,
    exampleDoseMcg: 250,
  },
  {
    slug: "tb-500-calculator",
    name: "TB-500",
    description:
      "Open a math-only TB-500 calculator page for vial, BAC water, concentration, and U-100 syringe marks.",
    sourceLabel: "FDA 503A bulk substance update",
    sourceUrl: fda503aBulkListUrl,
    regulatoryNote:
      "FDA's April 22, 2026 503A update says TB-500 was removed from category 2 because the nomination was withdrawn and that PCAC consultation is planned for July 23, 2026. This page does not say TB-500 is approved or appropriate for use.",
    searchAngle:
      "TB-500 calculator and TB-500 reconstitution searches are high-intent because users are usually trying to translate vial math into syringe marks.",
    exampleVialMg: 10,
    exampleWaterMl: 2,
    exampleDoseMcg: 500,
  },
  {
    slug: "ghk-cu-calculator",
    name: "GHK-Cu",
    description:
      "Open a math-only GHK-Cu calculator page for concentration, dose amount, and syringe mark planning.",
    sourceLabel: "FDA 503A bulk substance update",
    sourceUrl: fda503aBulkListUrl,
    regulatoryNote:
      "FDA's April 22, 2026 503A update says GHK-Cu nominations were withdrawn and FDA intends to consult PCAC before the end of February 2027. This page stays limited to measurement math.",
    searchAngle:
      "GHK-Cu calculator searches often overlap with mixed-vial and cosmetic peptide math. The page can capture that intent while keeping the calculator values editable.",
  },
  {
    slug: "cjc-1295-calculator",
    name: "CJC-1295",
    description:
      "Open a math-only CJC-1295 calculator page for vial math, BAC water, and split-dose planning.",
    sourceLabel: "FDA compounding safety review",
    sourceUrl: fdaCompoundingSafetyUrl,
    regulatoryNote:
      "FDA's compounding safety review discusses safety concerns and limited clinical data for CJC-1295. This page is only a calculator entry point and does not provide a CJC-1295 protocol.",
    searchAngle:
      "CJC-1295 calculator searches often include split-vial math with ipamorelin, making this a strong internal link target for the split compound calculator.",
    related: [
      { label: "CJC / ipamorelin split calculator", href: "/tools/cjc-ipamorelin-split-calculator" },
      { label: "Ipamorelin calculator", href: "/peptides/ipamorelin-calculator" },
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
    ],
  },
  {
    slug: "ipamorelin-calculator",
    name: "Ipamorelin",
    description:
      "Open a math-only ipamorelin calculator page for syringe marks, concentration, and split-vial math.",
    sourceLabel: "FDA compounding safety review",
    sourceUrl: fdaCompoundingSafetyUrl,
    regulatoryNote:
      "FDA's compounding safety review discusses safety concerns and limited safety information for ipamorelin acetate. This page does not recommend a dose or route.",
    searchAngle:
      "Ipamorelin calculator searches commonly need microgram-to-syringe conversion and mixed-compound math, which fits the calculator and split breakdown features.",
    related: [
      { label: "CJC / ipamorelin split calculator", href: "/tools/cjc-ipamorelin-split-calculator" },
      { label: "CJC-1295 calculator", href: "/peptides/cjc-1295-calculator" },
      { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
    ],
  },
  {
    slug: "mots-c-calculator",
    name: "MOTs-C",
    description:
      "Open a math-only MOTs-C calculator page for editable vial, BAC water, and syringe mark conversion.",
    sourceLabel: "FDA 503A bulk substance update",
    sourceUrl: fda503aBulkListUrl,
    regulatoryNote:
      "FDA's April 22, 2026 503A update says MOTs-C was removed from category 2 because the nomination was withdrawn and that PCAC consultation is planned for July 23, 2026. This page is not a recommendation to use MOTs-C.",
    searchAngle:
      "MOTs-C calculator searches are usually conversion-focused. A math-only page can rank for those searches while avoiding protocol language.",
  },
  {
    slug: "kpv-calculator",
    name: "KPV",
    description:
      "Open a math-only KPV calculator page for reconstitution math, concentration, and U-100 syringe marks.",
    sourceLabel: "FDA 503A bulk substance update",
    sourceUrl: fda503aBulkListUrl,
    regulatoryNote:
      "FDA's April 22, 2026 503A update says KPV was removed from category 2 because the nomination was withdrawn and that PCAC consultation is planned for July 23, 2026. This page is measurement support only.",
    searchAngle:
      "KPV calculator and KPV units searches can be served by a simple page that opens directly into editable calculator math.",
  },
  {
    slug: "semax-calculator",
    name: "Semax",
    description:
      "Open a math-only Semax calculator page for vial concentration, dose math, and syringe guide support.",
    sourceLabel: "FDA 503A bulk substance update",
    sourceUrl: fda503aBulkListUrl,
    regulatoryNote:
      "FDA's April 22, 2026 503A update says Semax was removed from category 2 because nominations were withdrawn and that PCAC consultation is planned for July 24, 2026. This page does not provide use instructions.",
    searchAngle:
      "Semax calculator searches often need quick unit conversion. This page gives the site a focused search landing page without giving a protocol.",
  },
  {
    slug: "epitalon-calculator",
    name: "Epitalon",
    description:
      "Open a math-only Epitalon calculator page for editable vial, BAC water, dose, and syringe mark math.",
    sourceLabel: "FDA 503A bulk substance update",
    sourceUrl: fda503aBulkListUrl,
    regulatoryNote:
      "FDA's April 22, 2026 503A update says Epitalon was removed from category 2 because nominations were withdrawn and that PCAC consultation is planned for July 24, 2026. This page is not a dosing guide.",
    searchAngle:
      "Epitalon calculator and reconstitution searches are a practical SEO target because they point to measurement math rather than broad informational browsing.",
  },
  {
    slug: "thymosin-alpha-1-calculator",
    name: "Thymosin alpha-1",
    description:
      "Open a math-only thymosin alpha-1 calculator page for concentration, syringe marks, and split-dose math.",
    sourceLabel: "FDA compounding safety review",
    sourceUrl: fdaCompoundingSafetyUrl,
    regulatoryNote:
      "FDA's compounding safety review notes inadequate safety-related information for thymosin alpha-1 compounded drug products. This page stays limited to calculator math.",
    searchAngle:
      "Thymosin alpha-1 calculator searches can be captured with a page that sends users to editable measurements instead of unsupported protocols.",
  },
  {
    slug: "nad-plus-calculator",
    name: "NAD+",
    description:
      "Open an NAD+ calculator page for vial math, concentration, mL volume, and syringe marks.",
    sourceLabel: "FDA 503A bulk substance list",
    sourceUrl: fda503aBulkListUrl,
    regulatoryNote:
      "FDA's April 22, 2026 503A bulk substance document lists Nicotinamide Adenine Dinucleotide (NAD) in category 1, meaning it is under evaluation. Calculator values still need to match the label, pharmacy, or prescriber instructions.",
    searchAngle:
      "NAD injection calculator and NAD units searches are common in wellness traffic. This page keeps that traffic focused on math and verification.",
    exampleVialMg: 500,
    exampleWaterMl: 5,
    exampleDoseMcg: 50000,
  },
  {
    slug: "glutathione-calculator",
    name: "Glutathione",
    description:
      "Open a glutathione calculator page for concentration math, mL volume, and U-100 syringe marks.",
    sourceLabel: "FDA glutathione sterile injectable notice",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/fda-highlights-concerns-using-dietary-ingredient-glutathione-compound-sterile-injectables",
    regulatoryNote:
      "FDA has highlighted concerns with using dietary ingredient glutathione to compound sterile injectables. This page should only be used for math from verified professional instructions.",
    searchAngle:
      "Glutathione injection calculator searches are high-intent, but the page needs strong safety language because sterile injectable preparation has added risk.",
  },
  {
    slug: "l-carnitine-injection-calculator",
    name: "L-Carnitine injection",
    description:
      "Open an L-Carnitine injection calculator page for mg, mL, concentration, and syringe mark math.",
    sourceLabel: "DailyMed Carnitor label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=cf801cc4-775e-433d-9d32-e5d9a98981d3",
    regulatoryNote:
      "DailyMed labeling for Carnitor identifies levocarnitine injection products such as 1 g per 5 mL. Use the exact product label and prescribed instructions before calculating.",
    searchAngle:
      "L-Carnitine injection calculator searches can bring non-peptide wellness traffic into the same clean syringe-math workflow.",
  },
  {
    slug: "vitamin-b12-injection-calculator",
    name: "Vitamin B12 injection",
    description:
      "Open a vitamin B12 injection calculator page for mcg per mL, dose volume, and syringe marks.",
    sourceLabel: "DailyMed cyanocobalamin label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=4cbc05f6-4b31-4a5f-e063-6394a90a676c",
    regulatoryNote:
      "DailyMed cyanocobalamin labeling includes 1,000 mcg/mL injection products. The calculator should be matched to the actual vial concentration and instructions.",
    searchAngle:
      "B12 injection calculator searches are broad and beginner-friendly, which makes this a useful traffic page for people learning syringe measurement basics.",
    exampleVialMg: 1,
    exampleWaterMl: 1,
    exampleDoseMcg: 1000,
  },
  {
    slug: "methylcobalamin-calculator",
    name: "Methylcobalamin",
    description:
      "Open a methylcobalamin calculator page for editable concentration, dose amount, and syringe mark math.",
    sourceLabel: "FDA 503A bulk substance list",
    sourceUrl: fda503aBulkListUrl,
    regulatoryNote:
      "FDA's April 22, 2026 503A bulk substance document lists methylcobalamin in category 1 under evaluation. Use this page only with verified product-specific instructions.",
    searchAngle:
      "Methylcobalamin calculator searches overlap with B12 injection traffic, giving the site another useful calculator landing page.",
  },
  {
    slug: "aod-9604-calculator",
    name: "AOD-9604",
    description:
      "Open a math-only AOD-9604 calculator page for vial strength, BAC water, concentration, and syringe marks.",
    sourceLabel: "FDA compounding safety review",
    sourceUrl: fdaCompoundingSafetyUrl,
    regulatoryNote:
      "FDA's compounding safety review discusses significant safety concerns and limited safety information for AOD-9604. This page does not provide a dose, protocol, or approval claim.",
    searchAngle:
      "AOD-9604 calculator searches can be served with a clearly limited calculator page that avoids treatment claims.",
  },
];

function formatNumber(value: number, maximumFractionDigits = 3) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

function formatMl(value: number) {
  return `${formatNumber(value, value < 1 ? 3 : 2)} mL`;
}

function formatMcg(value: number) {
  if (value >= 1000) {
    return `${formatNumber(value)} mcg / ${formatNumber(value / 1000, 3)} mg`;
  }

  return `${formatNumber(value)} mcg`;
}

function getOrdinalSuffix(value: number) {
  const lastTwo = value % 100;

  if (lastTwo >= 11 && lastTwo <= 13) {
    return "th";
  }

  switch (value % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

function formatSyringeMark(value: number) {
  const rounded = Math.round(value * 10) / 10;

  if (Number.isInteger(rounded)) {
    return `${rounded}${getOrdinalSuffix(rounded)} mark`;
  }

  return `${rounded.toFixed(1)} mark`;
}

function makeSeoExample({
  name,
  vialMg,
  waterMl,
  doseMcg,
  context,
}: {
  name: string;
  vialMg: number;
  waterMl: number;
  doseMcg: number;
  context: string;
}): SeoExample {
  const concentrationMcgMl = (vialMg * 1000) / waterMl;
  const doseVolumeMl = doseMcg / concentrationMcgMl;
  const syringeMark = doseVolumeMl * 100;

  return {
    title: `${name} calculator example`,
    intro: context,
    calculatorHref: makeExampleCalculatorHref({
      name,
      vialMg,
      waterMl,
      doseMcg,
    }),
    rows: [
      { label: "Vial amount", value: `${formatNumber(vialMg, 3)} mg total` },
      { label: "BAC water added", value: formatMl(waterMl) },
      { label: "Example dose", value: formatMcg(doseMcg) },
      {
        label: "Concentration",
        value: `${formatNumber(concentrationMcgMl)} mcg/mL`,
      },
      { label: "Liquid to draw", value: formatMl(doseVolumeMl) },
      { label: "U-100 syringe", value: formatSyringeMark(syringeMark) },
    ],
    result:
      `In this example, the visual syringe guide would point to the ${formatSyringeMark(
        syringeMark,
      )}. Change the vial, water, or dose values in the calculator to match the exact instructions you are using.`,
  };
}

function makeExampleCalculatorHref({
  name,
  vialMg,
  waterMl,
  doseMcg,
}: {
  name: string;
  vialMg: number;
  waterMl: number;
  doseMcg: number;
}) {
  const params = new URLSearchParams({
    compound: name,
    preset: "Example values",
    presetType: "math",
    vialMg: formatQueryNumber(vialMg),
    waterMl: formatQueryNumber(waterMl),
    doseMcg: formatQueryNumber(doseMcg),
  });

  return `/calculator?${params.toString()}`;
}

function formatQueryNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));
}

export const compoundSeoPages: SeoPage[] = [
  {
    slug: "semaglutide-calculator",
    title: "Free Semaglutide Calculator: Syringe Units",
    shortTitle: "Semaglutide",
    eyebrow: "Free syringe mark calculator",
    description:
      "Enter vial amount, BAC water, and dose to calculate semaglutide concentration, mL to draw, and U-100 syringe marks. Editable math only.",
    searchPhrase: "semaglutide calculator",
    ctaLabel: "Calculate semaglutide syringe mark",
    calculatorHref:
      "/calculator?compound=Semaglutide&preset=0.25+mg+starter+dose&presetType=reference&vialMg=5&waterMl=2&doseMcg=250",
    sourceLabel: "DailyMed Wegovy label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ee06186f-2aa3-4990-a760-757579d8f77b",
    example: makeSeoExample({
      name: "Semaglutide",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 250,
      context:
        "This example uses the editable starter reference values already loaded by the calculator. It is shown so users can understand how vial strength and BAC water become a syringe mark.",
    }),
    sections: [
      {
        title: "What this page does",
        body:
          "This semaglutide calculator opens an editable 0.25 mg reference preset. It shows the liquid volume, concentration, and U-100 syringe mark after you confirm your vial and BAC water amounts.",
      },
      {
        title: "How to use it safely",
        body:
          "Use the preset as math support only. Match every value to the product label, pharmacy instructions, or prescriber directions before relying on the result.",
      },
      {
        title: "Why it can rank",
        body:
          "People search for semaglutide calculator, semaglutide units, and semaglutide reconstitution math when they need a simple conversion tool. This page gives that search a direct, free calculator path.",
      },
    ],
    faqs: [
      {
        question: "What semaglutide value is preloaded?",
        answer:
          "The preset loads 250 mcg, which is 0.25 mg. It is editable and should be verified against the actual label or prescription instructions.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "Semaglutide reconstitution calculator", href: "/tools/semaglutide-reconstitution-calculator" },
      { label: "Tirzepatide calculator", href: "/peptides/tirzepatide-calculator" },
      { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
    ],
  },
  {
    slug: "tirzepatide-calculator",
    title: "Free Tirzepatide Calculator: Syringe Units",
    shortTitle: "Tirzepatide",
    eyebrow: "Free syringe mark calculator",
    description:
      "Enter vial amount, BAC water, and dose to calculate tirzepatide concentration, mL to draw, and U-100 syringe marks. Editable math only.",
    searchPhrase: "tirzepatide calculator",
    ctaLabel: "Calculate tirzepatide syringe mark",
    calculatorHref:
      "/calculator?compound=Tirzepatide&preset=2.5+mg+starter+dose&presetType=reference&vialMg=10&waterMl=2&doseMcg=2500",
    sourceLabel: "DailyMed Zepbound label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=487cd7e7-434c-4925-99fa-aa80b1cc776b",
    example: makeSeoExample({
      name: "Tirzepatide",
      vialMg: 10,
      waterMl: 2,
      doseMcg: 2500,
      context:
        "This example uses the editable starter reference values already loaded by the calculator. It is shown so users can see how mg, mcg, mL, and U-100 marks connect.",
    }),
    sections: [
      {
        title: "What this page does",
        body:
          "This tirzepatide calculator opens an editable 2.5 mg reference preset. It turns vial strength and BAC water into concentration, liquid volume, and U-100 syringe mark math.",
      },
      {
        title: "How to use it safely",
        body:
          "The calculator is not a protocol. Confirm your dose, vial amount, and mixing instructions with the product label, pharmacy, or prescriber.",
      },
      {
        title: "Why it can rank",
        body:
          "Searches around tirzepatide calculator, tirzepatide units, and vial math are high-intent because users want a quick answer. This page gives them a focused, free calculator entry point.",
      },
    ],
    faqs: [
      {
        question: "What tirzepatide value is preloaded?",
        answer:
          "The preset loads 2,500 mcg, which is 2.5 mg. It is editable and should be checked against the actual product instructions.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "Tirzepatide reconstitution calculator", href: "/tools/tirzepatide-reconstitution-calculator" },
      { label: "Semaglutide calculator", href: "/peptides/semaglutide-calculator" },
      { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
    ],
  },
  ...additionalCompoundSeoSeeds.map(makeCompoundSeoPage),
  ...mathOnlyCompoundSeoSeeds.map(makeMathOnlyCompoundSeoPage),
];

export const toolSeoPages: SeoPage[] = [
  {
    slug: "glp-1-dose-calculator",
    title: "Free GLP-1 Dose Calculator: Syringe Units",
    shortTitle: "GLP-1 dose",
    eyebrow: "Known dose to syringe mark math",
    description:
      "Enter a known GLP-1 vial amount, BAC water amount, and dose to calculate concentration, mL to draw, and U-100 syringe marks. Math only.",
    searchPhrase: "GLP-1 dose calculator",
    ctaLabel: "Calculate GLP-1 syringe mark",
    calculatorHref:
      "/calculator?compound=GLP-1+dose&preset=Known+dose+example&presetType=math&vialMg=5&waterMl=2&doseMcg=250",
    sourceLabel: "FDA GLP-1 safety concerns",
    sourceUrl: fdaGlp1ConcernsUrl,
    example: makeSeoExample({
      name: "GLP-1 dose",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 250,
      context:
        "This example shows how a known GLP-1 dose becomes concentration, liquid volume, and a U-100 syringe mark after the vial and BAC water values are entered.",
    }),
    sections: [
      {
        title: "What this page does",
        body:
          "This GLP-1 dose calculator translates known instructions into measurement math. It does not choose a dose, adjust a titration schedule, or decide whether a product is appropriate.",
      },
      {
        title: "Why verification matters",
        body:
          "FDA warns that dosing errors with compounded injectable semaglutide have caused adverse events, including some requiring hospitalization. Match every calculator value to a licensed prescriber, pharmacy, or product label.",
      },
      {
        title: "Best use",
        body:
          "Use this when you already know the exact dose, vial strength, diluent amount, and syringe type. The calculator then shows mL to draw and the U-100 mark.",
      },
    ],
    faqs: [
      {
        question: "Can this choose my GLP-1 dose?",
        answer:
          "No. It only converts a dose you already have into concentration, mL, and U-100 syringe mark math. Dose decisions must come from a licensed medical source.",
      },
      {
        question: "Can this verify compounded GLP-1 products?",
        answer:
          "No. The calculator cannot verify product quality, legality, sterility, storage, or whether a compound is appropriate. It only performs measurement math.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "GLP-1 reconstitution calculator", href: "/tools/glp-1-reconstitution-calculator" },
      { label: "Semaglutide calculator", href: "/peptides/semaglutide-calculator" },
      { label: "Tirzepatide calculator", href: "/peptides/tirzepatide-calculator" },
      { label: "CagriSema calculator", href: "/peptides/cagrisema-calculator" },
    ],
  },
  {
    slug: "glp-1-reconstitution-calculator",
    title: "Free GLP-1 Reconstitution Calculator",
    shortTitle: "GLP-1 reconstitution",
    eyebrow: "GLP-1 BAC water math",
    description:
      "Calculate GLP-1 concentration, mL to draw, and U-100 syringe marks after entering vial amount, BAC water, and a known dose. Math only.",
    searchPhrase: "GLP-1 reconstitution calculator",
    ctaLabel: "Calculate GLP-1 reconstitution",
    calculatorHref:
      "/calculator?compound=GLP-1+reconstitution&preset=GLP-1+reconstitution+example&presetType=math&vialMg=5&waterMl=2&doseMcg=250",
    sourceLabel: "FDA GLP-1 safety concerns",
    sourceUrl: fdaGlp1ConcernsUrl,
    example: makeSeoExample({
      name: "GLP-1 reconstitution",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 250,
      context:
        "This example shows how a known GLP-1 vial amount and BAC water amount create concentration, liquid volume, and a U-100 syringe mark for a known dose.",
    }),
    sections: [
      {
        title: "What this page does",
        body:
          "This GLP-1 reconstitution calculator starts with the values you already have: vial amount, BAC water amount, and known dose. It then calculates concentration, mL to draw, and U-100 syringe marks.",
      },
      {
        title: "Why the syringe mark changes",
        body:
          "A GLP-1 dose cannot be converted to syringe marks from the dose alone. The vial amount and BAC water volume set the concentration, and concentration decides the liquid volume.",
      },
      {
        title: "Safety limit",
        body:
          "FDA has warned about dosing errors with compounded injectable GLP-1 products. Use this page only for measurement math from a product label, pharmacy, or licensed prescriber; it does not choose a dose or mixing protocol.",
      },
    ],
    faqs: [
      {
        question: "Can this tell me how much BAC water to add?",
        answer:
          "No. Enter the exact BAC water amount from the product label, pharmacy, or licensed prescriber. PeptiCalc then calculates the concentration and syringe mark.",
      },
      {
        question: "Is this only for semaglutide or tirzepatide?",
        answer:
          "This page is a general GLP-1 measurement calculator. For more specific search paths, use the semaglutide and tirzepatide reconstitution pages.",
      },
      {
        question: "Can this choose or adjust a GLP-1 dose?",
        answer:
          "No. It only converts a known dose into measurement math. Dose selection, titration, route, and timing must come from a licensed medical source.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "GLP-1 dose calculator", href: "/tools/glp-1-dose-calculator" },
      { label: "Semaglutide reconstitution calculator", href: "/tools/semaglutide-reconstitution-calculator" },
      { label: "Tirzepatide reconstitution calculator", href: "/tools/tirzepatide-reconstitution-calculator" },
      { label: "Peptide reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
    ],
  },
  {
    slug: "semaglutide-reconstitution-calculator",
    title: "Free Semaglutide Reconstitution Calculator",
    shortTitle: "Semaglutide reconstitution",
    eyebrow: "Semaglutide BAC water math",
    description:
      "Calculate semaglutide concentration, mL to draw, and U-100 syringe marks after entering vial amount, BAC water, and a known dose. Math only.",
    searchPhrase: "semaglutide reconstitution calculator",
    ctaLabel: "Calculate semaglutide reconstitution",
    calculatorHref:
      "/calculator?compound=Semaglutide&preset=Semaglutide+reconstitution+example&presetType=reference&vialMg=5&waterMl=2&doseMcg=250",
    sourceLabel: "DailyMed Wegovy label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ee06186f-2aa3-4990-a760-757579d8f77b",
    example: makeSeoExample({
      name: "Semaglutide reconstitution",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 250,
      context:
        "This example shows how a known semaglutide amount changes after BAC water is entered. It converts the known dose into concentration, liquid volume, and a U-100 syringe mark.",
    }),
    sections: [
      {
        title: "What this page does",
        body:
          "This semaglutide reconstitution calculator starts with known values: vial strength, BAC water volume, and dose amount. It then calculates concentration, mL to draw, and U-100 syringe marks.",
      },
      {
        title: "Why results vary",
        body:
          "The syringe mark changes when the vial amount or BAC water amount changes. A 0.25 mg reference amount can land on different marks depending on concentration.",
      },
      {
        title: "Safety limit",
        body:
          "DailyMed labeling for Wegovy describes semaglutide product instructions. Use this calculator only for measurement math from a product label, pharmacy, or licensed prescriber; it does not create a protocol.",
      },
    ],
    faqs: [
      {
        question: "How much BAC water do I add to semaglutide?",
        answer:
          "PeptiCalc does not choose a BAC water amount. Enter the exact diluent volume from the product label, pharmacy, or licensed prescriber, then the calculator handles the math.",
      },
      {
        question: "How many units is 0.25 mg semaglutide after reconstitution?",
        answer:
          "It depends on vial strength and BAC water volume. In this example, 5 mg mixed with 2 mL and a 0.25 mg dose lands on the 10th U-100 mark.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "GLP-1 reconstitution calculator", href: "/tools/glp-1-reconstitution-calculator" },
      { label: "Semaglutide calculator", href: "/peptides/semaglutide-calculator" },
      { label: "Semaglutide units calculator", href: "/tools/semaglutide-units-calculator" },
      { label: "GLP-1 dose calculator", href: "/tools/glp-1-dose-calculator" },
      { label: "Peptide reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
    ],
  },
  {
    slug: "tirzepatide-reconstitution-calculator",
    title: "Free Tirzepatide Reconstitution Calculator",
    shortTitle: "Tirzepatide reconstitution",
    eyebrow: "Tirzepatide BAC water math",
    description:
      "Calculate tirzepatide concentration, mL to draw, and U-100 syringe marks after entering vial amount, BAC water, and a known dose. Math only.",
    searchPhrase: "tirzepatide reconstitution calculator",
    ctaLabel: "Calculate tirzepatide reconstitution",
    calculatorHref:
      "/calculator?compound=Tirzepatide&preset=Tirzepatide+reconstitution+example&presetType=reference&vialMg=10&waterMl=2&doseMcg=2500",
    sourceLabel: "DailyMed Zepbound label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=487cd7e7-434c-4925-99fa-aa80b1cc776b",
    example: makeSeoExample({
      name: "Tirzepatide reconstitution",
      vialMg: 10,
      waterMl: 2,
      doseMcg: 2500,
      context:
        "This example shows how a known tirzepatide amount becomes concentration, liquid volume, and a U-100 syringe mark after the vial and BAC water values are entered.",
    }),
    sections: [
      {
        title: "What this page does",
        body:
          "This tirzepatide reconstitution calculator starts with known values: vial strength, BAC water volume, and dose amount. It then calculates concentration, mL to draw, and U-100 syringe marks.",
      },
      {
        title: "Why results vary",
        body:
          "The syringe mark changes when the vial amount or BAC water amount changes. A 2.5 mg reference amount can land on different marks depending on concentration.",
      },
      {
        title: "Safety limit",
        body:
          "DailyMed labeling for Zepbound describes tirzepatide product instructions. Use this calculator only for measurement math from a product label, pharmacy, or licensed prescriber; it does not create a protocol.",
      },
    ],
    faqs: [
      {
        question: "How much BAC water do I add to tirzepatide?",
        answer:
          "PeptiCalc does not choose a BAC water amount. Enter the exact diluent volume from the product label, pharmacy, or licensed prescriber, then the calculator handles the math.",
      },
      {
        question: "How many units is 2.5 mg tirzepatide after reconstitution?",
        answer:
          "It depends on vial strength and BAC water volume. In this example, 10 mg mixed with 2 mL and a 2.5 mg dose lands on the 50th U-100 mark.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "GLP-1 reconstitution calculator", href: "/tools/glp-1-reconstitution-calculator" },
      { label: "Tirzepatide calculator", href: "/peptides/tirzepatide-calculator" },
      { label: "Tirzepatide units calculator", href: "/tools/tirzepatide-units-calculator" },
      { label: "GLP-1 dose calculator", href: "/tools/glp-1-dose-calculator" },
      { label: "Peptide reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
    ],
  },
  {
    slug: "mcg-to-units-calculator",
    title: "Free MCG to Units Calculator: U-100 Converter",
    shortTitle: "MCG to units",
    eyebrow: "Free U-100 syringe converter",
    description:
      "Enter vial amount, BAC water, and dose to convert mcg into mL and U-100 syringe marks. Simple peptide reconstitution math.",
    searchPhrase: "MCG to units calculator",
    ctaLabel: "Convert MCG to syringe units",
    calculatorHref: "/calculator",
    example: makeSeoExample({
      name: "MCG to units",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 250,
      context:
        "This example shows why mcg and syringe units are not interchangeable. The dose only becomes a syringe mark after vial strength and BAC water are included.",
    }),
    sections: [
      {
        title: "What this tool solves",
        body:
          "This MCG to units calculator makes the conversion easier: mcg and syringe units are not the same thing. It uses vial amount and BAC water to find concentration, then converts the selected mcg dose into U-100 syringe marks.",
      },
      {
        title: "When to use it",
        body:
          "Use it when you know the compound amount in the vial, the amount of BAC water added, and the target dose you need to convert into syringe marks.",
      },
      {
        title: "Important limit",
        body:
          "IU or unit wording can be confusing. On this site, IU mode is used as a U-100 syringe mark scale, not as a universal biological International Unit conversion.",
      },
    ],
    faqs: [
      {
        question: "Is 1 IU always the same as 1 mcg?",
        answer:
          "No. On PeptiCalc, IU mode means the U-100 syringe mark scale. The mcg value per mark depends on the vial amount and BAC water.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "Semaglutide calculator", href: "/peptides/semaglutide-calculator" },
      { label: "Tirzepatide calculator", href: "/peptides/tirzepatide-calculator" },
      { label: "Split compound calculator", href: "/tools/cjc-ipamorelin-split-calculator" },
    ],
  },
  {
    slug: "peptide-reconstitution-calculator",
    title: "Free Peptide Reconstitution Calculator",
    shortTitle: "Reconstitution",
    eyebrow: "BAC water and syringe math",
    description:
      "Calculate peptide concentration, dose volume, and U-100 syringe marks after adding BAC water to a vial. Editable calculator math only.",
    searchPhrase: "peptide reconstitution calculator",
    ctaLabel: "Calculate reconstitution math",
    calculatorHref: "/calculator",
    example: makeSeoExample({
      name: "Peptide reconstitution",
      vialMg: 10,
      waterMl: 2,
      doseMcg: 500,
      context:
        "This reconstitution example shows how total mg in the vial and BAC water determine the concentration before any syringe mark is calculated.",
    }),
    sections: [
      {
        title: "What this tool solves",
        body:
          "Reconstitution math starts with two values: total compound in the vial and BAC water added. From there, the calculator finds concentration and the liquid volume for the selected dose.",
      },
      {
        title: "What you need before calculating",
        body:
          "You need the vial amount, water amount, syringe size, and the target dose from a reliable instruction source.",
      },
      {
        title: "Why simple matters",
        body:
          "A clean reconstitution calculator reduces mental math and helps users see the syringe mark visually before they save or print anything.",
      },
    ],
    faqs: [
      {
        question: "Does adding more BAC water change the total peptide in the vial?",
        answer:
          "No. It changes concentration. More water usually means each syringe mark contains less compound.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
      { label: "Semaglutide calculator", href: "/peptides/semaglutide-calculator" },
      { label: "Tirzepatide calculator", href: "/peptides/tirzepatide-calculator" },
    ],
  },
  {
    slug: "cjc-ipamorelin-split-calculator",
    title: "Free CJC Ipamorelin Split Calculator",
    shortTitle: "CJC / Ipamorelin split",
    eyebrow: "Split compound math template",
    description:
      "Open a 50/50 split-compound calculator template for mixed-vial math, syringe marks, and per-compound dose breakdowns.",
    searchPhrase: "CJC ipamorelin split calculator",
    ctaLabel: "Open split dose calculator",
    calculatorHref:
      "/calculator?preset=50%2F50+split+math&presetType=math&vialMg=5&waterMl=2&doseMcg=100&split=CJC-1295%3A50%2CIpamorelin%3A50",
    example: makeSeoExample({
      name: "CJC ipamorelin split",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 100,
      context:
        "This split-vial example keeps the syringe mark calculation separate from the compound split. The total draw stays the same, then the app breaks the dose into each compound share.",
    }),
    sections: [
      {
        title: "What this tool solves",
        body:
          "Mixed vials can make a single syringe draw represent more than one compound. The split calculator keeps the syringe mark the same, then breaks the total dose into each compound share.",
      },
      {
        title: "Why it is math-only",
        body:
          "This page does not provide a CJC-1295 or ipamorelin protocol. It opens a 50/50 split math template that users can edit for measurement planning.",
      },
      {
        title: "How the breakdown works",
        body:
          "If a split adds to 100%, each compound receives that exact percentage of the total dose. If it does not, PeptiCalc normalizes the entered split to the full syringe draw.",
      },
    ],
    faqs: [
      {
        question: "Does this recommend a CJC or ipamorelin dose?",
        answer:
          "No. It only demonstrates split-vial math. Dose decisions should come from an appropriate licensed source and reviewed instructions.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
      { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
      { label: "Peptide library", href: "/peptides" },
    ],
  },
  {
    slug: "u100-syringe-units-calculator",
    title: "Free U-100 Syringe Units Calculator",
    shortTitle: "U-100 units",
    eyebrow: "Syringe mark calculator",
    description:
      "Convert peptide dose math into U-100 syringe marks after entering vial strength, BAC water, and target dose.",
    searchPhrase: "U-100 syringe units calculator",
    ctaLabel: "Calculate U-100 syringe marks",
    calculatorHref: "/calculator",
    example: makeSeoExample({
      name: "U-100 syringe units",
      vialMg: 5,
      waterMl: 1,
      doseMcg: 250,
      context:
        "This example shows how a U-100 mark is a volume marker. The amount at that mark depends on the concentration created by the vial and BAC water values.",
    }),
    sections: [
      {
        title: "What this tool solves",
        body:
          "U-100 syringes show 100 marks per mL. This tool connects those marks to your vial concentration so the visual guide can show where the plunger should stop.",
      },
      {
        title: "Why marks are not a dose by themselves",
        body:
          "A syringe mark only tells you volume. The amount of compound at that mark depends on how many mg are in the vial and how much BAC water was added.",
      },
      {
        title: "Best use",
        body:
          "Use it after you already know the exact vial amount, water amount, and target dose from a reliable instruction source.",
      },
    ],
    faqs: [
      {
        question: "Is a U-100 unit the same as an International Unit?",
        answer:
          "Not here. PeptiCalc uses the U-100 mark scale for syringe volume. True International Unit conversions must come from compound-specific labeling.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
      { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
      { label: "Peptide library", href: "/peptides" },
    ],
  },
  {
    slug: "ml-to-units-calculator",
    title: "Free mL to Units Calculator: U-100 Syringe",
    shortTitle: "mL to units",
    eyebrow: "U-100 volume conversion",
    description:
      "Convert mL into U-100 syringe marks and check how vial concentration changes the dose amount at that mark.",
    searchPhrase: "mL to units calculator",
    ctaLabel: "Convert mL to syringe units",
    calculatorHref:
      "/calculator?compound=mL+to+units&preset=0.25+mL+example&presetType=math&vialMg=5&waterMl=2&doseMcg=625",
    example: makeSeoExample({
      name: "mL to units",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 625,
      context:
        "This example creates a 0.25 mL draw, which lands on the 25th U-100 syringe mark. The calculator also shows how much compound that volume contains.",
    }),
    sections: [
      {
        title: "Simple U-100 rule",
        body:
          "On a U-100 syringe, 1 mL equals 100 marks. That means 0.25 mL is 25 marks and 0.5 mL is 50 marks.",
      },
      {
        title: "Why concentration still matters",
        body:
          "mL only tells you liquid volume. To know the compound amount in that volume, the calculator still needs vial strength and BAC water.",
      },
      {
        title: "Best use",
        body:
          "Use this page when your instructions mention mL but your syringe is marked on a U-100 scale.",
      },
    ],
    faqs: [
      {
        question: "How many U-100 units are in 0.25 mL?",
        answer:
          "On a U-100 syringe, 0.25 mL equals 25 syringe marks. The amount of compound at that mark depends on concentration.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "Units to mL calculator", href: "/tools/units-to-ml-calculator" },
      { label: "U-100 units calculator", href: "/tools/u100-syringe-units-calculator" },
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
    ],
  },
  {
    slug: "units-to-ml-calculator",
    title: "Free Units to mL Calculator: U-100 Syringe",
    shortTitle: "Units to mL",
    eyebrow: "Syringe marks to volume",
    description:
      "Convert U-100 syringe marks into mL and verify the dose amount using vial strength and BAC water.",
    searchPhrase: "units to mL calculator",
    ctaLabel: "Convert units to mL",
    calculatorHref:
      "/calculator?compound=Units+to+mL&preset=10+unit+example&presetType=math&vialMg=5&waterMl=2&doseMcg=250",
    example: makeSeoExample({
      name: "Units to mL",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 250,
      context:
        "This example shows a 10-mark U-100 syringe draw, which is 0.1 mL. PeptiCalc then connects that volume back to concentration and dose amount.",
    }),
    sections: [
      {
        title: "What units mean here",
        body:
          "This page uses units as U-100 syringe marks. It is a volume scale, not a universal International Unit conversion.",
      },
      {
        title: "Quick conversion",
        body:
          "Divide U-100 marks by 100 to get mL. Ten marks is 0.1 mL, 25 marks is 0.25 mL, and 50 marks is 0.5 mL.",
      },
      {
        title: "Dose check",
        body:
          "After the volume is known, vial amount and BAC water determine how many mcg or mg are actually in that draw.",
      },
    ],
    faqs: [
      {
        question: "How many mL is 10 units on a U-100 syringe?",
        answer:
          "Ten U-100 syringe marks equals 0.1 mL. The calculator can then show what dose amount that volume represents.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "mL to units calculator", href: "/tools/ml-to-units-calculator" },
      { label: "Units to MCG calculator", href: "/tools/units-to-mcg-calculator" },
      { label: "U-100 units calculator", href: "/tools/u100-syringe-units-calculator" },
    ],
  },
  {
    slug: "units-to-mcg-calculator",
    title: "Free Units to MCG Calculator",
    shortTitle: "Units to MCG",
    eyebrow: "Syringe marks to dose amount",
    description:
      "Convert U-100 syringe marks into mcg after entering vial strength, BAC water, and concentration math.",
    searchPhrase: "units to MCG calculator",
    ctaLabel: "Convert units to MCG",
    calculatorHref:
      "/calculator?compound=Units+to+MCG&preset=10+unit+example&presetType=math&vialMg=5&waterMl=2&doseMcg=250",
    example: makeSeoExample({
      name: "Units to MCG",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 250,
      context:
        "This example shows why a syringe mark cannot be converted to mcg until vial strength and BAC water are known.",
    }),
    sections: [
      {
        title: "The missing value",
        body:
          "A syringe mark only gives volume. To convert units to mcg, PeptiCalc first calculates concentration from vial amount and BAC water.",
      },
      {
        title: "Example logic",
        body:
          "If a 5 mg vial is mixed with 2 mL, the concentration is 2,500 mcg/mL. Ten U-100 marks is 0.1 mL, so that draw contains 250 mcg.",
      },
      {
        title: "Avoid the common mistake",
        body:
          "Do not treat one unit as one mcg. The mcg per mark changes whenever vial strength or BAC water changes.",
      },
    ],
    faqs: [
      {
        question: "Can units be converted to mcg directly?",
        answer:
          "Only after concentration is known. The same syringe mark can contain different mcg amounts depending on how the vial was mixed.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
      { label: "Units to mL calculator", href: "/tools/units-to-ml-calculator" },
      { label: "Peptide concentration calculator", href: "/tools/peptide-concentration-calculator" },
    ],
  },
  {
    slug: "peptide-concentration-calculator",
    title: "Free Peptide Concentration Calculator",
    shortTitle: "Concentration",
    eyebrow: "MG, mL, and mcg/mL math",
    description:
      "Calculate peptide concentration in mcg/mL after entering total vial amount and BAC water volume.",
    searchPhrase: "peptide concentration calculator",
    ctaLabel: "Calculate concentration",
    calculatorHref:
      "/calculator?compound=Concentration&preset=10+mg+in+2+mL&presetType=math&vialMg=10&waterMl=2&doseMcg=500",
    example: makeSeoExample({
      name: "Peptide concentration",
      vialMg: 10,
      waterMl: 2,
      doseMcg: 500,
      context:
        "This example shows a 10 mg vial mixed with 2 mL BAC water. The concentration is 5,000 mcg/mL before any dose volume is calculated.",
    }),
    sections: [
      {
        title: "Formula",
        body:
          "PeptiCalc converts total mg to mcg, then divides by BAC water in mL to get mcg per mL.",
      },
      {
        title: "Why it matters",
        body:
          "Concentration is the bridge between dose amount and liquid volume. It decides how many U-100 marks match the selected dose.",
      },
      {
        title: "Check before drawing",
        body:
          "Use the exact vial amount and diluent volume from the label, pharmacy, or prescriber instructions.",
      },
    ],
    faqs: [
      {
        question: "What is the concentration of 10 mg in 2 mL?",
        answer:
          "Ten mg equals 10,000 mcg. Divided by 2 mL, the concentration is 5,000 mcg/mL.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "BAC water calculator", href: "/tools/bac-water-calculator" },
      { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
    ],
  },
  {
    slug: "semaglutide-units-calculator",
    title: "Free Semaglutide Units Calculator",
    shortTitle: "Semaglutide units",
    eyebrow: "Semaglutide syringe math",
    description:
      "Convert semaglutide reference amounts into mL and U-100 syringe marks with editable vial and BAC water values.",
    searchPhrase: "semaglutide units calculator",
    ctaLabel: "Calculate semaglutide units",
    calculatorHref:
      "/calculator?compound=Semaglutide&preset=0.25+mg+starter+dose&presetType=reference&vialMg=5&waterMl=2&doseMcg=250",
    example: makeSeoExample({
      name: "Semaglutide units",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 250,
      context:
        "This example uses 0.25 mg as 250 mcg so users can see how a semaglutide reference amount becomes liquid volume and a U-100 mark.",
    }),
    sections: [
      {
        title: "What this page does",
        body:
          "It opens editable semaglutide calculator math for concentration, mL to draw, and U-100 syringe marks.",
      },
      {
        title: "Why units vary",
        body:
          "Semaglutide units on a syringe depend on vial strength and BAC water amount. Changing either value changes the mark.",
      },
      {
        title: "Safety limit",
        body:
          "Use this only to calculate measurement math from instructions you already have. It does not choose a dose or protocol.",
      },
    ],
    faqs: [
      {
        question: "How many units is 0.25 mg semaglutide?",
        answer:
          "It depends on concentration. In the example shown here, 0.25 mg equals 250 mcg and lands on the 10th U-100 mark.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "Semaglutide calculator", href: "/peptides/semaglutide-calculator" },
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
      { label: "Units to MCG calculator", href: "/tools/units-to-mcg-calculator" },
    ],
  },
  {
    slug: "tirzepatide-units-calculator",
    title: "Free Tirzepatide Units Calculator",
    shortTitle: "Tirzepatide units",
    eyebrow: "Tirzepatide syringe math",
    description:
      "Convert tirzepatide reference amounts into mL and U-100 syringe marks with editable vial and BAC water values.",
    searchPhrase: "tirzepatide units calculator",
    ctaLabel: "Calculate tirzepatide units",
    calculatorHref:
      "/calculator?compound=Tirzepatide&preset=2.5+mg+starter+dose&presetType=reference&vialMg=10&waterMl=2&doseMcg=2500",
    example: makeSeoExample({
      name: "Tirzepatide units",
      vialMg: 10,
      waterMl: 2,
      doseMcg: 2500,
      context:
        "This example uses 2.5 mg as 2,500 mcg so users can see how a tirzepatide reference amount becomes mL and a syringe mark.",
    }),
    sections: [
      {
        title: "What this page does",
        body:
          "It opens editable tirzepatide calculator math for vial strength, BAC water, dose volume, and U-100 syringe marks.",
      },
      {
        title: "Why units vary",
        body:
          "The same tirzepatide amount can land on a different syringe mark if the vial amount or BAC water volume changes.",
      },
      {
        title: "Safety limit",
        body:
          "This is calculator support only. Verify every value against the product label, pharmacy instructions, or prescriber directions.",
      },
    ],
    faqs: [
      {
        question: "How many units is 2.5 mg tirzepatide?",
        answer:
          "It depends on concentration. In the example shown here, 2.5 mg equals 2,500 mcg and lands on the 50th U-100 mark.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "Tirzepatide calculator", href: "/peptides/tirzepatide-calculator" },
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
      { label: "Units to MCG calculator", href: "/tools/units-to-mcg-calculator" },
    ],
  },
  {
    slug: "doses-per-vial-calculator",
    title: "Free Doses Per Vial Calculator",
    shortTitle: "Doses per vial",
    eyebrow: "Vial count estimate",
    description:
      "Estimate how many calculated doses are in a vial after entering vial strength, BAC water, and target dose.",
    searchPhrase: "doses per vial calculator",
    ctaLabel: "Estimate doses per vial",
    calculatorHref:
      "/calculator?compound=Doses+per+vial&preset=10+mg+vial+example&presetType=math&vialMg=10&waterMl=2&doseMcg=500",
    example: makeSeoExample({
      name: "Doses per vial",
      vialMg: 10,
      waterMl: 2,
      doseMcg: 500,
      context:
        "This example shows a 10 mg vial and a 500 mcg target dose. The calculator estimates 20 calculated doses before waste or dead space.",
    }),
    sections: [
      {
        title: "What this estimate means",
        body:
          "PeptiCalc divides total vial amount by the selected dose amount to estimate calculated doses per vial.",
      },
      {
        title: "What it does not include",
        body:
          "Real-world count can differ because of syringe dead space, priming, spills, product loss, or instructions that require discarding remaining liquid.",
      },
      {
        title: "Best use",
        body:
          "Use it for planning math after you already know the exact vial amount, BAC water amount, and dose instructions.",
      },
    ],
    faqs: [
      {
        question: "How many 500 mcg doses are in a 10 mg vial?",
        answer:
          "Ten mg equals 10,000 mcg. Divided by 500 mcg, that is 20 calculated doses before waste or dead space.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "Peptide dosage calculator", href: "/tools/peptide-dosage-calculator" },
      { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
      { label: "BAC water calculator", href: "/tools/bac-water-calculator" },
    ],
  },
  {
    slug: "mg-to-mcg-calculator",
    title: "Free MG to MCG Calculator",
    shortTitle: "MG to MCG",
    eyebrow: "Simple unit conversion",
    description:
      "Convert mg to mcg and prepare peptide calculator values for vial strength, dose math, and syringe mark conversion.",
    searchPhrase: "MG to MCG calculator",
    ctaLabel: "Convert MG to MCG",
    calculatorHref: "/calculator",
    example: makeSeoExample({
      name: "MG to MCG",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 250,
      context:
        "This example uses 0.25 mg as 250 mcg so users can see how the mg-to-mcg conversion fits into the larger syringe calculation.",
    }),
    sections: [
      {
        title: "Simple conversion",
        body:
          "One mg equals 1,000 mcg. The calculator uses mcg internally for dose math because many peptide doses are small enough that mcg is clearer.",
      },
      {
        title: "Where it fits",
        body:
          "Use mg for total vial amount and mcg for target dose when that matches the product label or pharmacy instructions.",
      },
      {
        title: "Common mistake",
        body:
          "Do not confuse mg, mcg, mL, and syringe marks. They answer different questions: amount, smaller amount, liquid volume, and syringe position.",
      },
    ],
    faqs: [
      {
        question: "How many mcg are in 0.25 mg?",
        answer:
          "0.25 mg equals 250 mcg. Always check the decimal point before entering values into a calculator.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
      { label: "U-100 units calculator", href: "/tools/u100-syringe-units-calculator" },
      { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
    ],
  },
  {
    slug: "bac-water-calculator",
    title: "Free BAC Water Calculator",
    shortTitle: "BAC water",
    eyebrow: "BAC water concentration math",
    description:
      "See how BAC water amount changes peptide concentration, dose volume, and U-100 syringe marks before you draw.",
    searchPhrase: "BAC water calculator",
    ctaLabel: "Calculate BAC water math",
    calculatorHref: "/calculator",
    example: makeSeoExample({
      name: "BAC water",
      vialMg: 10,
      waterMl: 5,
      doseMcg: 500,
      context:
        "This example shows how adding more BAC water lowers concentration, which changes the mL to draw and the U-100 syringe mark.",
    }),
    sections: [
      {
        title: "What BAC water changes",
        body:
          "BAC water changes concentration, not the total amount of compound in the vial. More water spreads the same compound over more liquid.",
      },
      {
        title: "Why concentration matters",
        body:
          "Concentration tells the calculator how many mcg are in each mL. That is what turns a target dose into a syringe mark.",
      },
      {
        title: "Before using it",
        body:
          "Confirm the correct diluent, volume, storage, and beyond-use instructions with the product label, pharmacy, or prescriber.",
      },
    ],
    faqs: [
      {
        question: "Does more BAC water make a dose stronger?",
        answer:
          "No. More BAC water lowers concentration. The dose amount stays based on how much compound you draw, not just the liquid volume.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
      { label: "U-100 units calculator", href: "/tools/u100-syringe-units-calculator" },
      { label: "Peptide library", href: "/peptides" },
    ],
  },
  {
    slug: "peptide-dosage-calculator",
    title: "Free Peptide Dosage Calculator",
    shortTitle: "Dosage math",
    eyebrow: "Dose to syringe mark math",
    description:
      "Translate known peptide instructions into concentration, dose volume, and U-100 syringe marks. Calculator math only.",
    searchPhrase: "peptide dosage calculator",
    ctaLabel: "Calculate peptide syringe mark",
    calculatorHref: "/calculator",
    example: makeSeoExample({
      name: "Peptide dosage",
      vialMg: 5,
      waterMl: 2,
      doseMcg: 250,
      context:
        "This example translates a known dose into calculator math. It does not choose the dose; it only shows how a known dose becomes liquid volume and a syringe mark.",
    }),
    sections: [
      {
        title: "What this calculator does",
        body:
          "It helps convert known dose instructions into measurement math. It does not decide what dose is appropriate for a person.",
      },
      {
        title: "What you enter",
        body:
          "Enter syringe size, total mg in the vial, BAC water amount, and the dose amount from your instructions.",
      },
      {
        title: "What you get",
        body:
          "PeptiCalc shows dose volume, concentration, dose amount, mcg per mark, and a visual syringe guide.",
      },
    ],
    faqs: [
      {
        question: "Can this build a personalized peptide dosage plan?",
        answer:
          "No. It can format and calculate measurement math from existing instructions. Personalized dosing should come from a licensed source.",
      },
      ...sharedCalculatorFaqs,
    ],
    related: [
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
      { label: "BAC water calculator", href: "/tools/bac-water-calculator" },
      { label: "Peptide library", href: "/peptides" },
    ],
  },
];

function makeCompoundSeoPage(seed: CompoundSeoSeed): SeoPage {
  const doseLabel = seed.doseLabel.toLowerCase();

  return {
    slug: seed.slug,
    title: `Free ${seed.name} Calculator: Syringe Units`,
    shortTitle: seed.name,
    eyebrow: "Free syringe mark calculator",
    description:
      `Enter vial amount, BAC water, and dose to calculate ${seed.name} concentration, mL to draw, and U-100 syringe marks. Editable math only.`,
    searchPhrase: `${seed.name} calculator`,
    ctaLabel: `Calculate ${seed.name} syringe mark`,
    calculatorHref: `/calculator?compound=${encodeURIComponent(
      seed.name,
    )}&preset=${encodeURIComponent(seed.doseLabel)}&presetType=reference&vialMg=${
      seed.vialMg
    }&waterMl=${seed.waterMl}&doseMcg=${seed.doseMcg}`,
    sourceLabel: seed.sourceLabel,
    sourceUrl: seed.sourceUrl,
    example: makeSeoExample({
      name: seed.name,
      vialMg: seed.vialMg,
      waterMl: seed.waterMl,
      doseMcg: seed.doseMcg,
      context:
        `This example uses the editable ${seed.doseLabel.toLowerCase()} preset so users can see how the calculator turns a reference amount into concentration, volume, and a syringe mark.`,
    }),
    sections: [
      {
        title: "What this page does",
        body:
          `This ${seed.name} calculator opens an editable ${doseLabel}. It turns vial strength and BAC water into concentration, liquid volume, and a U-100 syringe mark.`,
      },
      {
        title: "How to use it safely",
        body:
          `${seed.frequencyNote} Verify every calculator value against the product label, pharmacy instructions, or prescriber directions before use.`,
      },
      {
        title: "Why it can rank",
        body:
          `People search for ${seed.name.toLowerCase()} calculator, units, reconstitution, and syringe math when they need a simple conversion tool. This page gives that search a direct, free calculator path.`,
      },
    ],
    faqs: [
      {
        question: `What ${seed.name} value is preloaded?`,
        answer:
          `The preset loads ${seed.doseLabel}. It is editable and should be verified against the actual product label or prescription instructions.`,
      },
      ...sharedCalculatorFaqs,
    ],
    related:
      seed.related ?? [
        { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
        { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
        { label: "Peptide library", href: "/peptides" },
      ],
  };
}

function makeMathOnlyCompoundSeoPage(seed: MathOnlyCompoundSeoSeed): SeoPage {
  const exampleVialMg = seed.exampleVialMg ?? 5;
  const exampleWaterMl = seed.exampleWaterMl ?? 2;
  const exampleDoseMcg = seed.exampleDoseMcg ?? 250;

  return {
    slug: seed.slug,
    title: `Free ${seed.name} Calculator: Syringe Units`,
    shortTitle: seed.name,
    eyebrow: "Free reconstitution calculator",
    description:
      `Enter vial amount, BAC water, and dose to calculate ${seed.name} concentration, mL to draw, and U-100 syringe marks. Math-only, not a protocol.`,
    searchPhrase: `${seed.name} calculator`,
    ctaLabel: `Calculate ${seed.name} syringe mark`,
    calculatorHref: `/calculator?compound=${encodeURIComponent(
      seed.name,
    )}&preset=${encodeURIComponent("Custom math only")}&presetType=math`,
    sourceLabel: seed.sourceLabel,
    sourceUrl: seed.sourceUrl,
    example: makeSeoExample({
      name: seed.name,
      vialMg: exampleVialMg,
      waterMl: exampleWaterMl,
      doseMcg: exampleDoseMcg,
      context:
        `This is a sample ${seed.name} calculator walkthrough for measurement math only. Replace every example value with the vial, BAC water, and dose values from a verified instruction source.`,
    }),
    sections: [
      {
        title: "What this page does",
        body:
          `This ${seed.name} calculator opens an editable math template. Enter the vial amount, BAC water amount, and dose amount from your verified instructions, then PeptiCalc shows concentration, liquid volume, and U-100 syringe marks.`,
      },
      {
        title: "Important safety limit",
        body: seed.regulatoryNote,
      },
      {
        title: "Why it can rank",
        body: seed.searchAngle,
      },
    ],
    faqs: [
      {
        question: `Does this recommend a ${seed.name} dose?`,
        answer:
          "No. It opens editable calculator math only. Dose, route, timing, and whether a product is appropriate must come from the product label, pharmacy, or licensed prescriber.",
      },
      {
        question: "Can I use this for research-only products?",
        answer:
          "The calculator only handles measurement math. It does not decide whether a product is legal, approved, safe, sterile, or appropriate for human use.",
      },
      ...sharedCalculatorFaqs,
    ],
    related:
      seed.related ?? [
        { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
        { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
        { label: "Peptide library", href: "/peptides" },
      ],
  };
}

export function getCompoundSeoPage(slug: string) {
  return compoundSeoPages.find((page) => page.slug === slug);
}

export function getToolSeoPage(slug: string) {
  return toolSeoPages.find((page) => page.slug === slug);
}

export function getPrimaryCalculatorHref(page: SeoPage) {
  return isCalculatorHrefMissingInputs(page.calculatorHref) && page.example
    ? page.example.calculatorHref
    : page.calculatorHref;
}

function isCalculatorHrefMissingInputs(href: string) {
  const [pathname, query = ""] = href.split("?");

  if (pathname !== "/calculator") {
    return false;
  }

  const params = new URLSearchParams(query);
  const hasVial = params.has("vialMg") || params.has("vialIu");
  const hasDose = params.has("doseMcg") || params.has("doseIu");

  return !hasVial || !params.has("waterMl") || !hasDose;
}
