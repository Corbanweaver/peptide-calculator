"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  CreditCard,
  FileText,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { getProPriceLabel } from "@/lib/billing";
import { trackEvent } from "@/lib/analytics";

type MetadataValue = string | number | boolean | null;
type ProBanner = {
  tone: "error" | "info";
  text: string;
};

const proFeatures = [
  {
    icon: <FileText size={16} aria-hidden="true" />,
    text: "Printable protocol sheets from saved calculator snapshots",
  },
  {
    icon: <Bell size={16} aria-hidden="true" />,
    text: "Saved protocol notes and reminder plans",
  },
  {
    icon: <Sparkles size={16} aria-hidden="true" />,
    text: "Priority access to advanced Pro tools as they ship",
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
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<ProBanner | null>(null);
  const priceLabel = getProPriceLabel();

  async function handleStartCheckout() {
    setLoading(true);
    setBanner(null);

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          source,
          placement,
          metadata,
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (response.status === 401) {
        window.location.assign(`/account?upgrade=pro&from=${placement}`);
        return;
      }

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Could not start Stripe Checkout.");
      }

      trackEvent("pro_checkout_started", {
        source,
        placement,
      });
      window.location.assign(data.url);
    } catch (error) {
      setBanner({
        tone: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not start Stripe Checkout.",
      });
      setLoading(false);
    }
  }

  return (
    <section className="mt-4 rounded-3xl border border-cyan-100 bg-[linear-gradient(135deg,#effcff_0%,#ffffff_58%,#fff7ed_100%)] p-4 shadow-[0_18px_55px_rgba(14,165,233,0.08)]">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-slate-950 text-white ring-1 ring-slate-800">
          <Sparkles size={18} aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-950">
              PeptiCalc Pro
            </h3>
            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-950 ring-1 ring-sky-200">
              {priceLabel}
            </span>
          </div>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Unlock saved protocol notes, printable sheets, reminders, and the
            advanced tools built for repeat calculator workflows.
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        {proFeatures.map((feature) => (
          <div
            key={feature.text}
            className="flex items-start gap-2 rounded-2xl bg-white/85 px-3 py-2 text-xs font-medium leading-5 text-slate-700 ring-1 ring-sky-100"
          >
            <span className="mt-0.5 text-sky-800">{feature.icon}</span>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleStartCheckout}
        disabled={loading}
        className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {loading ? (
          <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
        ) : (
          <CreditCard size={16} aria-hidden="true" />
        )}
        {loading ? "Opening Checkout" : "Upgrade to Pro"}
      </button>

      <p className="mt-2 flex items-center gap-1.5 text-[11px] leading-4 text-slate-500">
        <CheckCircle2 size={13} aria-hidden="true" />
        Secure checkout and subscription management are handled by Stripe.
      </p>

      {banner ? (
        <div
          className={`mt-3 rounded-2xl border p-3 text-sm leading-6 ${
            banner.tone === "info"
              ? "border-sky-300 bg-sky-50 text-sky-950"
              : "border-rose-300 bg-rose-50 text-rose-950"
          }`}
        >
          {banner.text}
        </div>
      ) : null}
    </section>
  );
}
