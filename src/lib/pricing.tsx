"use client";

import { SubscriptionTier } from "@/generated/prisma";
import Link from "next/link";
import { ReactNode } from "react";

export interface Feature {
  label: ReactNode;
  tooltip?: string;
  isBold?: boolean;
  comingSoon?: boolean;
}

export interface Plan {
  subscriptionTier: SubscriptionTier;
  description: string;
  pricePerMonth: number;
  features: Feature[];
  popular: boolean;
  bestValue: boolean;
}

export const FREE_MONTHS_WHEN_YEARLY = 2;

export const formatPrice = (price: number) => {
  return price % 1 === 0 ? price.toString() : price.toFixed(2);
};

export const featureUnlimitedPosts: Feature = {
  label: "Unlimited posts",
};

export const featureContentScheduling: Feature = {
  label: "Content scheduling",
  tooltip:
    "Schedule your content to be posted at a specific time and date. And get suggestions for the best time to post.",
};

export const featureUnlimitedBrands: Feature = {
  label: (
    <span>
      Unlimited{" "}
      <Link
        href="/blog/what-is-a-brand-and-why-is-it-important"
        className="text-primary"
      >
        brands
      </Link>
    </span>
  ),
  tooltip: "Organize your social media accounts with multiple brands.",
};

export const featureEcommerceIntegration: Feature = {
  label: "E-commerce integration",
  tooltip: "Integrate your e-commerce platform with your social media.",
  comingSoon: true,
};

export const featureAnalytics: Feature = {
  label: "Analytics",
  comingSoon: true,
};

export const featureAITools: Feature = {
  label: "AI assistant",
  tooltip: "Use AI to generate content and schedule your posts.",
  comingSoon: true,
};

export const PLANS: Plan[] = [
  {
    subscriptionTier: SubscriptionTier.STARTER,
    description: "Perfect for beginners",
    pricePerMonth: 5,
    features: [
      { label: "5 social media integrations", isBold: true },
      featureUnlimitedPosts,
      featureContentScheduling,
      featureUnlimitedBrands,
      featureEcommerceIntegration,
      featureAnalytics,
    ],
    popular: false,
    bestValue: false,
  },
  {
    subscriptionTier: SubscriptionTier.CREATOR,
    description: "Ideal for content creators",
    pricePerMonth: 15,
    features: [
      { label: "15 social media integrations", isBold: true },
      featureUnlimitedPosts,
      featureContentScheduling,
      featureUnlimitedBrands,
      featureEcommerceIntegration,
      featureAnalytics,
      featureAITools,
    ],
    popular: true,
    bestValue: false,
  },
  {
    subscriptionTier: SubscriptionTier.PRO,
    description: "For teams and agencies",
    pricePerMonth: 25,
    features: [
      { label: "Unlimited social media integrations", isBold: true },
      featureUnlimitedPosts,
      featureContentScheduling,
      featureUnlimitedBrands,
      featureEcommerceIntegration,
      featureAnalytics,
      featureAITools,
      { label: "Team collaboration" },
      { label: "Priority support" },
    ],
    popular: false,
    bestValue: true,
  },
];

export function getPlanOrder(tier: "STARTER" | "CREATOR" | "PRO"): number {
  switch (tier) {
    case "STARTER":
      return 1;
    case "CREATOR":
      return 2;
    case "PRO":
      return 3;
  }
}

export function subscriptionTierToLabel(
  subscriptionTier: SubscriptionTier
): "Starter" | "Creator" | "Pro" {
  switch (subscriptionTier) {
    case SubscriptionTier.STARTER:
      return "Starter";
    case SubscriptionTier.CREATOR:
      return "Creator";
    case SubscriptionTier.PRO:
      return "Pro";
  }
}
