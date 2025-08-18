import { formatPrice } from "@/lib/currency";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Return pricing information for the frontend
    const pricing = {
      STARTER: {
        name: "Starter",
        description: "Perfect for individuals getting started",
        monthly: { amount: 9.99, formatted: formatPrice(9.99) },
        yearly: { amount: 99.99, formatted: formatPrice(99.99) },
        features: [
          "Up to 10 posts per month",
          "2 social media accounts",
          "Basic analytics",
          "Email support",
        ],
      },
      CREATOR: {
        name: "Creator",
        description: "Ideal for content creators and small businesses",
        monthly: { amount: 19.99, formatted: formatPrice(19.99) },
        yearly: { amount: 199.99, formatted: formatPrice(199.99) },
        features: [
          "Up to 50 posts per month",
          "5 social media accounts",
          "Advanced analytics",
          "Priority email support",
          "Custom scheduling",
        ],
      },
      PRO: {
        name: "Pro",
        description: "Best for agencies and large teams",
        monthly: { amount: 39.99, formatted: formatPrice(39.99) },
        yearly: { amount: 399.99, formatted: formatPrice(399.99) },
        features: [
          "Unlimited posts",
          "Unlimited social media accounts",
          "Advanced analytics & reporting",
          "Team collaboration",
          "Phone & email support",
          "Custom branding",
          "API access",
        ],
      },
    };

    return NextResponse.json(pricing);
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return NextResponse.json(
      { error: "Failed to fetch pricing" },
      { status: 500 }
    );
  }
}
