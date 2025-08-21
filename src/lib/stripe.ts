import { SubscriptionTier } from "@/generated/prisma";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

if (!process.env.STRIPE_STARTER_MONTHLY_PRICE_ID) {
  throw new Error("STRIPE_STARTER_MONTHLY_PRICE_ID is not set");
}

if (!process.env.STRIPE_STARTER_YEARLY_PRICE_ID) {
  throw new Error("STRIPE_STARTER_YEARLY_PRICE_ID is not set");
}

if (!process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID) {
  throw new Error("STRIPE_CREATOR_MONTHLY_PRICE_ID is not set");
}

if (!process.env.STRIPE_CREATOR_YEARLY_PRICE_ID) {
  throw new Error("STRIPE_CREATOR_YEARLY_PRICE_ID is not set");
}

if (!process.env.STRIPE_PRO_MONTHLY_PRICE_ID) {
  throw new Error("STRIPE_PRO_MONTHLY_PRICE_ID is not set");
}

if (!process.env.STRIPE_PRO_YEARLY_PRICE_ID) {
  throw new Error("STRIPE_PRO_YEARLY_PRICE_ID is not set");
}

// Initialize Stripe with secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
  typescript: true,
});

// Stripe price IDs for each subscription tier and billing interval
export const STRIPE_PRICE_IDS = {
  STARTER: {
    monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID!,
  },
  CREATOR: {
    monthly: process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_CREATOR_YEARLY_PRICE_ID!,
  },
  PRO: {
    monthly: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    yearly: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
  },
} as Record<SubscriptionTier, Record<"monthly" | "yearly", string>>;

// Subscription tier and billing interval to Stripe price ID mapping
export const getStripePriceId = (
  subscription: string,
  billingInterval: "monthly" | "yearly" = "monthly"
): string | null => {
  switch (subscription) {
    case "STARTER":
      return STRIPE_PRICE_IDS.STARTER[billingInterval];
    case "CREATOR":
      return STRIPE_PRICE_IDS.CREATOR[billingInterval];
    case "PRO":
      return STRIPE_PRICE_IDS.PRO[billingInterval];
    default:
      return null;
  }
};

// Stripe price ID to subscription tier mapping
export const getSubscriptionFromPriceId = (
  priceId: string
): SubscriptionTier | null => {
  for (const [tier, prices] of Object.entries(STRIPE_PRICE_IDS)) {
    if (prices.monthly === priceId || prices.yearly === priceId) {
      return tier as SubscriptionTier;
    }
  }
  return null;
};

// Get billing interval from price ID
export const getBillingIntervalFromPriceId = (
  priceId: string
): "monthly" | "yearly" | null => {
  for (const [, prices] of Object.entries(STRIPE_PRICE_IDS)) {
    if (prices.monthly === priceId) return "monthly";
    if (prices.yearly === priceId) return "yearly";
  }
  return null;
};

// Pricing information for display
// Helper to safely read snake_case timing fields that Stripe returns
// (removed getSubscriptionTiming)
