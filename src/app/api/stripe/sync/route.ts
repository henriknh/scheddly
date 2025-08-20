"use server";

import { NextResponse } from "next/server";
import {
  stripe,
  getSubscriptionFromPriceId,
  getBillingIntervalFromPriceId,
} from "@/lib/stripe";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import prisma from "@/lib/prisma";
import {
  SubscriptionTier,
  SubscriptionBillingInterval as BillingInterval,
  SubscriptionStatus,
} from "@/generated/prisma";
// Note: We avoid importing the full Stripe types here; we only access a few fields via narrow casts

export async function POST() {
  try {
    const user = await getUserFromToken();

    if (!user || !user.team) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const team = user.team;

    // Load Stripe subscription record for this team (holds customerId)
    const stripeSub = await prisma.subscription.findUnique({
      where: { teamId: team.id },
    });

    if (!stripeSub || !stripeSub.stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 400 }
      );
    }

    // Get all subscriptions for this customer from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeSub.stripeCustomerId,
      status: "all", // Include all statuses
      limit: 10,
    });

    const syncResult: {
      before: {
        dbSubscription: SubscriptionTier | null;
        dbSubscriptionId: string | null;
      };
      after: {
        dbSubscription: SubscriptionTier | null;
        dbSubscriptionId: string | null;
      };
      stripeSubscriptions: Array<{
        id: string;
        status: string;
        priceId?: string;
        tier: string | null;
        billingInterval: "monthly" | "yearly" | null;

        cancelAtPeriodEnd: boolean | null;
      }>;
    } = {
      before: {
        dbSubscription: stripeSub?.subscriptionTier ?? null,
        dbSubscriptionId: stripeSub?.stripeSubscriptionId ?? null,
      },
      after: {
        dbSubscription: null,
        dbSubscriptionId: null,
      },
      stripeSubscriptions: subscriptions.data.map((sub) => {
        const priceId = sub.items.data[0]?.price.id;
        const cancelAt = sub.cancel_at_period_end;
        return {
          id: sub.id,
          status: sub.status,
          priceId,
          tier: priceId ? getSubscriptionFromPriceId(priceId) : null,
          billingInterval: priceId
            ? getBillingIntervalFromPriceId(priceId)
            : null,

          cancelAtPeriodEnd: cancelAt ?? null,
        };
      }),
    };

    // Find the active subscription (if any)
    const activeSubscription = subscriptions.data.find(
      (sub) =>
        sub.status === SubscriptionStatus.active ||
        sub.status === SubscriptionStatus.trialing
    );

    if (activeSubscription) {
      const priceId = activeSubscription.items.data[0]?.price.id;
      const subscriptionTier = priceId
        ? getSubscriptionFromPriceId(priceId)
        : null;

      if (subscriptionTier) {
        // Compute billing interval
        const billing = priceId
          ? (getBillingIntervalFromPriceId(priceId) as BillingInterval | null)
          : null;

        // Get current period window from Stripe (fallback between subscription and its first item)

        const cpStart =
          activeSubscription?.items?.data?.[0]?.current_period_start;

        const cpEnd = activeSubscription?.items?.data?.[0]?.current_period_end;

        // Update Subscription row
        await prisma.subscription.upsert({
          where: { teamId: team.id },
          update: {
            stripeSubscriptionId: activeSubscription.id,
            status: activeSubscription.status,
            subscriptionTier: subscriptionTier,
            billingInterval: billing ?? undefined,
            cancelAtPeriodEnd: activeSubscription.cancel_at_period_end ?? false,
            currentPeriodStart: cpStart ? new Date(cpStart * 1000) : null,
            currentPeriodEnd: cpEnd ? new Date(cpEnd * 1000) : null,
          },
          create: {
            teamId: team.id,
            stripeCustomerId: stripeSub.stripeCustomerId,
            stripeSubscriptionId: activeSubscription.id,
            status: activeSubscription.status,
            subscriptionTier: subscriptionTier,
            billingInterval: billing ?? undefined,
            cancelAtPeriodEnd: activeSubscription.cancel_at_period_end ?? false,
            currentPeriodStart: cpStart ? new Date(cpStart * 1000) : null,
            currentPeriodEnd: cpEnd ? new Date(cpEnd * 1000) : null,
          },
        });

        syncResult.after.dbSubscription = subscriptionTier;
        syncResult.after.dbSubscriptionId = activeSubscription.id;
      }
    } else {
      // No active subscription - clear database
      await prisma.subscription.update({
        where: { teamId: team.id },
        data: {
          subscriptionTier: null,
          stripeSubscriptionId: null,
          status: SubscriptionStatus.canceled,
          currentPeriodStart: null,
          currentPeriodEnd: null,
        },
      });

      syncResult.after.dbSubscription = null;
      syncResult.after.dbSubscriptionId = null;
    }

    return NextResponse.json({
      success: true,
      message: "Subscription synced successfully",
      sync: syncResult,
    });
  } catch (error) {
    console.error("Error syncing subscription:", error);
    return NextResponse.json(
      { error: "Failed to sync subscription" },
      { status: 500 }
    );
  }
}
