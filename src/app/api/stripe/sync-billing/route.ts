import { NextResponse } from "next/server";
import Stripe from "stripe";
import { hasProAccess } from "@/lib/billing";
import { getStripe, getStripeProPriceId } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

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
        { error: "Sign in before syncing PeptiCalc Pro." },
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

    const priceId = getStripeProPriceId();
    const subscriptions = await getStripe().subscriptions.list({
      customer: stripeCustomerId,
      limit: 10,
      status: "all",
    });
    const subscription =
      subscriptions.data.find(
        (item) => isProSubscription(item, priceId) && hasProAccess(item.status),
      ) ?? subscriptions.data.find((item) => isProSubscription(item, priceId));

    if (!subscription) {
      const { error: upsertError } = await admin
        .from("billing_customers")
        .upsert(
          {
            user_id: user.id,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: null,
            stripe_price_id: null,
            subscription_status: "inactive",
            subscription_cancel_at_period_end: false,
            subscription_current_period_end: null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );

      if (upsertError) {
        throw upsertError;
      }

      return NextResponse.json({ subscription_status: "inactive" });
    }

    const firstItem =
      subscription.items.data.find((item) => item.price.id === priceId) ??
      subscription.items.data[0];
    const { error: upsertError } = await admin
      .from("billing_customers")
      .upsert(
        {
          user_id: user.id,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: subscription.id,
          stripe_price_id: firstItem?.price.id ?? null,
          subscription_status: subscription.status,
          subscription_cancel_at_period_end: subscription.cancel_at_period_end,
          subscription_current_period_end: unixTimestampToIso(
            firstItem?.current_period_end,
          ),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

    if (upsertError) {
      throw upsertError;
    }

    return NextResponse.json({
      subscription_status: subscription.status,
      pro: hasProAccess(subscription.status),
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not sync Stripe billing.",
      },
      { status: 500 },
    );
  }
}

function isProSubscription(subscription: Stripe.Subscription, priceId: string) {
  return subscription.items.data.some((item) => item.price.id === priceId);
}

function unixTimestampToIso(value: number | null | undefined) {
  return value ? new Date(value * 1000).toISOString() : null;
}
