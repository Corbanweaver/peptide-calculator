"use client";

import { CalendarCheck2, CreditCard, Sparkles } from "lucide-react";
import { WaitlistCapture } from "@/components/WaitlistCapture";

type MetadataValue = string | number | boolean | null;

const proPricingOptions = [
  {
    value: "pro_monthly_5" as const,
    label: "$5/mo",
    icon: <CreditCard size={15} aria-hidden="true" />,
  },
  {
    value: "pro_yearly_49" as const,
    label: "$49/yr",
    icon: <CalendarCheck2 size={15} aria-hidden="true" />,
  },
  {
    value: "pro_lifetime_founding" as const,
    label: "Founder",
    icon: <Sparkles size={15} aria-hidden="true" />,
  },
];

export function ProEarlyAccess({
  source,
  placement,
  metadata = {},
}: {
  source: string;
  placement: string;
  metadata?: Record<string, MetadataValue>;
}) {
  return (
    <WaitlistCapture
      source={source}
      title="PeptiCalc Pro early access"
      description="Vote for the paid version: saved calculators, reminders, emailed results, PDFs, and advanced split-compound tools."
      defaultInterest="pro_yearly_49"
      interestOptions={proPricingOptions}
      metadata={{
        ...metadata,
        experiment: "pro-pricing-2026-05",
        placement,
      }}
      submitLabel="Join Pro list"
      footnote="No charge today. This only tells us which Pro price and features people actually want."
    />
  );
}
