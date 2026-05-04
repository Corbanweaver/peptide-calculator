export type CompoundStatus =
  | "fda_approved_rx"
  | "approved_compounding_concern"
  | "restricted_reference"
  | "research_unapproved";

export type Compound = {
  id: string;
  name: string;
  aliases: string[];
  category: string;
  status: CompoundStatus;
  legalSummary: string;
  route: string;
  protocolEligible: boolean;
  iuSupport:
    | {
        kind: "custom";
        note: string;
      }
    | {
        kind: "none";
        note: string;
      };
  referenceNote: string;
  sourceLabel: string;
  sourceUrl: string;
};

export const sourceLinks = [
  {
    label: "FDA 503A bulk substances",
    url: "https://www.fda.gov/drugs/human-drug-compounding/bulk-drug-substances-used-compounding-under-section-503a-fdc-act",
  },
  {
    label: "FDA compounded semaglutide dosing error alert",
    url: "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded",
  },
  {
    label: "FDA April 30, 2026 503B proposal",
    url: "https://www.fda.gov/news-events/press-announcements/fda-proposes-exclude-semaglutide-tirzepatide-and-liraglutide-503b-bulks-list",
  },
  {
    label: "FDA 503A category PDF updated April 22, 2026",
    url: "https://www.fda.gov/media/94155/download?attachment=",
  },
  {
    label: "Drugs@FDA approved drug resources",
    url: "https://www.fda.gov/drugs/drug-approvals-and-databases/resources-information-approved-drugs",
  },
];

