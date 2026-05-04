import Link from "next/link";
import { UserRound, ArrowLeft } from "lucide-react";
import { AccountConsole } from "@/components/AccountConsole";

export const metadata = {
  title: "Account | PeptiCalc",
  description: "Sign in and manage your PeptiCalc account.",
};

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#f8fbff_0%,#eef9ff_38%,#fff7fb_70%,#fffaf1_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-sky-100 transition hover:bg-white hover:text-slate-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to calculator
        </Link>

        <header className="rounded-[28px] border border-sky-100 bg-white/90 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f172a_0%,#0369a1_58%,#fb923c_100%)] text-white shadow-sm">
            <UserRound size={22} aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-4xl font-semibold">Customer profile</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700">
            Sign in so saved protocols, billing access, and future premium tools can
            attach to one secure profile.
          </p>
        </header>

        <AccountConsole />
      </div>
    </main>
  );
}
