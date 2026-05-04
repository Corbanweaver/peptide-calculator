"use client";

import { useEffect, useMemo, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import {
  CircleAlert,
  CircleCheckBig,
  LoaderCircle,
  LogIn,
  LogOut,
  UserPlus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Banner = {
  tone: "success" | "error";
  text: string;
};

export function AccountConsole() {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(configured);
  const [busyAction, setBusyAction] = useState<"sign_in" | "sign_up" | "sign_out" | null>(
    null,
  );
  const [banner, setBanner] = useState<Banner | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let alive = true;

    const loadUser = async () => {
      const {
        data: { user: activeUser },
      } = await supabase.auth.getUser();

      if (!alive) {
        return;
      }

      setUser(activeUser ?? null);
      setLoadingUser(false);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
      },
    );

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (!configured) {
    return (
      <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
        <div className="mb-2 flex items-center gap-2 font-semibold">
          <CircleAlert size={18} aria-hidden="true" />
          Supabase is not configured yet
        </div>
        <p>
          Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> to your environment
          variables and redeploy.
        </p>
      </div>
    );
  }

  const resetBanner = () => setBanner(null);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      return;
    }

    resetBanner();
    setBusyAction("sign_in");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setBanner({ tone: "error", text: error.message });
      setBusyAction(null);
      return;
    }

    setBanner({ tone: "success", text: "Signed in successfully." });
    setPassword("");
    setBusyAction(null);
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) {
      return;
    }

    resetBanner();
    setBusyAction("sign_up");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setBanner({ tone: "error", text: error.message });
      setBusyAction(null);
      return;
    }

    if (!data.session) {
      setBanner({
        tone: "success",
        text: "Account created. Check your email to confirm your account.",
      });
    } else {
      setBanner({ tone: "success", text: "Account created and signed in." });
    }

    setPassword("");
    setBusyAction(null);
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    resetBanner();
    setBusyAction("sign_out");

    const { error } = await supabase.auth.signOut();

    if (error) {
      setBanner({ tone: "error", text: error.message });
      setBusyAction(null);
      return;
    }

    setBanner({ tone: "success", text: "Signed out." });
    setBusyAction(null);
  };

  return (
    <section className="rounded-lg border border-slate-300 bg-white p-6 shadow-sm">
      {loadingUser ? (
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <LoaderCircle className="animate-spin text-[#175e65]" size={18} />
          Loading account status...
        </div>
      ) : null}

      {!loadingUser && user ? (
        <div className="space-y-4">
          <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-4 text-sm text-emerald-950">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <CircleCheckBig size={18} aria-hidden="true" />
              Signed in
            </div>
            <p className="break-all">{user.email}</p>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={busyAction === "sign_out"}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-[#175e65] disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {busyAction === "sign_out" ? (
              <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
            ) : (
              <LogOut size={16} aria-hidden="true" />
            )}
            Sign out
          </button>
        </div>
      ) : null}

      {!loadingUser && !user ? (
        <div className="grid gap-6 md:grid-cols-2">
          <form onSubmit={handleSignIn} className="grid gap-3">
            <h2 className="text-lg font-semibold text-slate-950">Sign in</h2>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </label>
            <button
              type="submit"
              disabled={busyAction === "sign_in"}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-[#175e65] disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {busyAction === "sign_in" ? (
                <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
              ) : (
                <LogIn size={16} aria-hidden="true" />
              )}
              Sign in
            </button>
          </form>

          <form onSubmit={handleSignUp} className="grid gap-3">
            <h2 className="text-lg font-semibold text-slate-950">Create account</h2>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Password
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
            </label>
            <button
              type="submit"
              disabled={busyAction === "sign_up"}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#175e65] px-4 text-sm font-semibold text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {busyAction === "sign_up" ? (
                <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
              ) : (
                <UserPlus size={16} aria-hidden="true" />
              )}
              Create account
            </button>
          </form>
        </div>
      ) : null}

      {banner ? (
        <div
          className={`mt-5 rounded-lg border p-3 text-sm ${
            banner.tone === "success"
              ? "border-emerald-300 bg-emerald-50 text-emerald-950"
              : "border-rose-300 bg-rose-50 text-rose-950"
          }`}
        >
          {banner.text}
        </div>
      ) : null}
    </section>
  );
}
