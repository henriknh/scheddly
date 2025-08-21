"use server";

import {
  SubscriptionStatus,
  type SubscriptionBillingInterval as BillingInterval,
} from "@/generated/prisma";
import prisma from "@/lib/prisma";
import {
  getBillingIntervalFromPriceId,
  getStripePriceId,
  getSubscriptionFromPriceId,
  stripe,
} from "@/lib/stripe";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";

// no-op: period fields not persisted; we avoid converting timestamps

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { subscriptionTier, billingInterval = "monthly" } = body;

    // Validate required fields
    if (!subscriptionTier) {
      return NextResponse.json(
        { error: "Subscription tier is required" },
        { status: 400 }
      );
    }

    // Get the Stripe price ID for the new subscription tier
    const newPriceId = getStripePriceId(subscriptionTier, billingInterval);

    if (!newPriceId) {
      return NextResponse.json(
        { error: "Invalid subscription tier or billing interval" },
        { status: 400 }
      );
    }

    // Load Stripe subscription record for this user
    const stripeSub = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!stripeSub || !stripeSub.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found for user" },
        { status: 400 }
      );
    }

    // Check if user has an active subscription
    if (!stripeSub.stripeSubscriptionId) {
      return NextResponse.json(
        {
          error:
            "No active subscription found. Please create a new subscription first.",
        },
        { status: 400 }
      );
    }

    // Get the current subscription from Stripe
    const subscription = (await stripe.subscriptions.retrieve(
      stripeSub.stripeSubscriptionId
    )) as Stripe.Subscription;

    if (!subscription || subscription.status !== "active") {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Get current subscription item
    const subscriptionItem = subscription.items.data[0];

    if (!subscriptionItem) {
      return NextResponse.json(
        { error: "Invalid subscription structure" },
        { status: 400 }
      );
    }

    // Check if the new price is different from current price
    if (subscriptionItem.price.id === newPriceId) {
      return NextResponse.json(
        { error: "Already subscribed to this plan and billing interval" },
        { status: 400 }
      );
    }

    // Determine if this is an upgrade or downgrade
    const currentPriceId = subscriptionItem.price.id;
    const currentTier = getSubscriptionFromPriceId(currentPriceId);
    const tierHierarchy = { STARTER: 1, CREATOR: 2, PRO: 3 };

    const currentTierValue = currentTier
      ? tierHierarchy[currentTier as keyof typeof tierHierarchy]
      : 0;
    const newTierValue =
      tierHierarchy[subscriptionTier as keyof typeof tierHierarchy];

    const isUpgrade = newTierValue > currentTierValue;
    const isDowngrade = newTierValue < currentTierValue;
    const isBillingIntervalChange =
      currentTier === subscriptionTier && newTierValue === currentTierValue;

    const updateParams: Stripe.SubscriptionUpdateParams = {
      items: [
        {
          id: subscriptionItem.id,
          price: newPriceId,
        },
      ],
      metadata: {
        userId: user.id,
        subscriptionTier,
        billingInterval,
      },
    };

    if (isUpgrade || isBillingIntervalChange) {
      // Upgrades and billing interval changes: immediate with proration
      updateParams.proration_behavior = "create_prorations";
    } else if (isDowngrade) {
      // Downgrades: apply at end of current period (no refunds/credits)
      updateParams.proration_behavior = "none";
    } else {
      // Default: immediate with proration
      updateParams.proration_behavior = "create_prorations";
    }

    // Update the subscription
    const updatedSubscription = (await stripe.subscriptions.update(
      stripeSub.stripeSubscriptionId!,
      updateParams
    )) as Stripe.Subscription;

    // Update Subscription tier immediately
    await prisma.subscription.upsert({
      where: { userId: user.id },
      update: {
        stripeSubscriptionId: updatedSubscription.id,
        status: updatedSubscription.status,
        subscriptionTier: subscriptionTier,
        billingInterval: billingInterval as BillingInterval,
        cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end ?? false,
      },
      create: {
        userId: user.id,
        stripeCustomerId: stripeSub.stripeCustomerId!,
        stripeSubscriptionId: updatedSubscription.id,
        status: updatedSubscription.status,
        subscriptionTier: subscriptionTier,
        billingInterval: billingInterval as BillingInterval,
        cancelAtPeriodEnd: updatedSubscription.cancel_at_period_end ?? false,
      },
    });

    return NextResponse.json({
      success: true,
      subscription: {
        id: updatedSubscription.id,
        status: updatedSubscription.status,
        tier: subscriptionTier,
        billingInterval,
        changeType: isUpgrade
          ? "upgrade"
          : isDowngrade
          ? "downgrade"
          : "billing_change",
        effectiveDate: isDowngrade ? "end_of_period" : "immediate",
      },
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripeSubForGet = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!stripeSubForGet || !stripeSubForGet.stripeCustomerId) {
      return NextResponse.json({
        subscription: null,
        message: "No Stripe customer found",
      });
    }

    // If we have a stored subscription ID, try to get it from Stripe
    if (stripeSubForGet.stripeSubscriptionId) {
      try {
        const subscription = (await stripe.subscriptions.retrieve(
          stripeSubForGet.stripeSubscriptionId,
          {
            expand: ["items.data.price"],
          }
        )) as Stripe.Subscription;

        // Check if subscription is still active in Stripe
        if (
          subscription &&
          (subscription.status === SubscriptionStatus.active ||
            subscription.status === SubscriptionStatus.trialing)
        ) {
          const subscriptionItem = subscription.items.data[0];
          const priceId = subscriptionItem?.price.id;

          const currentTier = priceId
            ? getSubscriptionFromPriceId(priceId)
            : null;
          const currentBillingInterval = priceId
            ? getBillingIntervalFromPriceId(priceId)
            : null;

          return NextResponse.json({
            subscription: {
              id: subscription.id,
              status: subscription.status,
              tier: currentTier,
              billingInterval: currentBillingInterval,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              priceId: priceId,
            },
          });
        } else {
          // Subscription is no longer active - sync database
          await prisma.subscription.update({
            where: { userId: user.id },
            data: {
              stripeSubscriptionId: null,
              status: subscription.status,
              cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
            },
          });
        }
      } catch (stripeError) {
        console.error(
          "Subscription not found in Stripe, clearing database:",
          stripeError
        );
        // Subscription doesn't exist in Stripe - clear database
        await prisma.subscription.update({
          where: { userId: user.id },
          data: {
            stripeSubscriptionId: null,
            status: SubscriptionStatus.canceled,
          },
        });
      }
    }

    // If no stored subscription or it was cleared, check for any active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeSubForGet.stripeCustomerId!,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length > 0) {
      const subscription = subscriptions.data[0] as Stripe.Subscription;
      const subscriptionItem = subscription.items.data[0];
      const priceId = subscriptionItem?.price.id;
      const subscriptionTier = priceId
        ? getSubscriptionFromPriceId(priceId)
        : null;

      if (subscriptionTier) {
        const currentBillingInterval = priceId
          ? getBillingIntervalFromPriceId(priceId)
          : null;
        // Found active subscription - update database
        await prisma.subscription.upsert({
          where: { userId: user.id },
          update: {
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            subscriptionTier: subscriptionTier,
            billingInterval: currentBillingInterval
              ? (currentBillingInterval as BillingInterval)
              : undefined,
            cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
          },
          create: {
            userId: user.id,
            stripeCustomerId: stripeSubForGet.stripeCustomerId!,
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            subscriptionTier: subscriptionTier,
            billingInterval: currentBillingInterval
              ? (currentBillingInterval as BillingInterval)
              : undefined,
            cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
          },
        });

        return NextResponse.json({
          subscription: {
            id: subscription.id,
            status: subscription.status,
            tier: subscriptionTier,
            billingInterval: currentBillingInterval,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            priceId: priceId,
          },
        });
      }
    }

    return NextResponse.json({
      subscription: null,
      message: "No active subscription found",
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stripeSubForDelete = await prisma.subscription.findUnique({
      where: { userId: user.id },
    });

    if (!stripeSubForDelete?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    // Cancel the subscription at the end of the current period
    const subscription = (await stripe.subscriptions.update(
      stripeSubForDelete.stripeSubscriptionId!,
      {
        cancel_at_period_end: true,
      }
    )) as Stripe.Subscription;

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
