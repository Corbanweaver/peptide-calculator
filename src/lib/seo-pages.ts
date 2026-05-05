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
];

export function getCompoundSeoPage(slug: string) {
  return compoundSeoPages.find((page) => page.slug === slug);
}

export function getToolSeoPage(slug: string) {
  return toolSeoPages.find((page) => page.slug === slug);
}
