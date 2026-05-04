import Link from "next/link";
import { UserRound, ArrowLeft } from "lucide-react";
import { AccountConsole } from "@/components/AccountConsole";

export const metadata = {
  title: "Account | PeptiCalc",
  description: "Sign in and manage your PeptiCalc account.",
};

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[#f8f6f0] px-4 py-12 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#175e65] hover:text-slate-950"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to calculator
        </Link>

        <header className="space-y-3">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-[#175e65] text-white">
            <UserRound size={22} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-semibold">Account</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-700">
            Sign in now so we can attach saved protocols, billing access, and future
            premium tools to your account.
          </p>
        </header>

        <AccountConsole />
      </div>
    </main>
  );
}
