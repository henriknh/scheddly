"use server";

import {
  SubscriptionBillingInterval as PrismaBillingInterval,
  SubscriptionStatus,
  SubscriptionTier,
} from "@/generated/prisma";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  console.info("[WEBHOOK] Subscription updated:", subscription.id);

  const { teamId, subscriptionTier } = subscription.metadata as {
    teamId: string;
    subscriptionTier: SubscriptionTier;
  };

  if (!teamId) {
    console.error("[WEBHOOK] Missing teamId in subscription metadata");
    return;
  }

  if (subscription.status === SubscriptionStatus.active && subscriptionTier) {
    const cancelAtPeriodEnd = subscription.cancel_at_period_end ?? false;
    const intervalRaw2 = subscription.items.data[0]?.price.recurring?.interval;
    const prismaInterval2: PrismaBillingInterval | undefined =
      intervalRaw2 === "month"
        ? "monthly"
        : intervalRaw2 === "year"
        ? "yearly"
        : undefined;

    const cpStart = subscription?.items?.data?.[0]?.current_period_start;
    const cpEnd = subscription?.items?.data?.[0]?.current_period_end;

    await prisma.subscription.upsert({
      where: { teamId },
      update: {
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        subscriptionTier: subscriptionTier,
        billingInterval: prismaInterval2,
        cancelAtPeriodEnd: cancelAtPeriodEnd,
        currentPeriodStart: cpStart ? new Date(cpStart * 1000) : null,
        currentPeriodEnd: cpEnd ? new Date(cpEnd * 1000) : null,
      },
      create: {
        teamId,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        status: subscription.status,
        subscriptionTier: subscriptionTier,
        billingInterval: prismaInterval2,
        cancelAtPeriodEnd: cancelAtPeriodEnd,
        currentPeriodStart: cpStart ? new Date(cpStart * 1000) : null,
        currentPeriodEnd: cpEnd ? new Date(cpEnd * 1000) : null,
      },
    });
    console.info(
      `[WEBHOOK] Team ${teamId} subscription updated to ${subscriptionTier} with ID ${subscription.id}`
    );
  } else if (
    subscription.status === SubscriptionStatus.canceled ||
    subscription.status === SubscriptionStatus.incomplete_expired
  ) {
    const cancelCanceled = subscription.cancel_at_period_end ?? false;
    await prisma.subscription.update({
      where: { teamId },
      data: {
        subscriptionTier: null,
        stripeSubscriptionId: null,
        status: subscription.status,
        cancelAtPeriodEnd: cancelCanceled,
      },
    });
    console.info(`[WEBHOOK] Team ${teamId} subscription removed`);
  }
}
