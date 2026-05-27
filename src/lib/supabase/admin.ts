import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseEnv } from "@/lib/supabase/env";

type BillingCustomerRow = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  subscription_status: string;
  subscription_cancel_at_period_end: boolean;
  subscription_current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

type AdminDatabase = {
  public: {
    Tables: {
      billing_customers: {
        Row: BillingCustomerRow;
        Insert: Partial<BillingCustomerRow> & { user_id: string };
        Update: Partial<BillingCustomerRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let adminClient: ReturnType<typeof createSupabaseClient<AdminDatabase>> | null =
  null;

export function isSupabaseAdminConfigured() {
  return Boolean(getSupabaseAdminKey());
}

export function createAdminClient() {
  if (adminClient) {
    return adminClient;
  }

  const { url } = requireSupabaseEnv();
  const adminKey = getSupabaseAdminKey();

  if (!adminKey) {
    throw new Error(
      "Supabase admin key is not configured. Set SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  adminClient = createSupabaseClient<AdminDatabase>(url, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}

function getSupabaseAdminKey() {
  return (
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  );
}
