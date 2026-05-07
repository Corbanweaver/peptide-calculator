import Link from "next/link";
import { Calculator, WifiOff } from "lucide-react";

export const metadata = {
  title: "Offline | PeptiCalc",
  description: "PeptiCalc offline fallback page.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function OfflinePage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[linear-gradient(135deg,#e0f7ff_0%,#f8fbff_48%,#fff7ed_100%)] px-4 text-slate-900">
      <section className="w-full max-w-lg rounded-[30px] border border-sky-100 bg-white/95 p-6 text-center shadow-[0_24px_80px_rgba(14,165,233,0.12)] ring-1 ring-white/70">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white">
          <WifiOff size={24} aria-hidden="true" />
        </div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">
          You are offline
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          PeptiCalc has saved the app shell for quicker loading, but this page
          needs a connection before it can refresh the newest calculator data.
        </p>
        <Link
          href="/calculator"
          className="mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-sky-900"
        >
          <Calculator size={17} aria-hidden="true" />
          Try calculator
        </Link>
      </section>
    </main>
  );
}
