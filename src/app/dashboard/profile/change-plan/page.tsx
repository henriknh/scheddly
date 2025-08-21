"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  SubscriptionBillingInterval,
  SubscriptionStatus,
  type SubscriptionTier,
} from "@/generated/prisma";
import { PricingBillingToggle } from "@/components/common/PricingBillingToggle";
import { PricingTiers } from "@/components/common/PricingTiers";
import { redirectToCheckout } from "@/lib/stripe-client";
import { Breadcrumb } from "@/components/common/breadcrumb";

export default function ChangePlanPage() {
  const { user } = useAuth();

  const stripeSub = user?.subscription ?? null;
  const hasActiveSubscription = stripeSub?.status === SubscriptionStatus.active;
  const currentBillingInterval: SubscriptionBillingInterval =
    (stripeSub?.billingInterval as SubscriptionBillingInterval) || "monthly";
  const [billingInterval, setBillingInterval] =
    useState<SubscriptionBillingInterval>(currentBillingInterval || "monthly");
  const [loadingTier, setLoadingTier] = useState<SubscriptionTier | null>(null);

  const handlePlanChange = async (subscriptionTier: string) => {
    try {
      setLoadingTier(subscriptionTier as SubscriptionTier);

      if (hasActiveSubscription) {
        const response = await fetch("/api/stripe/subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscriptionTier,
            billingInterval: billingInterval || "monthly",
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to update subscription");
        }

        const changeType = data.subscription?.changeType;
        let message = "Subscription updated successfully!";
        if (changeType === "upgrade") {
          message = "Plan upgraded! You'll be charged a prorated amount today.";
        } else if (changeType === "downgrade") {
          message =
            "Plan downgrade scheduled! You'll keep current features until your next billing cycle.";
        } else if (changeType === "billing_change") {
          message =
            "Billing interval updated! Changes take effect immediately.";
        }

        alert(message);
        window.location.reload();
      } else {
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscriptionTier,
            billingInterval: billingInterval || "monthly",
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to create checkout session");
        }

        await redirectToCheckout(data.sessionId);
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      alert("Failed to update subscription. Please try again.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <>
      <Breadcrumb label="Profile" href="/dashboard/profile" />
      <Breadcrumb label="Change Plan" href="/dashboard/profile/change-plan" />

      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-center gap-4">
          <PricingBillingToggle
            isYearly={billingInterval === "yearly"}
            onChange={(val) => setBillingInterval(val ? "yearly" : "monthly")}
          />
        </div>

        <PricingTiers
          isYearly={billingInterval === "yearly"}
          variant="manage"
          subscriptionTier={stripeSub?.subscriptionTier ?? null}
          currentBillingInterval={currentBillingInterval}
          hasActiveSubscription={hasActiveSubscription}
          loadingTier={loadingTier}
          onSelect={(tier) => handlePlanChange(tier)}
          className="gap-6"
        />
      </div>
    </>
  );
}
