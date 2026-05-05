"use client";

import {
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import {
  BookmarkCheck,
  Calculator,
  CircleAlert,
  CircleCheckBig,
  LoaderCircle,
  LogIn,
  LogOut,
  Trash2,
  UserPlus,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  clearPendingCalculationDraft,
  readPendingCalculationDraft,
  toSavedProtocolInsert,
} from "@/lib/saved-calculations";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

type Banner = {
  tone: "success" | "error";
  text: string;
};

type SavedCalculationRow = {
  id: string;
  compound_id: string;
  plan_name: string;
  dose_mcg: number | string;
  dose_ml: number | string;
  frequency: string;
  schedule: unknown;
  created_at: string;
};

export function AccountConsole() {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);
  const pendingImportUserId = useRef<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(configured);
  const [busyAction, setBusyAction] = useState<"sign_in" | "sign_up" | "sign_out" | null>(
    null,
  );
  const [banner, setBanner] = useState<Banner | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculationRow[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [savedError, setSavedError] = useState("");
  const [importingPending, setImportingPending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const loadSavedCalculations = useCallback(async () => {
    if (!supabase || !user) {
      return;
    }

    setLoadingSaved(true);
    setSavedError("");

    const { data, error } = await supabase
      .from("saved_protocols")
      .select("id, compound_id, plan_name, dose_mcg, dose_ml, frequency, schedule, created_at")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      setSavedError(error.message);
      setSavedCalculations([]);
    } else {
      setSavedCalculations((data ?? []) as SavedCalculationRow[]);
    }

    setLoadingSaved(false);
  }, [supabase, user]);

  useEffect(() => {
    if (!supabase || !user) {
      pendingImportUserId.current = null;
      return;
    }

    let alive = true;

    const importPendingAndLoad = async () => {
      const pendingDraft = readPendingCalculationDraft();

      if (pendingDraft && pendingImportUserId.current !== user.id) {
        pendingImportUserId.current = user.id;
        setImportingPending(true);

        const { error } = await supabase
          .from("saved_protocols")
          .insert(toSavedProtocolInsert(user.id, pendingDraft));

        if (!alive) {
          return;
        }

        setImportingPending(false);

        if (error) {
          setBanner({
            tone: "error",
            text: `Signed in, but the draft calculation could not be saved: ${error.message}`,
          });
        } else {
          clearPendingCalculationDraft();
          setBanner({
            tone: "success",
            text: "Signed in and saved your calculation.",
          });
          trackEvent("pending_calculation_saved_after_auth");
        }
      }

      if (alive) {
        await loadSavedCalculations();
      }
    };

    importPendingAndLoad();

    return () => {
      alive = false;
    };
  }, [loadSavedCalculations, supabase, user]);

  if (!configured) {
    return (
      <div className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 shadow-sm">
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

  const switchAuthMode = (nextShowCreateAccount: boolean) => {
    resetBanner();
    setPassword("");
    setShowCreateAccount(nextShowCreateAccount);
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
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

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
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
    setSavedCalculations([]);
    setBusyAction(null);
  };

  const handleDeleteSavedCalculation = async (id: string) => {
    if (!supabase) {
      return;
    }

    resetBanner();
    setDeletingId(id);

    const { error } = await supabase.from("saved_protocols").delete().eq("id", id);

    if (error) {
      setBanner({ tone: "error", text: error.message });
      setDeletingId(null);
      return;
    }

    setSavedCalculations((currentRows) =>
      currentRows.filter((calculation) => calculation.id !== id),
    );
    trackEvent("saved_calculation_deleted");
    setDeletingId(null);
  };

  return (
    <section className="rounded-[28px] border border-sky-100 bg-white/95 p-6 shadow-[0_24px_80px_rgba(14,165,233,0.09)] ring-1 ring-white/70">
      {loadingUser ? (
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <LoaderCircle className="animate-spin text-sky-700" size={18} />
          Loading account status...
        </div>
      ) : null}

      {!loadingUser && user ? (
        <div className="space-y-4">
          <div className="rounded-3xl border border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#f0f9ff_100%)] p-5 text-sm text-emerald-950">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <CircleCheckBig size={18} aria-hidden="true" />
              Profile active
            </div>
            <h2 className="text-xl font-semibold text-slate-950">
              Customer profile
            </h2>
            <p className="mt-2 break-all text-slate-700">{user.email}</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-2xl bg-white/80 p-3 ring-1 ring-emerald-100">
                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Saved calculations
                </div>
                <div className="mt-1 text-base font-semibold text-slate-950">
                  {loadingSaved
                    ? "Loading..."
                    : `${savedCalculations.length} saved`}
                </div>
              </div>
              <div className="rounded-2xl bg-white/80 p-3 ring-1 ring-emerald-100">
                <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  Premium tools
                </div>
                <div className="mt-1 text-base font-semibold text-slate-950">
                  Ready for launch
                </div>
              </div>
            </div>
          </div>

          <section className="rounded-3xl border border-sky-100 bg-[linear-gradient(135deg,#ffffff_0%,#f0fbff_62%,#fff7ed_100%)] p-4 shadow-[0_18px_55px_rgba(14,165,233,0.08)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <BookmarkCheck size={18} aria-hidden="true" />
                  Saved calculations
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Math snapshots you can reopen and edit later.
                </p>
              </div>
              <a
                href="/calculator"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-800"
              >
                <Calculator size={16} aria-hidden="true" />
                New calculation
              </a>
            </div>

            {importingPending ? (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-950">
                <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
                Saving your draft calculation...
              </div>
            ) : null}

            {savedError ? (
              <div className="mt-4 rounded-2xl border border-rose-300 bg-rose-50 p-3 text-sm text-rose-950">
                {savedError}
              </div>
            ) : null}

            {loadingSaved ? (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
                Loading saved calculations...
              </div>
            ) : null}

            {!loadingSaved && !savedCalculations.length && !savedError ? (
              <div className="mt-4 rounded-2xl border border-dashed border-sky-200 bg-white/70 p-4 text-sm leading-6 text-slate-600">
                Nothing saved yet. Use the calculator, press Save, and it will show
                up here.
              </div>
            ) : null}

            {savedCalculations.length ? (
              <div className="mt-4 grid gap-3">
                {savedCalculations.map((calculation) => {
                  const snapshot = getFirstScheduleRecord(calculation.schedule);
                  const markLabel =
                    getStringValue(snapshot, "syringeMarkLabel") || "Saved mark";
                  const doseLabel =
                    getStringValue(snapshot, "doseLabel") ||
                    `${formatSavedNumber(calculation.dose_mcg, 3)} mcg`;
                  const savedDate = formatSavedDate(calculation.created_at);

                  return (
                    <article
                      key={calculation.id}
                      className="rounded-2xl bg-white/85 p-4 ring-1 ring-sky-100"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <h3 className="text-base font-semibold text-slate-950">
                            {calculation.plan_name}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {doseLabel} saved at {markLabel}
                          </p>
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">
                            {savedDate}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          <a
                            href={buildCalculatorHref(calculation)}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-sky-800 px-3 text-sm font-semibold text-white transition hover:bg-slate-950"
                          >
                            <Calculator size={15} aria-hidden="true" />
                            Open
                          </a>
                          <button
                            type="button"
                            onClick={() => handleDeleteSavedCalculation(calculation.id)}
                            disabled={deletingId === calculation.id}
                            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-white px-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-rose-50 hover:text-rose-800 disabled:cursor-not-allowed disabled:text-slate-400"
                          >
                            {deletingId === calculation.id ? (
                              <LoaderCircle
                                className="animate-spin"
                                size={15}
                                aria-hidden="true"
                              />
                            ) : (
                              <Trash2 size={15} aria-hidden="true" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : null}
          </section>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={busyAction === "sign_out"}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
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
        <div className="mx-auto grid max-w-xl gap-4">
          {!showCreateAccount ? (
            <form
              onSubmit={handleSignIn}
              className="grid gap-3 rounded-3xl bg-slate-50/80 p-4 ring-1 ring-slate-100"
            >
              <h2 className="text-lg font-semibold text-slate-950">Sign in</h2>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
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
                  className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>
              <button
                type="submit"
                disabled={busyAction === "sign_in"}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {busyAction === "sign_in" ? (
                  <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
                ) : (
                  <LogIn size={16} aria-hidden="true" />
                )}
                Sign in
              </button>
              <button
                type="button"
                onClick={() => switchAuthMode(true)}
                className="mx-auto w-fit text-sm font-semibold text-sky-800 underline-offset-4 transition hover:text-slate-950 hover:underline"
              >
                Or create an account
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleSignUp}
              className="grid gap-3 rounded-3xl bg-[linear-gradient(135deg,#f0f9ff_0%,#fff7ed_100%)] p-4 ring-1 ring-sky-100"
            >
              <h2 className="text-lg font-semibold text-slate-950">Create account</h2>
              <label className="grid gap-1 text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
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
                  className="h-10 rounded-2xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>
              <button
                type="submit"
                disabled={busyAction === "sign_up"}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-sky-800 px-4 text-sm font-semibold text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {busyAction === "sign_up" ? (
                  <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
                ) : (
                  <UserPlus size={16} aria-hidden="true" />
                )}
                Create account
              </button>
              <button
                type="button"
                onClick={() => switchAuthMode(false)}
                className="mx-auto w-fit text-sm font-semibold text-sky-800 underline-offset-4 transition hover:text-slate-950 hover:underline"
              >
                Already have an account? Sign in
              </button>
            </form>
          )}
        </div>
      ) : null}

      {banner ? (
        <div
          className={`mt-5 rounded-2xl border p-3 text-sm ${
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

function buildCalculatorHref(calculation: SavedCalculationRow) {
  const snapshot = getFirstScheduleRecord(calculation.schedule);

  if (!snapshot) {
    return "/calculator";
  }

  const params = new URLSearchParams();
  const compoundName =
    getStringValue(snapshot, "compoundName") || calculation.plan_name;
  const presetDetail =
    getStringValue(snapshot, "presetDetail") || "Saved calculation";
  const presetType = getStringValue(snapshot, "presetType");
  const doseInputUnit = getStringValue(snapshot, "doseInputUnit");
  const splitParam = buildSplitParam(snapshot);

  params.set("compound", compoundName);
  params.set("preset", presetDetail);
  params.set("syringeMl", String(getNumberValue(snapshot, "syringeMl") ?? 1));
  params.set("vialMg", String(getNumberValue(snapshot, "vialMg") ?? 10));
  params.set("waterMl", String(getNumberValue(snapshot, "waterMl") ?? 2));

  if (presetType === "math") {
    params.set("presetType", "math");
  }

  if (doseInputUnit === "iu") {
    params.set("doseUnit", "iu");
    params.set(
      "doseIu",
      String(
        getNumberValue(snapshot, "doseInputAmount") ??
          getNumberValue(snapshot, "syringeUnits") ??
          5,
      ),
    );
  } else {
    params.set("doseMcg", String(getNumberValue(snapshot, "doseMcg") ?? 250));
  }

  if (splitParam) {
    params.set("split", splitParam);
  }

  return `/calculator?${params.toString()}#what-to-do`;
}

function buildSplitParam(snapshot: Record<string, unknown>) {
  const splitParts = snapshot.splitParts;

  if (!Array.isArray(splitParts) || splitParts.length < 2) {
    return "";
  }

  const segments = splitParts
    .map((part) => {
      if (!isRecord(part)) {
        return "";
      }

      const name = typeof part.name === "string" ? part.name.trim() : "";
      const percent =
        typeof part.percent === "string" || typeof part.percent === "number"
          ? String(part.percent)
          : "";

      return name && percent ? `${name}:${percent}` : "";
    })
    .filter(Boolean);

  return segments.length > 1 ? segments.join(",") : "";
}

function getFirstScheduleRecord(schedule: unknown) {
  if (!Array.isArray(schedule)) {
    return null;
  }

  const firstItem = schedule[0];
  return isRecord(firstItem) ? firstItem : null;
}

function getStringValue(record: Record<string, unknown> | null, key: string) {
  if (!record) {
    return "";
  }

  const value = record[key];
  return typeof value === "string" ? value : "";
}

function getNumberValue(record: Record<string, unknown> | null, key: string) {
  if (!record) {
    return null;
  }

  const value = record[key];
  const numericValue =
    typeof value === "number" || typeof value === "string" ? Number(value) : NaN;

  return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
}

function formatSavedNumber(value: number | string, maximumFractionDigits: number) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(numericValue);
}

function formatSavedDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Saved calculation";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
