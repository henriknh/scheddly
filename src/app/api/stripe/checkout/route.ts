import { NextRequest, NextResponse } from "next/server";
import { stripe, getStripePriceId } from "@/lib/stripe";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import prisma from "@/lib/prisma";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { priceId, subscriptionTier, billingInterval = "monthly" } = body;

    // Validate required fields
    if (!subscriptionTier) {
      return NextResponse.json(
        { error: "Subscription tier is required" },
        { status: 400 }
      );
    }

    // Get the Stripe price ID based on subscription tier and billing interval
    const stripePriceId =
      priceId || getStripePriceId(subscriptionTier, billingInterval);

    if (!stripePriceId) {
      return NextResponse.json(
        { error: "Invalid subscription tier or billing interval" },
        { status: 400 }
      );
    }

    // Resolve team-level Stripe customer ID using Subscription model
    let customerId: string | undefined = undefined;
    if (user.teamId) {
      const existingSub = await prisma.subscription.findUnique({
        where: { teamId: user.teamId },
      });
      customerId = existingSub?.stripeCustomerId ?? undefined;
    }

    if (!customerId) {
      // Create a new Stripe customer tied to the team
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id,
          ...(user.teamId ? { teamId: user.teamId } : {}),
        },
      });

      customerId = customer.id;

      if (user.teamId) {
        // Upsert Subscription to store the customer id
        await prisma.subscription.upsert({
          where: { teamId: user.teamId },
          update: { stripeCustomerId: customerId },
          create: { teamId: user.teamId, stripeCustomerId: customerId },
        });
      }
    }

    // Get price details to check if it's metered
    const priceDetails = await stripe.prices.retrieve(stripePriceId);

    // Prepare line item - only include quantity for non-metered prices
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price: stripePriceId,
    };

    // Only add quantity if it's NOT a metered usage price
    const isMeteredUsage = priceDetails.recurring?.usage_type === "metered";
    if (!isMeteredUsage) {
      lineItem.quantity = 1;
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [lineItem],
      success_url: `${request.nextUrl.origin}/dashboard/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/dashboard/profile`,
      metadata: {
        userId: user.id,
        teamId: user.teamId,
        subscriptionTier,
        billingInterval,
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          teamId: user.teamId,
          subscriptionTier,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
    });

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
