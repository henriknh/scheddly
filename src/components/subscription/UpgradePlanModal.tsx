"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { redirectToCheckout } from "@/lib/stripe-client";
//
import { PricingBillingToggle } from "@/components/common/PricingBillingToggle";
import { PricingTiers } from "@/components/common/PricingTiers";
import {
  SubscriptionBillingInterval,
  SubscriptionTier,
} from "@/generated/prisma";

interface UpgradePlanModalProps {
  children: React.ReactNode;
  subscriptionTier?: SubscriptionTier | null;
  currentBillingInterval?: SubscriptionBillingInterval | null;
  hasActiveSubscription?: boolean;
}

export function UpgradePlanModal({
  children,
  subscriptionTier,
  currentBillingInterval = "monthly",
  hasActiveSubscription = false,
}: UpgradePlanModalProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] =
    useState<SubscriptionBillingInterval>(
      (currentBillingInterval as SubscriptionBillingInterval) || "monthly"
    );

  const handlePlanChange = async (subscriptionTier: string) => {
    try {
      setIsLoading(subscriptionTier);

      if (hasActiveSubscription) {
        // Update existing subscription
        const response = await fetch("/api/stripe/subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subscriptionTier,
            billingInterval: billingInterval || "monthly",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update subscription");
        }

        // Show success message based on change type
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
        // Create new subscription via checkout
        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
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
      setIsLoading(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {hasActiveSubscription ? "Change Your Plan" : "Upgrade Your Plan"}
          </DialogTitle>
          <DialogDescription>
            {hasActiveSubscription
              ? "Switch between plans or billing intervals. Changes will be prorated automatically."
              : "Choose the plan that best fits your needs. You can change or cancel anytime."}
          </DialogDescription>
        </DialogHeader>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 my-6">
          <PricingBillingToggle
            isYearly={billingInterval === "yearly"}
            onChange={(val) => setBillingInterval(val ? "yearly" : "monthly")}
          />
        </div>

        {/* Pricing Cards */}
        <PricingTiers
          isYearly={billingInterval === "yearly"}
          variant="manage"
          subscriptionTier={subscriptionTier}
          currentBillingInterval={currentBillingInterval}
          hasActiveSubscription={hasActiveSubscription}
          loadingTier={
            isLoading ? (isLoading as "STARTER" | "GROWTH" | "SCALE") : null
          }
          onSelect={(tier) => handlePlanChange(tier)}
          className="gap-6"
        />
      </DialogContent>
    </Dialog>
  );
}
