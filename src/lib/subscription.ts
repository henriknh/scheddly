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

export const isTrialExpired = (user: {
  subscription?: Subscription | null;
  createdAt: Date;
}): boolean => {
  // If user has a subscription, they're not on trial
  if (user.subscription) {
    return false;
  }

  // Calculate if trial period has expired (based on user account age)
  const trialEndDate = new Date(user.createdAt);
  trialEndDate.setDate(trialEndDate.getDate() + TRIAL_PERIOD_DAYS);

  return new Date() > trialEndDate;
};
