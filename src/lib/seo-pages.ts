export type SeoFaq = {
  question: string;
  answer: string;
};

export type SeoPage = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  calculatorHref: string;
  sourceLabel?: string;
  sourceUrl?: string;
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

export const compoundSeoPages: SeoPage[] = [
  {
    slug: "semaglutide-calculator",
    title: "Semaglutide Calculator",
    shortTitle: "Semaglutide",
    eyebrow: "Preloaded reference calculator",
    description:
      "Open an editable semaglutide calculator preset for vial amount, BAC water, dose math, and U-100 syringe marks.",
    calculatorHref:
      "/calculator?compound=Semaglutide&preset=0.25+mg+starter+dose&presetType=reference&vialMg=5&waterMl=2&doseMcg=250",
    sourceLabel: "DailyMed Wegovy label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=ee06186f-2aa3-4990-a760-757579d8f77b",
    sections: [
      {
        title: "What this page does",
        body:
          "This page opens a semaglutide calculator preset using an editable 0.25 mg reference dose. The calculator shows the liquid volume, concentration, and syringe mark after you confirm your vial and BAC water amounts.",
      },
      {
        title: "How to use it safely",
        body:
          "Use the preset as math support only. Match every value to the product label, pharmacy instructions, or prescriber directions before relying on the result.",
      },
      {
        title: "Why it can rank",
        body:
          "People search for semaglutide calculator, semaglutide units, and semaglutide reconstitution math when they need a simple conversion tool. This page gives that search a direct calculator path.",
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
      { label: "Tirzepatide calculator", href: "/peptides/tirzepatide-calculator" },
      { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
    ],
  },
  {
    slug: "tirzepatide-calculator",
    title: "Tirzepatide Calculator",
    shortTitle: "Tirzepatide",
    eyebrow: "Preloaded reference calculator",
    description:
      "Open an editable tirzepatide calculator preset for vial amount, BAC water, dose math, and U-100 syringe marks.",
    calculatorHref:
      "/calculator?compound=Tirzepatide&preset=2.5+mg+starter+dose&presetType=reference&vialMg=10&waterMl=2&doseMcg=2500",
    sourceLabel: "DailyMed Zepbound label",
    sourceUrl:
      "https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=487cd7e7-434c-4925-99fa-aa80b1cc776b",
    sections: [
      {
        title: "What this page does",
        body:
          "This page opens a tirzepatide calculator preset using an editable 2.5 mg reference dose. The calculator turns vial strength and BAC water into concentration, volume, and syringe mark math.",
      },
      {
        title: "How to use it safely",
        body:
          "The calculator is not a protocol. Confirm your dose, vial amount, and mixing instructions with the product label, pharmacy, or prescriber.",
      },
      {
        title: "Why it can rank",
        body:
          "Searches around tirzepatide units and vial math are high-intent because users want a quick answer. This page gives them a focused calculator entry point.",
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
      { label: "Semaglutide calculator", href: "/peptides/semaglutide-calculator" },
      { label: "Reconstitution calculator", href: "/tools/peptide-reconstitution-calculator" },
      { label: "MCG to units calculator", href: "/tools/mcg-to-units-calculator" },
    ],
  },
  ...additionalCompoundSeoSeeds.map(makeCompoundSeoPage),
];

export const toolSeoPages: SeoPage[] = [
  {
    slug: "mcg-to-units-calculator",
    title: "MCG to Units Calculator",
    shortTitle: "MCG to units",
    eyebrow: "Peptide calculator tool",
    description:
      "Convert a selected mcg amount into U-100 syringe marks after entering vial strength and BAC water.",
    calculatorHref: "/calculator",
    sections: [
      {
        title: "What this tool solves",
        body:
          "MCG and syringe units are not the same thing. The calculator uses vial amount and BAC water to find concentration, then converts the selected mcg dose into U-100 syringe marks.",
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
    title: "Peptide Reconstitution Calculator",
    shortTitle: "Reconstitution",
    eyebrow: "Peptide calculator tool",
    description:
      "Calculate peptide concentration and syringe volume after adding BAC water to a vial.",
    calculatorHref: "/calculator",
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
    title: "CJC Ipamorelin Split Calculator",
    shortTitle: "CJC / Ipamorelin split",
    eyebrow: "Split compound math template",
    description:
      "Open a 50/50 split-compound calculator template for mixed-vial math and per-compound dose breakdowns.",
    calculatorHref:
      "/calculator?preset=50%2F50+split+math&presetType=math&vialMg=5&waterMl=2&doseMcg=100&split=CJC-1295%3A50%2CIpamorelin%3A50",
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
    title: "U-100 Syringe Units Calculator",
    shortTitle: "U-100 units",
    eyebrow: "Peptide calculator tool",
    description:
      "Convert peptide dose math into U-100 syringe marks after entering vial strength and BAC water.",
    calculatorHref: "/calculator",
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
    slug: "mg-to-mcg-calculator",
    title: "MG to MCG Calculator",
    shortTitle: "MG to MCG",
    eyebrow: "Peptide calculator tool",
    description:
      "Convert between mg and mcg while preparing peptide calculator values for vial and dose math.",
    calculatorHref: "/calculator",
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
    title: "BAC Water Calculator",
    shortTitle: "BAC water",
    eyebrow: "Peptide calculator tool",
    description:
      "See how BAC water amount changes concentration, dose volume, and syringe marks.",
    calculatorHref: "/calculator",
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
    title: "Peptide Dosage Calculator",
    shortTitle: "Dosage math",
    eyebrow: "Peptide calculator tool",
    description:
      "Use peptide dosage math to translate known instructions into concentration, volume, and syringe marks.",
    calculatorHref: "/calculator",
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
    title: `${seed.name} Calculator`,
    shortTitle: seed.name,
    eyebrow: "Preloaded reference calculator",
    description: seed.description,
    calculatorHref: `/calculator?compound=${encodeURIComponent(
      seed.name,
    )}&preset=${encodeURIComponent(seed.doseLabel)}&presetType=reference&vialMg=${
      seed.vialMg
    }&waterMl=${seed.waterMl}&doseMcg=${seed.doseMcg}`,
    sourceLabel: seed.sourceLabel,
    sourceUrl: seed.sourceUrl,
    sections: [
      {
        title: "What this page does",
        body:
          `This page opens a ${seed.name} calculator preset using an editable ${doseLabel}. The calculator turns vial strength and BAC water into concentration, liquid volume, and a U-100 syringe mark.`,
      },
      {
        title: "How to use it safely",
        body:
          `${seed.frequencyNote} Verify every calculator value against the product label, pharmacy instructions, or prescriber directions before use.`,
      },
      {
        title: "Why it can rank",
        body:
          `People search for ${seed.name.toLowerCase()} calculator, units, reconstitution, and syringe math when they need a simple conversion tool. This page gives that search a direct calculator path.`,
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

export function getCompoundSeoPage(slug: string) {
  return compoundSeoPages.find((page) => page.slug === slug);
}

export function getToolSeoPage(slug: string) {
  return toolSeoPages.find((page) => page.slug === slug);
}
