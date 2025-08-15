import { PricingTier } from "@/generated/prisma";

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
