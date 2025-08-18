"use server";

import { SubscriptionStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  console.info("[WEBHOOK] Subscription deleted:", subscription.id);

  const { teamId } = subscription.metadata || {};

  if (!teamId) {
    console.error("[WEBHOOK] Missing teamId in subscription metadata");
    return;
  }

  await prisma.subscription.update({
    where: { teamId },
    data: {
      subscriptionTier: null,
      stripeSubscriptionId: null,
      status: SubscriptionStatus.canceled,
    },
  });

  console.info(`[WEBHOOK] Team ${teamId} subscription removed`);
}
