import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl, getStripe, getStripeProPriceId } from "@/lib/stripe/server";
import { hasProAccess } from "@/lib/billing";

export const runtime = "nodejs";

type BillingCustomerRow = {
  stripe_customer_id: string | null;
  subscription_status: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Sign in before starting PeptiCalc Pro." },
        { status: 401 },
      );
    }

    if (userError) {
      throw userError;
    }

    const stripe = getStripe();
    const admin = createAdminClient();
    const priceId = getStripeProPriceId();
    const siteUrl = getSiteUrl();
    const context = await readCheckoutContext(request);

    const { data: billingRow, error: billingError } = await admin
      .from("billing_customers")
      .select("stripe_customer_id, subscription_status")
      .eq("user_id", user.id)
      .maybeSingle();

    if (billingError) {
      throw billingError;
    }

    const existingBillingRow = billingRow as BillingCustomerRow | null;

    if (
      existingBillingRow?.stripe_customer_id &&
      hasProAccess(existingBillingRow.subscription_status)
    ) {
      return NextResponse.json({ url: `${siteUrl}/account?checkout=success` });
    }

    const stripeCustomerId =
      existingBillingRow?.stripe_customer_id ||
      (await createStripeCustomer(stripe, {
        userId: user.id,
        email: user.email ?? undefined,
      }));

    if (!existingBillingRow?.stripe_customer_id) {
      const { error: upsertError } = await admin
        .from("billing_customers")
        .upsert(
          {
            user_id: user.id,
            stripe_customer_id: stripeCustomerId,
            subscription_status: "inactive",
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" },
        );

      if (upsertError) {
        throw upsertError;
      }
    }

    const existingSubscription = await findActiveProSubscriptionForUser({
      email: user.email,
      priceId,
      stripe,
      stripeCustomerId,
    });

    if (existingSubscription) {
      const existingSubscriptionCustomerId = getStripeCustomerId(
        existingSubscription.customer,
      );

      await syncSubscriptionStatus({
        admin,
        priceId,
        stripeCustomerId: existingSubscriptionCustomerId,
        subscription: existingSubscription,
        userId: user.id,
      });

      return NextResponse.json({ url: `${siteUrl}/account?checkout=success` });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId,
      client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${siteUrl}/account?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/account?checkout=canceled`,
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
        },
      },
      metadata: {
        supabase_user_id: user.id,
        source: context.source,
        placement: context.placement,
      },
    });

    if (!session.url) {
      throw new Error("Stripe did not return a Checkout URL.");
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not start Stripe Checkout.",
      },
      { status: 500 },
    );
  }
}

async function createStripeCustomer(
  stripe: Stripe,
  {
    userId,
    email,
  }: {
    userId: string;
    email?: string;
  },
) {
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabase_user_id: userId,
    },
  });

  return customer.id;
}

async function findActiveProSubscriptionForUser({
  email,
  priceId,
  stripe,
  stripeCustomerId,
}: {
  email?: string | null;
  priceId: string;
  stripe: Stripe;
  stripeCustomerId: string;
}) {
  const customerIds = new Set([stripeCustomerId]);

  if (email) {
    const matchingCustomers = await stripe.customers.list({
      email,
      limit: 10,
    });

    matchingCustomers.data.forEach((customer) => customerIds.add(customer.id));
  }

  const subscriptions = (
    await Promise.all(
      [...customerIds].map((customerId) =>
        stripe.subscriptions.list({
          customer: customerId,
          limit: 10,
          status: "all",
        }),
      ),
    )
  ).flatMap((result) => result.data);

  return (
    subscriptions.find(
      (subscription) =>
        subscription.items.data.some((item) => item.price.id === priceId) &&
        hasProAccess(subscription.status),
    ) ?? null
  );
}

async function syncSubscriptionStatus({
  admin,
  priceId,
  stripeCustomerId,
  subscription,
  userId,
}: {
  admin: ReturnType<typeof createAdminClient>;
  priceId: string;
  stripeCustomerId: string;
  subscription: Stripe.Subscription;
  userId: string;
}) {
  const firstItem =
    subscription.items.data.find((item) => item.price.id === priceId) ??
    subscription.items.data[0];
  const { error } = await admin
    .from("billing_customers")
    .upsert(
      {
        user_id: userId,
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

  if (error) {
    throw error;
  }
}

async function readCheckoutContext(request: NextRequest) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    return {
      source: sanitizeMetadataValue(body.source, "checkout"),
      placement: sanitizeMetadataValue(body.placement, "unknown"),
    };
  } catch {
    return {
      source: "checkout",
      placement: "unknown",
    };
  }
}

function sanitizeMetadataValue(value: unknown, fallback: string) {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmedValue = value.trim();
  return trimmedValue ? trimmedValue.slice(0, 80) : fallback;
}

function getStripeCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer,
) {
  return typeof customer === "string" ? customer : customer.id;
}

function unixTimestampToIso(value: number | null | undefined) {
  return value ? new Date(value * 1000).toISOString() : null;
}
