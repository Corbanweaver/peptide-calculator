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
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
}

export function createAdminClient() {
  if (adminClient) {
    return adminClient;
  }

  const { url } = requireSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  adminClient = createSupabaseClient<AdminDatabase>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
