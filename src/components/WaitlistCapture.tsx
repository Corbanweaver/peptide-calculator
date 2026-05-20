"use client";

import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import {
  Bell,
  CheckCircle2,
  LoaderCircle,
  Mail,
  Sparkles,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type WaitlistInterest =
  | "reminders"
  | "email_calculation"
  | "pro_tools"
  | "pro_monthly_5"
  | "pro_yearly_49"
  | "pro_lifetime_founding";
type WaitlistBanner = {
  tone: "success" | "error" | "info";
  text: string;
};
type MetadataValue = string | number | boolean | null;
type WaitlistOption = {
  value: WaitlistInterest;
  label: string;
  icon: ReactNode;
};

const defaultInterestOptions: WaitlistOption[] = [
  {
    value: "reminders",
    label: "Reminders",
    icon: <Bell size={15} aria-hidden="true" />,
  },
  {
    value: "email_calculation",
    label: "Email results",
    icon: <Mail size={15} aria-hidden="true" />,
  },
  {
    value: "pro_tools",
    label: "Pro tools",
    icon: <Sparkles size={15} aria-hidden="true" />,
  },
];

export function WaitlistCapture({
  source,
  title = "Want reminders next?",
  description = "Join the early list for emailed calculations, calendar reminders, and Pro features.",
  defaultInterest = "reminders",
  interestOptions = defaultInterestOptions,
  metadata = {},
  footnote = "No spam and no selling your email. This is only for PeptiCalc feature updates.",
  submitLabel = "Join list",
}: {
  source: string;
  title?: string;
  description?: string;
  defaultInterest?: WaitlistInterest;
  interestOptions?: WaitlistOption[];
  metadata?: Record<string, MetadataValue>;
  footnote?: string;
  submitLabel?: string;
}) {
  const configured = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState<WaitlistInterest>(defaultInterest);
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState<WaitlistBanner | null>(null);
  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!configured) {
      setBanner({
        tone: "error",
        text: "Supabase needs to be configured before emails can be saved.",
      });
      return;
    }

    setSubmitting(true);
    setBanner(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("waitlist_signups").insert({
        email: normalizedEmail,
        interest,
        source,
        user_id: user?.id ?? null,
        metadata,
      });

      if (error) {
        if (error.code === "23505") {
          setBanner({
            tone: "success",
            text: "You're already on the list. Nice, that signal counts.",
          });
          setEmail("");
          return;
        }

        throw error;
      }

      setBanner({
        tone: "success",
        text: "You're on the list. We'll use this to decide what to build first.",
      });
      setEmail("");
      trackEvent("waitlist_signup", {
        source,
        interest,
      });
    } catch (error) {
      setBanner({
        tone: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not join the list. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-4 rounded-3xl border border-cyan-100 bg-[linear-gradient(135deg,#f0fbff_0%,#ffffff_58%,#fff7ed_100%)] p-4 shadow-[0_18px_55px_rgba(14,165,233,0.08)]">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
          <Bell size={18} aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {interestOptions.map((option) => {
          const selected = option.value === interest;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setInterest(option.value)}
              className={`inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition ${
                selected
                  ? "bg-slate-950 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              }`}
            >
              {option.icon}
              {option.label}
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
        <label className="sr-only" htmlFor={`waitlist-email-${source}`}>
          Email address
        </label>
        <input
          id={`waitlist-email-${source}`}
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          className="h-11 min-w-0 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
        />
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-sky-800 px-4 text-sm font-semibold text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {submitting ? (
            <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
          ) : (
            <CheckCircle2 size={16} aria-hidden="true" />
          )}
          {submitLabel}
        </button>
      </form>

      <p className="mt-2 text-[11px] leading-4 text-slate-500">
        {footnote}
      </p>

      {banner ? (
        <div
          className={`mt-3 rounded-2xl border p-3 text-sm leading-6 ${
            banner.tone === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-950"
              : banner.tone === "info"
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
