import {
  Subscription,
  SubscriptionStatus,
  SubscriptionTier,
} from "@/generated/prisma";

// Trial period duration in days
export const TRIAL_PERIOD_DAYS = 7;

export const subscriptionLabel = (
  subscription?: Subscription | null
): string => {
  if (!subscription) {
    return "Trial";
  }

  if (
    subscription?.status === SubscriptionStatus.canceled ||
    subscription?.status === SubscriptionStatus.incomplete_expired
  ) {
    return "Expired";
  }

  switch (subscription?.subscriptionTier) {
    case SubscriptionTier.STARTER:
      return "Starter";
    case SubscriptionTier.CREATOR:
      return "Creator";
    case SubscriptionTier.PRO:
      return "Pro";
    default:
      return "";
  }
};

export const isTrialExpired = (team: {
  subscription?: Subscription | null;
  createdAt: Date;
}): boolean => {
  // If team has a subscription, they're not on trial
  if (team.subscription) {
    return false;
  }

  // Calculate if trial period has expired
  const trialEndDate = new Date(team.createdAt);
  trialEndDate.setDate(trialEndDate.getDate() + TRIAL_PERIOD_DAYS);

  return new Date() > trialEndDate;
};
