"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Info } from "lucide-react";
import Link from "next/link";
import { Divider } from "../ui/divider";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  Feature,
  Plan,
  FREE_MONTHS_WHEN_YEARLY,
  formatPrice,
  subscriptionTierToLabel,
} from "@/lib/pricing";
import { TRIAL_PERIOD_DAYS } from "@/lib/subscription";
import {
  SubscriptionBillingInterval,
  SubscriptionTier,
} from "@/generated/prisma";

interface PricingTierCardProps {
  plan: Plan;
  isYearly: boolean;
  freeMonthsWhenYearly?: number;
  variant?: "marketing" | "manage";
  // manage variant props
  subscriptionTier?: SubscriptionTier | null;
  currentBillingInterval?: SubscriptionBillingInterval | null;
  hasActiveSubscription?: boolean;
  isLoading?: boolean;
  onSelect?: (tierKey: SubscriptionTier) => void;
}

export function PricingTierCard({
  plan,
  isYearly,
  freeMonthsWhenYearly = FREE_MONTHS_WHEN_YEARLY,
  variant = "marketing",
  subscriptionTier,
  currentBillingInterval = "monthly",
  hasActiveSubscription = false,
  isLoading = false,
  onSelect,
}: PricingTierCardProps) {
  const isCurrentPlan =
    variant === "manage" &&
    subscriptionTier === plan.subscriptionTier &&
    ((isYearly && currentBillingInterval === "yearly") ||
      (!isYearly && currentBillingInterval === "monthly"));

  const manageButtonText = () => {
    if (isCurrentPlan) return "Current Plan";
    const label = subscriptionTierToLabel(plan.subscriptionTier);

    if (hasActiveSubscription) {
      if (subscriptionTier && plan.subscriptionTier === subscriptionTier) {
        return `Switch to ${isYearly ? "Yearly" : "Monthly"}`;
      }
      const tierValues = { STARTER: 1, CREATOR: 2, PRO: 3 } as const;
      const currentValue = subscriptionTier ? tierValues[subscriptionTier] : 0;
      const targetValue = tierValues[plan.subscriptionTier];

      return targetValue > currentValue
        ? `Upgrade to ${label}`
        : `Downgrade to ${label}`;
    }
    return `Upgrade to ${label}`;
  };

  const manageButtonDescription = () => {
    if (isCurrentPlan) return null;
    if (hasActiveSubscription && subscriptionTier) {
      const tierValues = { STARTER: 1, CREATOR: 2, PRO: 3 } as const;
      const currentValue = subscriptionTier ? tierValues[subscriptionTier] : 0;
      const targetValue = tierValues[plan.subscriptionTier];
      if (targetValue > currentValue) return "Charged prorated amount today";
      if (targetValue < currentValue) return "Effective next billing cycle";
      return "Billing change takes effect immediately";
    }
    return null;
  };

  const priceBlock = (
    <div className="text-3xl font-bold flex items-center gap-2 flex-wrap">
      <span>
        $
        {isYearly
          ? formatPrice(plan.pricePerMonth * (12 - freeMonthsWhenYearly))
          : formatPrice(plan.pricePerMonth)}
        <span className="text-lg text-muted-foreground">
          /{isYearly ? "year" : "month"}
        </span>
      </span>
      {isYearly && (
        <Badge variant="success" className="text-nowrap">
          {freeMonthsWhenYearly} months free
        </Badge>
      )}
    </div>
  );

  return (
    <Card className={cn("flex flex-col", plan.popular ? "border-primary" : "")}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 h-6">
          {subscriptionTierToLabel(plan.subscriptionTier)}
          {plan.popular && <Badge className="ml-2">Most Popular</Badge>}
          {plan.bestValue && <Badge className="ml-2">Best Value</Badge>}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        {priceBlock}
        {isYearly && (
          <>
            <div className="text-sm text-green-600 font-medium">
              Save ${formatPrice(plan.pricePerMonth * freeMonthsWhenYearly)}
              /year
            </div>
            <div className="text-base text-muted-foreground">
              $
              {formatPrice(
                (plan.pricePerMonth * (12 - freeMonthsWhenYearly)) / 12
              )}
              /month when billed annually
            </div>
          </>
        )}
      </CardHeader>
      <CardContent className="flex-1 flex flex-col space-y-3">
        {plan.features
          .filter((feature: Feature) => !feature.comingSoon)
          .map((feature: Feature, idx: number) => (
            <div
              key={
                typeof feature.label === "string"
                  ? feature.label
                  : `feature-${idx}`
              }
              className="flex items-center justify-between"
            >
              <div className="inline-flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <div className={cn(feature.isBold && "font-bold")}>
                  {feature.label}
                </div>
              </div>
              {feature.tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-[calc(100vw-1.5rem)] text-wrap">
                      {feature.tooltip}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ))}

        {plan.features.filter((f) => f.comingSoon).length > 0 && (
          <>
            <div className="flex-1" />
            <div className="flex flex-col py-4">
              <Divider text="Coming Soon" />
            </div>
          </>
        )}

        {plan.features
          .filter((feature: Feature) => feature.comingSoon)
          .map((feature: Feature, idx: number) => (
            <div
              key={
                typeof feature.label === "string"
                  ? feature.label
                  : `feature-${idx}`
              }
              className="flex items-center justify-between"
            >
              <div className="inline-flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <div className={cn(feature.isBold && "font-bold")}>
                  {feature.label}
                </div>
              </div>
              {feature.tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="max-w-[calc(100vw-1.5rem)] text-wrap">
                      {feature.tooltip}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ))}

        <div className="pt-2">
          {variant === "marketing" ? (
            <Button asChild className="w-full">
              <Link href="/auth/register">
                Start {TRIAL_PERIOD_DAYS}-day free trial
              </Link>
            </Button>
          ) : (
            <>
              <Button
                className="w-full"
                onClick={() => onSelect && onSelect(plan.subscriptionTier)}
                disabled={isLoading || isCurrentPlan}
                variant={isCurrentPlan ? "secondary" : "default"}
              >
                {isLoading ? "Processing..." : manageButtonText()}
              </Button>
              {!isCurrentPlan && manageButtonDescription() && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  {manageButtonDescription()}
                </p>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PricingTierCard;
