import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, LockKeyhole, Mail, ShieldCheck } from "lucide-react";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://peptidecalculator.co";

export const metadata: Metadata = {
  title: "Privacy Policy | PeptiCalc",
  description:
    "Privacy policy for PeptiCalc, including analytics, account data, saved calculations, and contact information.",
  alternates: {
    canonical: `${siteUrl}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eef9ff_38%,#fff7fb_70%,#fffaf1_100%)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <Link
          href="/calculator"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white/85 px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-100 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to calculator
        </Link>

        <header className="relative overflow-hidden rounded-[32px] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70 sm:p-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(135deg,rgba(14,165,233,0.14)_0%,rgba(236,72,153,0.07)_52%,rgba(251,146,60,0.1)_74%,rgba(255,255,255,0)_100%)]" />
          <div className="relative">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0369a1_58%,#fb923c_100%)] text-white shadow-sm">
              <LockKeyhole size={22} aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-700">
              PeptiCalc is built to keep calculator math simple while collecting
              only the information needed to run the site, improve it, and save
              account features you choose to use.
            </p>
            <p className="mt-3 text-sm font-semibold text-slate-500">
              Last updated May 12, 2026
            </p>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          <PolicyCard
            icon={<ShieldCheck size={20} />}
            title="Information we collect"
            text="The calculator can be used without creating an account. If you create an account, we may store your email address, saved calculator results, reminders, and protocol notes you choose to save."
          />
          <PolicyCard
            icon={<LockKeyhole size={20} />}
            title="Analytics"
            text="We may use privacy-conscious analytics tools, including Google Analytics, to understand pages visited, device type, traffic source, and broad location information. Analytics data helps us improve the site."
          />
          <PolicyCard
            icon={<ShieldCheck size={20} />}
            title="How data is used"
            text="Data is used to operate PeptiCalc, provide saved account features, improve calculator pages, monitor site performance, and protect the service from misuse."
          />
          <PolicyCard
            icon={<Mail size={20} />}
            title="Contact"
            text="For privacy questions or deletion requests, contact the site owner using the email address listed in your account, domain, or support materials."
          />
        </section>

        <section className="rounded-[28px] border border-sky-100 bg-white/95 p-6 text-sm leading-7 text-slate-700 shadow-[0_18px_55px_rgba(14,165,233,0.07)]">
          <h2 className="text-xl font-semibold text-slate-950">
            Important notes
          </h2>
          <p className="mt-3">
            PeptiCalc does not sell medical advice or prescribe treatment. Saved
            calculations are measurement snapshots only. Do not enter sensitive
            medical details that are not needed for the calculator.
          </p>
          <p className="mt-3">
            If third-party services such as hosting, analytics, authentication,
            email, or payments are used, those providers may process data under
            their own privacy and security terms.
          </p>
        </section>
      </div>
    </main>
  );
}

function PolicyCard({
  icon,
  title,
  text,
}: {
  icon: ReactNode;
  title: string;
  text: string;
}) {
  return (
    <article className="rounded-[26px] border border-sky-100 bg-white/95 p-5 shadow-[0_18px_55px_rgba(14,165,233,0.07)]">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-sky-50 text-sky-800 ring-1 ring-sky-100">
        {icon}
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}
