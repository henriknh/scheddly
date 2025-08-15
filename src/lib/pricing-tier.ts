import { PricingTier } from "@/generated/prisma";

// Trial period duration in days
export const TRIAL_PERIOD_DAYS = 7;

export const pricingTierLabel = (pricingTier?: PricingTier | null): string => {
  switch (pricingTier) {
    case PricingTier.STARTER:
      return "Starter";
    case PricingTier.CREATOR:
      return "Creator";
    case PricingTier.PRO:
      return "Pro";
    default:
      return "Trial";
  }
};

export const isTrialExpired = (user: {
  pricingTier?: PricingTier | null;
  createdAt: Date;
}): boolean => {
  // If user has a pricing tier, they're not on trial
  if (user.pricingTier) {
    return false;
  }

  // Calculate if trial period has expired
  const trialEndDate = new Date(user.createdAt);
  trialEndDate.setDate(trialEndDate.getDate() + TRIAL_PERIOD_DAYS);

  return new Date() > trialEndDate;
};
