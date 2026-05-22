import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe/server";

export const runtime = "nodejs";

type BillingCustomerLookup = {
  user_id: string;
};

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 },
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      getStripeWebhookSecret(),
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid Stripe webhook signature.",
      },
      { status: 400 },
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await syncSubscription(event.data.object as Stripe.Subscription);
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not process Stripe webhook.",
      },
      { status: 500 },
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.mode !== "subscription" || !session.subscription) {
    return;
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id;
  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);

  await syncSubscription(
    subscription,
    session.client_reference_id || session.metadata?.supabase_user_id,
  );
}

async function syncSubscription(
  subscription: Stripe.Subscription,
  fallbackUserId?: string | null,
) {
  const admin = createAdminClient();
  const stripeCustomerId = getStripeCustomerId(subscription.customer);

  if (!stripeCustomerId) {
    throw new Error("Stripe subscription is missing a customer id.");
  }

  const userId =
    subscription.metadata?.supabase_user_id ||
    fallbackUserId ||
    (await lookupUserIdByStripeCustomer(stripeCustomerId));

  if (!userId) {
    throw new Error("Could not map Stripe subscription to a Supabase user.");
  }

  const firstItem = subscription.items.data[0];
  const { error } = await admin
    .from("billing_customers")
    .upsert(
      {
        user_id: userId,
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: subscription.id,
        stripe_price_id: firstItem?.price?.id ?? null,
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

async function lookupUserIdByStripeCustomer(stripeCustomerId: string) {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("billing_customers")
    .select("user_id")
    .eq("stripe_customer_id", stripeCustomerId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data as BillingCustomerLookup | null)?.user_id ?? null;
}

function getStripeCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer,
) {
  return typeof customer === "string" ? customer : customer.id;
}

function unixTimestampToIso(value: number | null | undefined) {
  return value ? new Date(value * 1000).toISOString() : null;
}
