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
  Bell,
  BookmarkCheck,
  Calculator,
  CircleAlert,
  CircleCheckBig,
  CreditCard,
  FileText,
  LoaderCircle,
  LogIn,
  LogOut,
  Printer,
  Save,
  Sparkles,
  Trash2,
  UserPlus,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  formatBillingStatus,
  getProPriceLabel,
  hasProAccess,
} from "@/lib/billing";
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
  start_date: string | null;
  schedule: unknown;
  created_at: string;
};

type BillingCustomerRow = {
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  subscription_status: string;
  subscription_cancel_at_period_end: boolean;
  subscription_current_period_end: string | null;
};

type ProtocolDetailDraft = {
  notes: string;
  reminderEnabled: boolean;
  reminderDate: string;
  reminderTime: string;
  reminderFrequency: string;
};

const defaultProtocolDetailDraft: ProtocolDetailDraft = {
  notes: "",
  reminderEnabled: false,
  reminderDate: "",
  reminderTime: "09:00",
  reminderFrequency: "weekly",
};

const reminderFrequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "every_other_day", label: "Every other day" },
  { value: "twice_weekly", label: "Twice weekly" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export function AccountConsole() {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);
  const pendingImportUserId = useRef<string | null>(null);
  const autoBillingSyncUserId = useRef<string | null>(null);

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
  const [billingStatus, setBillingStatus] = useState<BillingCustomerRow | null>(
    null,
  );
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [billingError, setBillingError] = useState("");
  const [billingAction, setBillingAction] = useState<
    "checkout" | "portal" | "sync" | null
  >(null);
  const [importingPending, setImportingPending] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingDetailsId, setUpdatingDetailsId] = useState<string | null>(null);
  const [detailDrafts, setDetailDrafts] = useState<
    Record<string, ProtocolDetailDraft>
  >({});
  const proEnabled = hasProAccess(billingStatus?.subscription_status);
  const proPriceLabel = getProPriceLabel();

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
      .select("id, compound_id, plan_name, dose_mcg, dose_ml, frequency, start_date, schedule, created_at")
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

  const loadBillingStatus = useCallback(async () => {
    if (!supabase || !user) {
      return;
    }

    setLoadingBilling(true);
    setBillingError("");

    const { data, error } = await supabase
      .from("billing_customers")
      .select(
        "stripe_customer_id, stripe_subscription_id, stripe_price_id, subscription_status, subscription_cancel_at_period_end, subscription_current_period_end",
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) {
      setBillingError(error.message);
      setBillingStatus(null);
    } else {
      setBillingStatus((data ?? null) as BillingCustomerRow | null);
    }

    setLoadingBilling(false);
  }, [supabase, user]);

  const syncBillingStatus = useCallback(
    async ({ quiet = false }: { quiet?: boolean } = {}) => {
      if (!user) {
        return;
      }

      if (!quiet) {
        setBillingAction("sync");
        setBanner(null);
      }

      try {
        const response = await fetch("/api/stripe/sync-billing", {
          method: "POST",
        });
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
          pro?: boolean;
          subscription_status?: string;
        };

        if (!response.ok) {
          throw new Error(data.error || "Could not refresh Stripe billing.");
        }

        await loadBillingStatus();

        if (!quiet) {
          setBanner({
            tone: "success",
            text: data.pro
              ? "Pro is active on this account."
              : "Billing status refreshed.",
          });
        }
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not refresh Stripe billing.";

        if (quiet) {
          setBillingError(message);
        } else {
          setBanner({ tone: "error", text: message });
        }
      } finally {
        if (!quiet) {
          setBillingAction(null);
        }
      }
    },
    [loadBillingStatus, user],
  );

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

  useEffect(() => {
    if (!supabase || !user) {
      return;
    }

    const loadTimer = window.setTimeout(() => {
      void loadBillingStatus();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [loadBillingStatus, supabase, user]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const checkoutStatus = params.get("checkout");

    if (checkoutStatus === "success") {
      const bannerTimer = window.setTimeout(() => {
        setBanner({
          tone: "success",
          text: "Checkout complete. Syncing your Pro access now.",
        });
      }, 0);
      const syncTimer = window.setTimeout(() => {
        void syncBillingStatus({ quiet: true });
      }, 900);
      const refreshTimer = window.setTimeout(() => {
        void loadBillingStatus();
      }, 3500);
      return () => {
        window.clearTimeout(bannerTimer);
        window.clearTimeout(syncTimer);
        window.clearTimeout(refreshTimer);
      };
    }

    if (checkoutStatus === "canceled") {
      const bannerTimer = window.setTimeout(() => {
        setBanner({
          tone: "error",
          text: "Checkout was canceled. Your free account is still active.",
        });
      }, 0);
      return () => window.clearTimeout(bannerTimer);
    }
  }, [loadBillingStatus, syncBillingStatus]);

  useEffect(() => {
    if (!user) {
      autoBillingSyncUserId.current = null;
      return;
    }

    if (
      loadingBilling ||
      proEnabled ||
      !billingStatus?.stripe_customer_id ||
      autoBillingSyncUserId.current === user.id
    ) {
      return;
    }

    autoBillingSyncUserId.current = user.id;
    void syncBillingStatus({ quiet: true });
  }, [
    billingStatus?.stripe_customer_id,
    loadingBilling,
    proEnabled,
    syncBillingStatus,
    user,
  ]);

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

  const openStripeFlow = async (action: "checkout" | "portal") => {
    resetBanner();
    setBillingAction(action);

    try {
      const response = await fetch(
        action === "checkout" ? "/api/stripe/checkout" : "/api/stripe/portal",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body:
            action === "checkout"
              ? JSON.stringify({
                  source: "account-console",
                  placement: "account-billing-panel",
                })
              : undefined,
        },
      );
      const data = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !data.url) {
        throw new Error(
          data.error ||
            (action === "checkout"
              ? "Could not open Stripe Checkout."
              : "Could not open the Stripe customer portal."),
        );
      }

      trackEvent(action === "checkout" ? "pro_checkout_started" : "pro_portal_opened", {
        source: "account-console",
      });
      window.location.assign(data.url);
    } catch (error) {
      setBanner({
        tone: "error",
        text:
          error instanceof Error
            ? error.message
            : "Could not open Stripe billing.",
      });
      setBillingAction(null);
    }
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
    setBillingStatus(null);
    setBillingError("");
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

  const updateDetailDraft = (
    id: string,
    nextDetail: Partial<ProtocolDetailDraft>,
  ) => {
    setDetailDrafts((currentDrafts) => ({
      ...currentDrafts,
      [id]: {
        ...(currentDrafts[id] ?? defaultProtocolDetailDraft),
        ...nextDetail,
      },
    }));
  };

  const handleSaveProtocolDetails = async (id: string) => {
    if (!supabase) {
      return;
    }

    if (!proEnabled) {
      await openStripeFlow("checkout");
      return;
    }

    const calculation = savedCalculations.find((row) => row.id === id);

    if (!calculation) {
      return;
    }

    resetBanner();
    setUpdatingDetailsId(id);

    const detail = detailDrafts[id] ?? getProtocolDetailDraft(calculation);
    const updatedSchedule = buildScheduleWithProtocolDetails(
      calculation.schedule,
      detail,
    );

    const { error } = await supabase
      .from("saved_protocols")
      .update({
        schedule: updatedSchedule,
        frequency: detail.reminderEnabled
          ? detail.reminderFrequency
          : "Saved calculator result",
        start_date:
          detail.reminderEnabled && detail.reminderDate
            ? detail.reminderDate
            : null,
      })
      .eq("id", id);

    if (error) {
      setBanner({ tone: "error", text: error.message });
      setUpdatingDetailsId(null);
      return;
    }

    setSavedCalculations((currentRows) =>
      currentRows.map((row) =>
        row.id === id
          ? {
              ...row,
              schedule: updatedSchedule,
              frequency: detail.reminderEnabled
                ? detail.reminderFrequency
                : "Saved calculator result",
              start_date:
                detail.reminderEnabled && detail.reminderDate
                  ? detail.reminderDate
                  : null,
            }
          : row,
      ),
    );
    setBanner({ tone: "success", text: "Saved notes and reminder plan." });
    trackEvent("saved_protocol_details_updated", {
      reminder_enabled: detail.reminderEnabled,
      reminder_frequency: detail.reminderFrequency,
    });
    setUpdatingDetailsId(null);
  };

  const handlePrintProtocolSheet = (
    calculation: SavedCalculationRow,
    detail: ProtocolDetailDraft,
  ) => {
    if (!proEnabled) {
      void openStripeFlow("checkout");
      return;
    }

    const printed = printProtocolSheet(calculation, detail);

    if (!printed) {
      setBanner({
        tone: "error",
        text: "The print window was blocked. Allow popups for this site and try again.",
      });
      return;
    }

    trackEvent("protocol_sheet_printed");
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
                  {loadingBilling
                    ? "Checking..."
                    : proEnabled
                      ? "Pro active"
                      : formatBillingStatus(
                          billingStatus?.subscription_status,
                        )}
                </div>
                {billingStatus?.subscription_current_period_end ? (
                  <div className="mt-1 text-xs leading-5 text-slate-500">
                    Renews {formatSavedDate(billingStatus.subscription_current_period_end)}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <ProBillingPanel
            billingStatus={billingStatus}
            billingError={billingError}
            loadingBilling={loadingBilling}
            billingAction={billingAction}
            proEnabled={proEnabled}
            proPriceLabel={proPriceLabel}
            onCheckout={() => openStripeFlow("checkout")}
            onPortal={() => openStripeFlow("portal")}
            onRefresh={() => syncBillingStatus()}
          />

          <section className="rounded-3xl border border-sky-100 bg-[linear-gradient(135deg,#ffffff_0%,#f0fbff_62%,#fff7ed_100%)] p-4 shadow-[0_18px_55px_rgba(14,165,233,0.08)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <BookmarkCheck size={18} aria-hidden="true" />
                  Saved calculations
                </div>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Math snapshots are free. Pro adds notes, reminders, and
                  printable protocol sheets.
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

            {!loadingSaved && savedCalculations.length && !proEnabled ? (
              <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-950 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2">
                  <Sparkles size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                  <span>
                    Upgrade to Pro to add protocol notes, reminder plans, and
                    print-ready sheets to these saved calculations.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => openStripeFlow("checkout")}
                  disabled={billingAction === "checkout"}
                  className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                  {billingAction === "checkout" ? (
                    <LoaderCircle
                      className="animate-spin"
                      size={16}
                      aria-hidden="true"
                    />
                  ) : (
                    <CreditCard size={16} aria-hidden="true" />
                  )}
                  Upgrade
                </button>
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
                  const detailDraft =
                    detailDrafts[calculation.id] ??
                    getProtocolDetailDraft(calculation);
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
                            onClick={() =>
                              handlePrintProtocolSheet(calculation, detailDraft)
                            }
                            disabled={billingAction === "checkout"}
                            className={`inline-flex h-9 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold ring-1 transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${
                              proEnabled
                                ? "bg-white text-sky-800 ring-sky-100 hover:bg-sky-50 hover:text-slate-950"
                                : "bg-slate-950 text-white ring-slate-900 hover:bg-sky-800"
                            }`}
                          >
                            {billingAction === "checkout" && !proEnabled ? (
                              <LoaderCircle
                                className="animate-spin"
                                size={15}
                                aria-hidden="true"
                              />
                            ) : proEnabled ? (
                              <Printer size={15} aria-hidden="true" />
                            ) : (
                              <Sparkles size={15} aria-hidden="true" />
                            )}
                            {proEnabled ? "Print" : "Pro print"}
                          </button>
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
                      {proEnabled ? (
                      <div className="mt-4 grid gap-3 rounded-2xl bg-[linear-gradient(135deg,#f8fbff_0%,#fff7ed_100%)] p-3 ring-1 ring-sky-100">
                        <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                          <FileText size={16} aria-hidden="true" />
                          Protocol notes
                        </div>
                        <label className="grid gap-1 text-xs font-semibold text-slate-500">
                          Notes
                          <textarea
                            value={detailDraft.notes}
                            onChange={(event) =>
                              updateDetailDraft(calculation.id, {
                                notes: event.target.value,
                              })
                            }
                            rows={3}
                            placeholder="Add label details, timing notes, or anything you want on the printable sheet."
                            className="min-h-20 resize-y rounded-2xl border border-sky-100 bg-white px-3 py-2 text-sm font-medium leading-6 text-slate-800 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                          />
                        </label>

                        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr]">
                          <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-semibold text-slate-700 ring-1 ring-sky-100">
                            <input
                              type="checkbox"
                              checked={detailDraft.reminderEnabled}
                              onChange={(event) =>
                                updateDetailDraft(calculation.id, {
                                  reminderEnabled: event.target.checked,
                                })
                              }
                              className="h-4 w-4 accent-sky-800"
                            />
                            <Bell size={15} aria-hidden="true" />
                            Reminder plan
                          </label>
                          <label className="grid gap-1 text-xs font-semibold text-slate-500">
                            Start date
                            <input
                              type="date"
                              value={detailDraft.reminderDate}
                              onChange={(event) =>
                                updateDetailDraft(calculation.id, {
                                  reminderDate: event.target.value,
                                })
                              }
                              className="h-10 rounded-2xl border border-sky-100 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                            />
                          </label>
                          <label className="grid gap-1 text-xs font-semibold text-slate-500">
                            Time
                            <input
                              type="time"
                              value={detailDraft.reminderTime}
                              onChange={(event) =>
                                updateDetailDraft(calculation.id, {
                                  reminderTime: event.target.value,
                                })
                              }
                              className="h-10 rounded-2xl border border-sky-100 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                            />
                          </label>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                          <label className="grid gap-1 text-xs font-semibold text-slate-500 sm:min-w-52">
                            Repeat
                            <select
                              value={detailDraft.reminderFrequency}
                              onChange={(event) =>
                                updateDetailDraft(calculation.id, {
                                  reminderFrequency: event.target.value,
                                })
                              }
                              className="h-10 rounded-2xl border border-sky-100 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                            >
                              {reminderFrequencyOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              handleSaveProtocolDetails(calculation.id)
                            }
                            disabled={updatingDetailsId === calculation.id}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                          >
                            {updatingDetailsId === calculation.id ? (
                              <LoaderCircle
                                className="animate-spin"
                                size={16}
                                aria-hidden="true"
                              />
                            ) : (
                              <Save size={16} aria-hidden="true" />
                            )}
                            Save notes
                          </button>
                        </div>
                        <p className="text-xs leading-5 text-slate-500">
                          Reminder plans are saved with the calculation. Browser
                          push notifications can be added later as Pro reminder
                          delivery expands.
                        </p>
                      </div>
                      ) : (
                        <ProLockedProtocolTools
                          loading={billingAction === "checkout"}
                          onCheckout={() => openStripeFlow("checkout")}
                        />
                      )}
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

function ProBillingPanel({
  billingStatus,
  billingError,
  loadingBilling,
  billingAction,
  proEnabled,
  proPriceLabel,
  onCheckout,
  onPortal,
  onRefresh,
}: {
  billingStatus: BillingCustomerRow | null;
  billingError: string;
  loadingBilling: boolean;
  billingAction: "checkout" | "portal" | "sync" | null;
  proEnabled: boolean;
  proPriceLabel: string;
  onCheckout: () => void;
  onPortal: () => void;
  onRefresh: () => void;
}) {
  const statusLabel = proEnabled
    ? "Pro active"
    : formatBillingStatus(billingStatus?.subscription_status);
  const renewalLabel = billingStatus?.subscription_current_period_end
    ? `${billingStatus.subscription_cancel_at_period_end ? "Ends" : "Renews"} ${formatSavedDate(
        billingStatus.subscription_current_period_end,
      )}`
    : null;

  return (
    <section className="rounded-3xl border border-sky-100 bg-[linear-gradient(135deg,#ffffff_0%,#effcff_56%,#fff7ed_100%)] p-5 shadow-[0_18px_55px_rgba(14,165,233,0.08)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white">
              <Sparkles size={18} aria-hidden="true" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-950">
                PeptiCalc Pro
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                {loadingBilling ? "Checking billing" : statusLabel}
              </div>
            </div>
            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-sky-900 ring-1 ring-sky-100">
              {proPriceLabel}
            </span>
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
            Pro unlocks printable protocol sheets, saved notes, and reminder
            planning for repeat calculator workflows.
          </p>
          {renewalLabel ? (
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {renewalLabel}
            </p>
          ) : null}
          {billingError ? (
            <p className="mt-2 text-xs font-semibold text-rose-700">
              Billing status could not load: {billingError}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onRefresh}
            disabled={billingAction === "sync"}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-sky-800 ring-1 ring-sky-100 transition hover:bg-sky-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {billingAction === "sync" ? (
              <LoaderCircle
                className="animate-spin"
                size={16}
                aria-hidden="true"
              />
            ) : (
              <CircleCheckBig size={16} aria-hidden="true" />
            )}
            Refresh status
          </button>
          {proEnabled ? (
            <button
              type="button"
              onClick={onPortal}
              disabled={billingAction === "portal"}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {billingAction === "portal" ? (
                <LoaderCircle
                  className="animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              ) : (
                <CreditCard size={16} aria-hidden="true" />
              )}
              Manage billing
            </button>
          ) : (
            <button
              type="button"
              onClick={onCheckout}
              disabled={billingAction === "checkout"}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {billingAction === "checkout" ? (
                <LoaderCircle
                  className="animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              ) : (
                <CreditCard size={16} aria-hidden="true" />
              )}
              Upgrade to Pro
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

function ProLockedProtocolTools({
  loading,
  onCheckout,
}: {
  loading: boolean;
  onCheckout: () => void;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-950">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-2">
          <Sparkles size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
          <div>
            <div className="font-semibold text-slate-950">
              Pro protocol tools
            </div>
            <p className="mt-1 text-sky-950/80">
              Add notes, reminder plans, and printable protocol sheets to this
              saved calculation.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCheckout}
          disabled={loading}
          className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {loading ? (
            <LoaderCircle className="animate-spin" size={16} aria-hidden="true" />
          ) : (
            <CreditCard size={16} aria-hidden="true" />
          )}
          Upgrade
        </button>
      </div>
    </div>
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
  params.set("waterMl", String(getNumberValue(snapshot, "waterMl") ?? 2));

  if (presetType === "math") {
    params.set("presetType", "math");
  }

  if (doseInputUnit === "iu") {
    params.set("doseUnit", "iu");
    params.set("vialIu", String(getNumberValue(snapshot, "vialMg") ?? 5000));
    params.set(
      "doseIu",
      String(
        getNumberValue(snapshot, "doseInputAmount") ??
          getNumberValue(snapshot, "syringeUnits") ??
          5,
      ),
    );
  } else {
    params.set("vialMg", String(getNumberValue(snapshot, "vialMg") ?? 10));
    params.set("doseMcg", String(getNumberValue(snapshot, "doseMcg") ?? 250));
  }

  if (splitParam) {
    params.set("split", splitParam);
  }

  return `/calculator?${params.toString()}#what-to-do`;
}

function getProtocolDetailDraft(
  calculation: SavedCalculationRow,
): ProtocolDetailDraft {
  const snapshot = getFirstScheduleRecord(calculation.schedule);
  const savedFrequency =
    getStringValue(snapshot, "reminderFrequency") || calculation.frequency;
  const reminderFrequency = reminderFrequencyOptions.some(
    (option) => option.value === savedFrequency,
  )
    ? savedFrequency
    : defaultProtocolDetailDraft.reminderFrequency;

  return {
    notes: getStringValue(snapshot, "protocolNotes"),
    reminderEnabled: getBooleanValue(snapshot, "reminderEnabled"),
    reminderDate:
      getStringValue(snapshot, "reminderStartDate") ||
      calculation.start_date ||
      "",
    reminderTime:
      getStringValue(snapshot, "reminderTime") ||
      defaultProtocolDetailDraft.reminderTime,
    reminderFrequency,
  };
}

function buildScheduleWithProtocolDetails(
  schedule: unknown,
  detail: ProtocolDetailDraft,
) {
  const scheduleItems = Array.isArray(schedule) ? schedule : [];
  const firstItem = isRecord(scheduleItems[0]) ? scheduleItems[0] : {};
  const updatedFirstItem = {
    ...firstItem,
    protocolNotes: detail.notes.trim(),
    reminderEnabled: detail.reminderEnabled,
    reminderStartDate: detail.reminderEnabled ? detail.reminderDate : "",
    reminderTime: detail.reminderEnabled ? detail.reminderTime : "",
    reminderFrequency: detail.reminderEnabled ? detail.reminderFrequency : "",
  };

  return [updatedFirstItem, ...scheduleItems.slice(1)];
}

function printProtocolSheet(
  calculation: SavedCalculationRow,
  detail: ProtocolDetailDraft,
) {
  if (typeof window === "undefined") {
    return false;
  }

  const printWindow = window.open("", "_blank", "width=900,height=720");

  if (!printWindow) {
    return false;
  }

  const snapshot = getFirstScheduleRecord(calculation.schedule);
  const doseInputUnit = getStringValue(snapshot, "doseInputUnit");
  const doseLabel =
    getStringValue(snapshot, "doseLabel") ||
    `${formatSavedNumber(calculation.dose_mcg, 3)} mcg`;
  const markLabel =
    getStringValue(snapshot, "syringeMarkLabel") || "Saved mark";
  const vialValue = getNumberValue(snapshot, "vialMg") ?? 0;
  const vialLabel =
    doseInputUnit === "iu"
      ? `${formatSavedNumber(vialValue, 0)} IU`
      : `${formatSavedNumber(vialValue, 3)} mg`;
  const waterLabel = `${formatSavedNumber(
    getNumberValue(snapshot, "waterMl") ?? 0,
    3,
  )} mL`;
  const liquidLabel = `${formatSavedNumber(calculation.dose_ml, 4)} mL`;
  const savedDate = formatSavedDate(calculation.created_at);
  const reminderLabel = detail.reminderEnabled
    ? `${formatReminderFrequency(detail.reminderFrequency)} starting ${
        detail.reminderDate || "not set"
      } at ${detail.reminderTime || "not set"}`
    : "No reminder plan saved";

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(calculation.plan_name)} | PeptiCalc</title>
    <style>
      body {
        margin: 0;
        color: #0f172a;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f8fbff;
      }
      main {
        max-width: 760px;
        margin: 0 auto;
        padding: 32px;
      }
      header {
        border-bottom: 2px solid #bae6fd;
        padding-bottom: 18px;
      }
      .eyebrow {
        color: #0369a1;
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      h1 {
        margin: 8px 0 0;
        font-size: 32px;
        line-height: 1.1;
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
        margin-top: 22px;
      }
      .card {
        border: 1px solid #dbeafe;
        border-radius: 18px;
        background: #fff;
        padding: 14px;
      }
      .label {
        color: #64748b;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      .value {
        margin-top: 6px;
        font-size: 19px;
        font-weight: 750;
      }
      .notes {
        margin-top: 22px;
        border: 1px solid #dbeafe;
        border-radius: 18px;
        background: #fff;
        padding: 16px;
        white-space: pre-wrap;
      }
      .fine {
        margin-top: 22px;
        color: #64748b;
        font-size: 12px;
        line-height: 1.6;
      }
      @media print {
        body { background: #fff; }
        main { padding: 0; }
      }
    </style>
  </head>
  <body>
    <main>
      <header>
        <div class="eyebrow">PeptiCalc printable calculation sheet</div>
        <h1>${escapeHtml(calculation.plan_name)}</h1>
        <p>Saved ${escapeHtml(savedDate)}</p>
      </header>
      <section class="grid">
        ${printCard("Dose", doseLabel)}
        ${printCard("Pull syringe to", markLabel)}
        ${printCard("Vial amount", vialLabel)}
        ${printCard("BAC water", waterLabel)}
        ${printCard("Liquid volume", liquidLabel)}
        ${printCard("Reminder", reminderLabel)}
      </section>
      <section class="notes">
        <div class="label">Protocol notes</div>
        <p>${escapeHtml(detail.notes || "No notes saved.")}</p>
      </section>
      <p class="fine">
        This sheet is calculator math only. It does not prescribe treatment,
        diagnose, or replace the product label, pharmacy instructions, or
        prescriber directions.
      </p>
    </main>
  </body>
</html>`);
  printWindow.document.close();
  printWindow.focus();
  window.setTimeout(() => printWindow.print(), 250);

  return true;
}

function printCard(label: string, value: string) {
  return `<div class="card"><div class="label">${escapeHtml(
    label,
  )}</div><div class="value">${escapeHtml(value)}</div></div>`;
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

function getBooleanValue(record: Record<string, unknown> | null, key: string) {
  if (!record) {
    return false;
  }

  return record[key] === true;
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

function formatReminderFrequency(value: string) {
  return (
    reminderFrequencyOptions.find((option) => option.value === value)?.label ??
    value
  );
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

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
