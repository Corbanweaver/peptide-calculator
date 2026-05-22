import { NextResponse } from "next/server";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl, getStripe } from "@/lib/stripe/server";

export const runtime = "nodejs";

type BillingCustomerRow = {
  stripe_customer_id: string | null;
};

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sign in before managing PeptiCalc Pro." },
        { status: 401 },
      );
    }

    if (userError) {
      throw userError;
    }

    const admin = createAdminClient();
    const { data: billingRow, error: billingError } = await admin
      .from("billing_customers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (billingError) {
      throw billingError;
    }

    const stripeCustomerId = (billingRow as BillingCustomerRow | null)
      ?.stripe_customer_id;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer is attached to this account yet." },
        { status: 404 },
      );
    }

    const portalSession = await getStripe().billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${getSiteUrl()}/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not open the Stripe customer portal.",
      },
      { status: 500 },
    );
  }
}
