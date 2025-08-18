"use client";

import PricingTierCard from "@/components/common/PricingTierCard";
import {
  SubscriptionBillingInterval,
  SubscriptionTier,
} from "@/generated/prisma";
import { PLANS } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Variant = "marketing" | "manage";

interface PricingTiersProps {
  isYearly: boolean;
  variant?: Variant;
  className?: string;
  // manage variant props
  subscriptionTier?: SubscriptionTier | null;
  currentBillingInterval?: SubscriptionBillingInterval | null;
  hasActiveSubscription?: boolean;
  loadingTier?: SubscriptionTier | null;
  onSelect?: (tierKey: SubscriptionTier) => void;
}

export function PricingTiers({
  isYearly,
  variant = "marketing",
  className,
  subscriptionTier,
  currentBillingInterval,
  hasActiveSubscription,
  loadingTier,
  onSelect,
}: PricingTiersProps) {
  return (
    <div className={cn("grid md:grid-cols-3 gap-8", className)}>
      {PLANS.map((plan) => (
        <PricingTierCard
          key={plan.subscriptionTier}
          plan={plan}
          isYearly={isYearly}
          variant={variant}
          subscriptionTier={subscriptionTier}
          currentBillingInterval={currentBillingInterval}
          hasActiveSubscription={hasActiveSubscription}
          isLoading={
            loadingTier ===
            (plan.subscriptionTier === SubscriptionTier.STARTER
              ? "STARTER"
              : plan.subscriptionTier === SubscriptionTier.CREATOR
              ? "CREATOR"
              : SubscriptionTier.PRO)
          }
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export default PricingTiers;
