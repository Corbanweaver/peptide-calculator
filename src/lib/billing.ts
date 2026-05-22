export const proAccessStatuses = ["active", "trialing"] as const;

export type ProAccessStatus = (typeof proAccessStatuses)[number];

export function hasProAccess(status: string | null | undefined) {
  return proAccessStatuses.includes(status as ProAccessStatus);
}

export function getProPriceLabel() {
  return process.env.NEXT_PUBLIC_PRO_PRICE_LABEL?.trim() || "$5/mo";
}

export function formatBillingStatus(status: string | null | undefined) {
  if (!status) {
    return "Free plan";
  }

  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