export const compounds: Compound[] = [
  {
    id: "semaglutide",
    name: "Semaglutide",
    aliases: ["Wegovy", "Ozempic", "Rybelsus", "GLP-1"],
    category: "GLP-1 receptor agonist",
    status: "approved_compounding_concern",
    legalSummary:
      "FDA-approved prescription products exist. Compounded products can vary in concentration and have been associated with dosing errors.",
    route: "Injection pens and oral tablets, depending on product",
    protocolEligible: true,
    iuSupport: {
      kind: "none",
      note: "Semaglutide is labeled in mass units, not IU. Convert only mg, mcg, mL, and syringe units.",
    },
    referenceNote:
      "Use the protocol builder only from a clinician-provided dose and pharmacy concentration.",
    sourceLabel: "FDA semaglutide dosing error alert",
    sourceUrl:
      "https://www.fda.gov/drugs/human-drug-compounding/fda-alerts-health-care-providers-compounders-and-patients-dosing-errors-associated-compounded",
  },
  {
    id: "tirzepatide",
    name: "Tirzepatide",
    aliases: ["Mounjaro", "Zepbound", "GIP", "GLP-1"],
    category: "GIP/GLP-1 receptor agonist",
    status: "approved_compounding_concern",
    legalSummary:
      "FDA-approved prescription products exist. FDA proposed excluding tirzepatide from the 503B bulks list on April 30, 2026.",
    route: "Subcutaneous injection",
    protocolEligible: true,
    iuSupport: {
      kind: "none",
      note: "Tirzepatide is labeled in mass units, not IU.",
    },
    referenceNote:
      "The app can format a prescribed plan; it does not select a starting dose or escalation schedule.",
    sourceLabel: "FDA 503B proposal",
    sourceUrl:
      "https://www.fda.gov/news-events/press-announcements/fda-proposes-exclude-semaglutide-tirzepatide-and-liraglutide-503b-bulks-list",
  },
  {
    id: "liraglutide",
    name: "Liraglutide",
    aliases: ["Saxenda", "Victoza", "GLP-1"],
    category: "GLP-1 receptor agonist",
    status: "approved_compounding_concern",
    legalSummary:
      "FDA-approved prescription products exist. FDA proposed excluding liraglutide from the 503B bulks list on April 30, 2026.",
    route: "Subcutaneous injection",
    protocolEligible: true,
    iuSupport: {
      kind: "none",
      note: "Liraglutide is labeled in mass units, not IU.",
    },
    referenceNote:
      "Build schedules only from a prescription, label, or pharmacist-verified instructions.",
    sourceLabel: "FDA 503B proposal",
    sourceUrl:
      "https://www.fda.gov/news-events/press-announcements/fda-proposes-exclude-semaglutide-tirzepatide-and-liraglutide-503b-bulks-list",
  },
  {
    id: "insulin-lispro",
    name: "Insulin lispro",
    aliases: ["Humalog", "Admelog", "insulin", "U-100"],
    category: "Insulin analog peptide hormone",
    status: "fda_approved_rx",
    legalSummary:
      "FDA-approved prescription insulin products are legal when dispensed under applicable federal and state law.",
    route: "Subcutaneous injection or pump, depending on product",
    protocolEligible: true,
    iuSupport: {
      kind: "custom",
      note: "Insulin products are labeled in units. Enter the product-specific potency or use the label concentration.",
    },
    referenceNote:
      "Insulin plans are high-risk; this tool only formats existing clinician instructions.",
    sourceLabel: "Drugs@FDA resources",
    sourceUrl:
      "https://www.fda.gov/drugs/drug-approvals-and-databases/resources-information-approved-drugs",
  },
  {
    id: "glucagon",
    name: "Glucagon",
    aliases: ["Gvoke", "Baqsimi", "GlucaGen"],
    category: "Peptide hormone",
    status: "fda_approved_rx",
    legalSummary:
      "FDA-approved prescription glucagon products are available for indicated uses.",
    route: "Injection or nasal powder, depending on product",
    protocolEligible: true,
    iuSupport: {
      kind: "none",
      note: "Common glucagon products are labeled in mass units, not IU.",
    },
    referenceNote:
      "Emergency-use products should be used exactly as labeled and prescribed.",
    sourceLabel: "Drugs@FDA resources",
    sourceUrl:
      "https://www.fda.gov/drugs/drug-approvals-and-databases/resources-information-approved-drugs",
  },
  {
    id: "teriparatide",
    name: "Teriparatide",
    aliases: ["Forteo", "Bonsity", "PTH"],
    category: "Parathyroid hormone analog",
    status: "fda_approved_rx",
    legalSummary:
      "FDA-approved prescription teriparatide products are available for indicated uses.",
    route: "Subcutaneous injection",
    protocolEligible: true,
    iuSupport: {
      kind: "none",
      note: "Teriparatide is labeled in mass units, not IU.",
    },
    referenceNote:
      "Follow the product label and prescriber instructions for duration and monitoring.",
    sourceLabel: "Drugs@FDA resources",
    sourceUrl:
      "https://www.fda.gov/drugs/drug-approvals-and-databases/resources-information-approved-drugs",
  },
  {
    id: "desmopressin",
    name: "Desmopressin",
    aliases: ["DDAVP", "Noctiva", "Stimate"],
    category: "Vasopressin analog",
    status: "fda_approved_rx",
    legalSummary:
      "FDA-approved prescription desmopressin products are available in multiple dosage forms.",
    route: "Tablet, nasal, injection, or sublingual forms, depending on product",
    protocolEligible: true,
    iuSupport: {
      kind: "none",
      note: "Desmopressin is labeled in mass units, not IU.",
    },
    referenceNote:
      "Dose timing and fluid restrictions require clinician guidance.",
    sourceLabel: "Drugs@FDA resources",
    sourceUrl:
      "https://www.fda.gov/drugs/drug-approvals-and-databases/resources-information-approved-drugs",
  },
  {
    id: "octreotide",
    name: "Octreotide",
    aliases: ["Sandostatin", "somatostatin analog"],
    category: "Somatostatin analog",
    status: "fda_approved_rx",
    legalSummary:
      "FDA-approved prescription octreotide products are available for indicated uses.",
    route: "Subcutaneous, intravenous, or long-acting injection, depending on product",
    protocolEligible: true,
    iuSupport: {
      kind: "none",
      note: "Octreotide is labeled in mass units, not IU.",
    },
    referenceNote:
      "Long-acting formulations have different handling rules than short-acting vials.",
    sourceLabel: "Drugs@FDA resources",
    sourceUrl:
      "https://www.fda.gov/drugs/drug-approvals-and-databases/resources-information-approved-drugs",
  },
  {
    id: "leuprolide",
    name: "Leuprolide",
    aliases: ["Lupron", "Eligard", "GnRH analog"],
    category: "GnRH agonist peptide analog",
    status: "fda_approved_rx",
    legalSummary:
      "FDA-approved prescription leuprolide products are available for indicated uses.",
    route: "Injection or implant, depending on product",
    protocolEligible: true,
    iuSupport: {
      kind: "none",
      note: "Leuprolide is labeled in mass units, not IU.",
    },
    referenceNote:
      "Depot products cannot be modeled like simple reconstituted multi-dose vials.",
    sourceLabel: "Drugs@FDA resources",
    sourceUrl:
      "https://www.fda.gov/drugs/drug-approvals-and-databases/resources-information-approved-drugs",
  },
  {
    id: "bpc-157",
    name: "BPC-157",
    aliases: ["BPC157", "BPC-157 acetate"],
    category: "Research peptide",
    status: "research_unapproved",
    legalSummary:
      "Not an FDA-approved drug. FDA removed prior 503A category status after nominations were withdrawn and announced PCAC review for BPC-157-related substances.",
    route: "Not approved for human use",
    protocolEligible: false,
    iuSupport: {
      kind: "none",
      note: "No FDA-approved IU conversion or dosing protocol is available.",
    },
    referenceNote:
      "This app does not generate protocols for unapproved research compounds.",
    sourceLabel: "FDA 503A category PDF",
    sourceUrl: "https://www.fda.gov/media/94155/download?attachment=",
  },
  {
    id: "kisspeptin-10",
    name: "Kisspeptin-10",
    aliases: ["kisspeptin"],
    category: "Research peptide",
    status: "restricted_reference",
    legalSummary:
      "Listed by FDA as a 503A category 2 substance that raises significant safety risks.",
    route: "Not approved for routine human use",
    protocolEligible: false,
    iuSupport: {
      kind: "none",
      note: "No FDA-approved IU conversion or dosing protocol is available.",
    },
    referenceNote:
      "The protocol builder is disabled for this compound.",
    sourceLabel: "FDA 503A category PDF",
    sourceUrl: "https://www.fda.gov/media/94155/download?attachment=",
  },
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    aliases: ["copper peptide", "GHK copper"],
    category: "Cosmetic/research peptide",
    status: "research_unapproved",
    legalSummary:
      "FDA removed prior 503A category status after nominations were withdrawn and announced future PCAC consultation.",
    route: "Depends on formulation; injectable routes are not FDA-approved",
    protocolEligible: false,
    iuSupport: {
      kind: "none",
      note: "No FDA-approved IU conversion or dosing protocol is available.",
    },
    referenceNote:
      "This app does not generate injectable protocols for this compound.",
    sourceLabel: "FDA 503A category PDF",
    sourceUrl: "https://www.fda.gov/media/94155/download?attachment=",
  },
  {
    id: "ll-37",
    name: "Cathelicidin LL-37",
    aliases: ["LL-37"],
    category: "Research peptide",
    status: "research_unapproved",
    legalSummary:
      "FDA removed prior 503A category status after the nomination was withdrawn and announced future PCAC consultation.",
    route: "Not approved for human use",
    protocolEligible: false,
    iuSupport: {
      kind: "none",
      note: "No FDA-approved IU conversion or dosing protocol is available.",
    },
    referenceNote:
      "This app does not generate protocols for unapproved research compounds.",
    sourceLabel: "FDA 503A category PDF",
    sourceUrl: "https://www.fda.gov/media/94155/download?attachment=",
  },
];

export function getStatusLabel(status: CompoundStatus) {
  switch (status) {
    case "fda_approved_rx":
      return "FDA-approved Rx";
    case "approved_compounding_concern":
      return "Approved product, compounding concern";
    case "restricted_reference":
      return "Restricted reference";
    case "research_unapproved":
      return "Research/unapproved";
  }
}

export function getCompoundById(id: string) {
  return compounds.find((compound) => compound.id === id) ?? compounds[0];
}
