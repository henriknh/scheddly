"use server";

import {
  SubscriptionBillingInterval as PrismaBillingInterval,
  SubscriptionTier,
} from "@/generated/prisma";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

export async function handleSubscriptionCreated(
  subscription: Stripe.Subscription
) {
  console.info("[WEBHOOK] Subscription created:", subscription.id);

  const { userId, subscriptionTier } = subscription.metadata as {
    userId: string;
    subscriptionTier: SubscriptionTier;
  };

  if (!userId || !subscriptionTier) {
    console.error("[WEBHOOK] Missing metadata in subscription");
    return;
  }

  const intervalRaw = subscription.items.data[0]?.price.recurring?.interval;
  const prismaInterval: PrismaBillingInterval | undefined =
    intervalRaw === "month"
      ? "monthly"
      : intervalRaw === "year"
      ? "yearly"
      : undefined;

  const cancelAtPeriodEnd = subscription.cancel_at_period_end ?? false;

  const cpStart = subscription?.items?.data?.[0]?.current_period_start;
  const cpEnd = subscription?.items?.data?.[0]?.current_period_end;

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      subscriptionTier: subscriptionTier,
      billingInterval: prismaInterval,
      cancelAtPeriodEnd,
      currentPeriodStart: cpStart ? new Date(cpStart * 1000) : null,
      currentPeriodEnd: cpEnd ? new Date(cpEnd * 1000) : null,
    },
    create: {
      userId,
      stripeCustomerId: subscription.customer as string,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      subscriptionTier: subscriptionTier,
      billingInterval: prismaInterval,
      cancelAtPeriodEnd,
      currentPeriodStart: cpStart ? new Date(cpStart * 1000) : null,
      currentPeriodEnd: cpEnd ? new Date(cpEnd * 1000) : null,
    },
  });

  console.info(
    `[WEBHOOK] User ${userId} subscription updated to ${subscriptionTier} with ID ${subscription.id}`
  );
}
