import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CreditCard,
  FolderCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { AccountConsole } from "@/components/AccountConsole";
import { WaitlistCapture } from "@/components/WaitlistCapture";

export const metadata: Metadata = {
  title: "Account | PeptiCalc",
  description: "Sign in and manage your PeptiCalc customer profile.",
  robots: {
    index: false,
    follow: false,
  },
};

const accountFeatures = [
  {
    icon: <FolderCheck size={20} />,
    title: "Saved calculations",
    text: "Keep calculator setups, vial notes, and protocol drafts together once saving is turned on.",
  },
  {
    icon: <CreditCard size={20} />,
    title: "Premium access",
    text: "Billing can live here later for protocol tools, saved profiles, and advanced calculators.",
  },
  {
    icon: <Bell size={20} />,
    title: "Reminders",
    text: "Future reminders can help customers review labels, refill supplies, or revisit saved notes.",
  },
];

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eef9ff_38%,#fff7fb_70%,#fffaf1_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Link
          href="/calculator"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-100 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to calculator
        </Link>

        <header className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(135deg,rgba(14,165,233,0.14)_0%,rgba(236,72,153,0.07)_52%,rgba(251,146,60,0.1)_74%,rgba(255,255,255,0)_100%)]" />
          <div className="relative grid gap-6 lg:grid-cols-[1fr_0.95fr] lg:items-end">
            <div>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0369a1_58%,#fb923c_100%)] text-white shadow-sm">
                <UserRound size={22} aria-hidden="true" />
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Customer profile
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
                Sign in so saved calculations, premium tools, and future
                protocol drafts can attach to one secure customer profile.
              </p>
            </div>

            <div className="rounded-[26px] border border-sky-100 bg-white/80 p-4 text-sm leading-6 text-slate-700">
              <div className="mb-2 flex items-center gap-2 font-semibold text-slate-950">
                <ShieldCheck size={18} className="text-sky-800" aria-hidden="true" />
                Built for staged launch
              </div>
              Accounts work now. Saving, billing, and premium protocol tools can
              be added in layers without changing the simple calculator flow.
            </div>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {accountFeatures.map((feature) => (
            <article
              key={feature.title}
              className="rounded-[26px] border border-sky-100 bg-white/90 p-5 shadow-[0_18px_55px_rgba(14,165,233,0.07)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
                {feature.icon}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-slate-950">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {feature.text}
              </p>
            </article>
          ))}
        </section>

        <WaitlistCapture
          source="account"
          title="Get early reminder access"
          description="Tell us which paid feature you want first: reminders, emailed calculation results, or Pro tools."
        />

        <AccountConsole />
      </div>
    </main>
  );
}
