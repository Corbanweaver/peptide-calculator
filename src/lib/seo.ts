type JsonLdValue =
  | string
  | number
  | boolean
  | null
  | JsonLdValue[]
  | { [key: string]: JsonLdValue };

export type JsonLdObject = { [key: string]: JsonLdValue };

export const siteUrl =
  (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://peptidecalculator.co"
  ).replace(/\/+$/, "");

export const sitemapLastModified = new Date("2026-05-28T00:00:00.000Z");

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

export function jsonLd(data: JsonLdObject | JsonLdObject[]) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function breadcrumbJsonLd(
  items: {
    name: string;
    path: string;
  }[],
): JsonLdObject {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqPageJsonLd(
  faqs: {
    question: string;
    answer: string;
  }[],
): JsonLdObject {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "PeptiCalc",
    url: absoluteUrl("/"),
  };
}

export function webPageJsonLd({
  path,
  title,
  description,
}: {
  path: string;
  title: string;
  description: string;
}): JsonLdObject {
  return {
    "@type": "WebPage",
    "@id": `${absoluteUrl(path)}#webpage`,
    url: absoluteUrl(path),
    name: title,
    description,
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
  };
}

export function webApplicationJsonLd({
  path,
  name,
  description,
  applicationCategory = "HealthApplication",
  isAccessibleForFree = true,
}: {
  path: string;
  name: string;
  description: string;
  applicationCategory?: string;
  isAccessibleForFree?: boolean;
}): JsonLdObject {
  return {
    "@type": "WebApplication",
    name,
    applicationCategory,
    operatingSystem: "Web",
    url: absoluteUrl(path),
    description,
    isAccessibleForFree,
    offers: {
      "@type": "Offer",
      price: isAccessibleForFree ? "0" : "5",
      priceCurrency: "USD",
      url: absoluteUrl(path),
    },
  };
}

export function proServiceJsonLd({
  priceLabel,
}: {
  priceLabel: string;
}): JsonLdObject {
  return {
    "@type": "Service",
    name: "PeptiCalc Pro",
    serviceType: "Paid peptide calculator workspace",
    url: absoluteUrl("/pro"),
    description:
      "Saved calculations, advanced compound splits, printable protocol sheets, saved notes, and reminder planning for PeptiCalc users.",
    provider: {
      "@type": "Organization",
      name: "PeptiCalc",
      url: absoluteUrl("/"),
    },
    offers: {
      "@type": "Offer",
      price: extractDollarPrice(priceLabel) ?? "5",
      priceCurrency: "USD",
      url: absoluteUrl("/pro"),
      availability: "https://schema.org/InStock",
    },
  };
}

function extractDollarPrice(priceLabel: string) {
  const match = priceLabel.match(/\$([0-9]+(?:\.[0-9]{1,2})?)/);
  return match?.[1] ?? null;
}
