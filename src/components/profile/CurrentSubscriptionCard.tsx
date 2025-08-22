"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import {
  isTrialExpired,
  subscriptionLabel,
  TRIAL_PERIOD_DAYS,
} from "@/lib/subscription";

import { SubscriptionStatus } from "@/generated/prisma";
import { formatPrice as formatCurrency } from "@/lib/currency";
import { formatDate } from "@/lib/format-date";
import { FREE_MONTHS_WHEN_YEARLY, PLANS } from "@/lib/pricing";
import Link from "next/link";
import { Header } from "../common/Header";
import { SubHeader } from "../common/SubHeader";
import { Badge } from "../ui/badge";

export function CurrentSubscriptionCard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const stripeSub = user.subscription ?? null;
  const label = subscriptionLabel(stripeSub);
  const trialExpired = isTrialExpired(user);
  const isOnTrial = !user.subscription;
  const hasTrialExpired = isTrialExpired(user);
  const hasActiveSubscription = stripeSub?.status === SubscriptionStatus.active;

  const trialEndDate = new Date(user.createdAt);
  trialEndDate.setDate(trialEndDate.getDate() + TRIAL_PERIOD_DAYS);
  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (trialEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
  );

  const periodEndDate: Date | null = stripeSub?.currentPeriodEnd
    ? new Date(stripeSub.currentPeriodEnd)
    : null;

  const computeDisplayPrice = () => {
    if (!stripeSub?.subscriptionTier || !stripeSub?.billingInterval) {
      return null;
    }
    const plan = PLANS.find(
      (p) => p.subscriptionTier === stripeSub.subscriptionTier
    );
    if (!plan) return null;
    const monthlyPrice = plan.pricePerMonth;
    if (stripeSub.billingInterval === "monthly") {
      return `${formatCurrency(monthlyPrice)} / month`;
    }
    const yearlyTotal = monthlyPrice * (12 - FREE_MONTHS_WHEN_YEARLY);
    return `${formatCurrency(yearlyTotal)} / year`;
  };

  const openStripePortal = async () => {
    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      });
      if (response.ok) {
        const data = await response.json();
        window.open(data.url, "_blank");
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <div className="flex justify-between">
            <div>
              <SubHeader>Current subscription</SubHeader>
              <Header>{label}</Header>
            </div>
            <div>
              <Badge
                variant={
                  isOnTrial
                    ? hasTrialExpired
                      ? "destructive"
                      : "success"
                    : hasActiveSubscription
                    ? stripeSub.cancelAtPeriodEnd
                      ? "outline"
                      : "success"
                    : "destructive"
                }
              >
                {isOnTrial
                  ? hasTrialExpired
                    ? "Expired"
                    : "Active"
                  : hasActiveSubscription
                  ? stripeSub.cancelAtPeriodEnd
                    ? "Cancelled"
                    : "Active"
                  : "Expired"}
              </Badge>
            </div>
          </div>
        </CardTitle>
        <CardDescription>
          <div className="flex flex-col gap-1">
            {isOnTrial ? (
              <>
                {trialExpired &&
                  "Your trial has expired. Upgrade to continue using Scheddly."}
                {!trialExpired &&
                  `Trial expires in ${daysRemaining} day${
                    daysRemaining !== 1 ? "s" : ""
                  } (${trialEndDate.toLocaleDateString()})`}
              </>
            ) : (
              <>
                {stripeSub?.status === SubscriptionStatus.active ? (
                  <>
                    {computeDisplayPrice()}
                    {periodEndDate && (
                      <div className="text-muted-foreground">
                        {stripeSub.cancelAtPeriodEnd
                          ? `Expires ${formatDate(periodEndDate)}`
                          : `Renews ${formatDate(periodEndDate)}`}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {periodEndDate ? (
                      <>
                        Subscription expired on {formatDate(periodEndDate)}.
                        Upgrade to continue using Scheddly.
                      </>
                    ) : (
                      <>
                        Subscription expired. Upgrade to continue using
                        Scheddly.
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col md:flex-row justify-between gap-2">
          <div className="flex flex-col ">
            {hasActiveSubscription && (
              <>
                <Button variant="outline" onClick={openStripePortal}>
                  Manage Subscription
                </Button>
              </>
            )}
          </div>

          <Button asChild>
            <Link href="/dashboard/profile/change-plan">
              {trialExpired
                ? "Upgrade Now"
                : hasActiveSubscription
                ? "Change Plan"
                : "Upgrade Plan"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
