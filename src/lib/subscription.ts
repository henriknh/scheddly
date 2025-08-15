import { Subscription } from "@/generated/prisma";

// Trial period duration in days
export const TRIAL_PERIOD_DAYS = 7;

export const subscriptionLabel = (
  subscription?: Subscription | null
): string => {
  switch (subscription) {
    case Subscription.STARTER:
      return "Starter";
    case Subscription.CREATOR:
      return "Creator";
    case Subscription.PRO:
      return "Pro";
    default:
      return "Trial";
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
