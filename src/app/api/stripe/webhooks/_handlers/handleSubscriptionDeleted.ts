"use server";

import { SubscriptionStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  console.info("[WEBHOOK] Subscription deleted:", subscription.id);

  const { userId } = subscription.metadata || {};

  if (!userId) {
    console.error("[WEBHOOK] Missing userId in subscription metadata");
    return;
  }

  await prisma.subscription.update({
    where: { userId },
    data: {
      subscriptionTier: null,
      stripeSubscriptionId: null,
      status: SubscriptionStatus.canceled,
    },
  });

  console.info(`[WEBHOOK] User ${userId} subscription removed`);
}
