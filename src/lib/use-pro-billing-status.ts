"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { hasProAccess } from "@/lib/billing";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type BillingCustomerRow = {
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  subscription_status: string;
  subscription_cancel_at_period_end: boolean;
  subscription_current_period_end: string | null;
};

type BillingStatusResponse = {
  billing_status?: BillingCustomerRow | null;
  error?: string;
};

export function useProBillingStatus() {
  const configured = isSupabaseConfigured();
  const supabase = useMemo(() => (configured ? createClient() : null), [configured]);

  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(!configured);
  const [billingStatus, setBillingStatus] = useState<BillingCustomerRow | null>(
    null,
  );
  const [billingChecked, setBillingChecked] = useState(false);
  const [loadingBilling, setLoadingBilling] = useState(false);
  const [billingError, setBillingError] = useState("");

  const refreshBilling = useCallback(
    async ({ sync = false }: { sync?: boolean } = {}) => {
      if (!user) {
        setBillingStatus(null);
        setBillingChecked(true);
        setLoadingBilling(false);
        setBillingError("");
        return;
      }

      setLoadingBilling(true);
      setBillingError("");

      try {
        const response = await fetch("/api/stripe/sync-billing", {
          method: sync ? "POST" : "GET",
          headers: sync
            ? {
                "Content-Type": "application/json",
              }
            : undefined,
          body: sync ? "{}" : undefined,
        });
        const data = (await response.json().catch(() => ({}))) as
          BillingStatusResponse;

        if (response.status === 401) {
          setUser(null);
          setBillingStatus(null);
          return;
        }

        if (!response.ok) {
          throw new Error(data.error || "Could not load billing status.");
        }

        setBillingStatus(data.billing_status ?? null);
      } catch (error) {
        setBillingStatus(null);
        setBillingError(
          error instanceof Error
            ? error.message
            : "Could not load billing status.",
        );
      } finally {
        setBillingChecked(true);
        setLoadingBilling(false);
      }
    },
    [user],
  );

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
      setAuthChecked(true);
      setBillingStatus(null);
      setBillingChecked(!activeUser);
      setBillingError("");
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        setAuthChecked(true);
        setBillingStatus(null);
        setBillingChecked(!session?.user);
        setBillingError("");
      },
    );

    return () => {
      alive = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    if (!authChecked) {
      return;
    }

    if (!user) {
      return;
    }

    const loadTimer = window.setTimeout(() => {
      void refreshBilling();
    }, 0);

    return () => window.clearTimeout(loadTimer);
  }, [authChecked, refreshBilling, user]);

  const proEnabled = hasProAccess(billingStatus?.subscription_status);
  const loading =
    !authChecked || loadingBilling || (Boolean(user) && !billingChecked);

  return {
    authChecked,
    billingChecked,
    billingError,
    billingStatus,
    configured,
    loading,
    proEnabled,
    refreshBilling,
    signedIn: Boolean(user),
    user,
  };
}
