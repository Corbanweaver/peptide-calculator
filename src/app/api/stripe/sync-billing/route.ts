import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { hasProAccess } from "@/lib/billing";
import { getStripe, getStripeProPriceId } from "@/lib/stripe/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type BillingCustomerRow = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  subscription_status: string;
  subscription_cancel_at_period_end: boolean;
  subscription_current_period_end: string | null;
};

type SyncRequestBody = {
  session_id?: unknown;
};

export async function GET() {
  return handleBillingStatusRequest({ sync: false });
}

export async function POST(request: NextRequest) {
  const body = await readSyncRequestBody(request);

  return handleBillingStatusRequest({
    sync: true,
    checkoutSessionId: sanitizeStripeId(body.session_id, "cs_"),
  });
}

async function handleBillingStatusRequest({
  sync,
  checkoutSessionId,
}: {
  sync: boolean;
  checkoutSessionId?: string | null;
}) {
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
      .select(
        "user_id, stripe_customer_id, stripe_subscription_id, stripe_price_id, subscription_status, subscription_cancel_at_period_end, subscription_current_period_end",
      )
      .eq("user_id", user.id)
      .maybeSingle();

    if (billingError) {
      throw billingError;
    }

    const existingBillingRow = billingRow as BillingCustomerRow | null;

    if (!sync) {
      return NextResponse.json(buildBillingResponse(existingBillingRow));
    }

    const stripe = getStripe();
    const priceId = getStripeProPriceId();
    const customerIds = new Set<string>();
    addStripeId(customerIds, existingBillingRow?.stripe_customer_id);

    const sessionSubscription = checkoutSessionId
      ? await readSubscriptionFromCheckoutSession({
          checkoutSessionId,
          currentUserId: user.id,
          customerIds,
          priceId,
          stripe,
        })
      : null;

    if (user.email) {
      const matchingCustomers = await stripe.customers.list({
        email: user.email,
        limit: 10,
      });

      matchingCustomers.data.forEach((customer) => addStripeId(customerIds, customer.id));
    }

    const subscription =
      sessionSubscription ??
      (await findBestProSubscription(stripe, [...customerIds], priceId));

    if (subscription) {
      const nextBillingRow = await upsertSubscriptionStatus({
        admin,
        priceId,
        stripeCustomerId: getStripeCustomerId(subscription.customer),
        subscription,
        userId: user.id,
      });

      return NextResponse.json(buildBillingResponse(nextBillingRow));
    }

    const stripeCustomerId =
      existingBillingRow?.stripe_customer_id ?? [...customerIds][0] ?? null;

    if (!stripeCustomerId) {
      return NextResponse.json(buildBillingResponse(null));
    }

    const nextBillingRow = await upsertInactiveStatus({
      admin,
      stripeCustomerId,
      userId: user.id,
    });

    return NextResponse.json(buildBillingResponse(nextBillingRow));
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

async function readSubscriptionFromCheckoutSession({
  checkoutSessionId,
  currentUserId,
  customerIds,
  priceId,
  stripe,
}: {
  checkoutSessionId: string;
  currentUserId: string;
  customerIds: Set<string>;
  priceId: string;
  stripe: Stripe;
}) {
  const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
  const sessionUserId =
    session.client_reference_id || session.metadata?.supabase_user_id;

  if (sessionUserId && sessionUserId !== currentUserId) {
    throw new Error("That Checkout session belongs to a different account.");
  }

  addStripeId(customerIds, getStripeCustomerId(session.customer));

  if (!session.subscription) {
    return null;
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  return isProSubscription(subscription, priceId) ? subscription : null;
}

async function findBestProSubscription(
  stripe: Stripe,
  customerIds: string[],
  priceId: string,
) {
  const subscriptions = (
    await Promise.all(
      customerIds.map((customerId) =>
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
      (item) => isProSubscription(item, priceId) && hasProAccess(item.status),
    ) ?? subscriptions.find((item) => isProSubscription(item, priceId)) ?? null
  );
}

async function upsertSubscriptionStatus({
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
  const nextBillingRow = {
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
  };

  const { error: upsertError } = await admin
    .from("billing_customers")
    .upsert(nextBillingRow, { onConflict: "user_id" });

  if (upsertError) {
    throw upsertError;
  }

  return nextBillingRow;
}

async function upsertInactiveStatus({
  admin,
  stripeCustomerId,
  userId,
}: {
  admin: ReturnType<typeof createAdminClient>;
  stripeCustomerId: string;
  userId: string;
}) {
  const nextBillingRow = {
    user_id: userId,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: null,
    stripe_price_id: null,
    subscription_status: "inactive",
    subscription_cancel_at_period_end: false,
    subscription_current_period_end: null,
    updated_at: new Date().toISOString(),
  };

  const { error: upsertError } = await admin
    .from("billing_customers")
    .upsert(nextBillingRow, { onConflict: "user_id" });

  if (upsertError) {
    throw upsertError;
  }

  return nextBillingRow;
}

async function readSyncRequestBody(request: NextRequest) {
  try {
    return (await request.json()) as SyncRequestBody;
  } catch {
    return {};
  }
}

function isProSubscription(subscription: Stripe.Subscription, priceId: string) {
  return subscription.items.data.some((item) => item.price.id === priceId);
}

function buildBillingResponse(billingRow: BillingCustomerRow | null) {
  return {
    billing_status: billingRow
      ? {
          stripe_customer_id: billingRow.stripe_customer_id,
          stripe_subscription_id: billingRow.stripe_subscription_id,
          stripe_price_id: billingRow.stripe_price_id,
          subscription_status: billingRow.subscription_status,
          subscription_cancel_at_period_end:
            billingRow.subscription_cancel_at_period_end,
          subscription_current_period_end:
            billingRow.subscription_current_period_end,
        }
      : null,
    pro: hasProAccess(billingRow?.subscription_status),
    subscription_status: billingRow?.subscription_status ?? null,
  };
}

function addStripeId(ids: Set<string>, value: unknown) {
  if (typeof value === "string" && value.trim()) {
    ids.add(value.trim());
  }
}

function getStripeCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null,
) {
  if (!customer) {
    return "";
  }

  return typeof customer === "string" ? customer : customer.id;
}

function sanitizeStripeId(value: unknown, prefix: string) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();
  return trimmedValue.startsWith(prefix) ? trimmedValue : null;
}

function unixTimestampToIso(value: number | null | undefined) {
  return value ? new Date(value * 1000).toISOString() : null;
}
