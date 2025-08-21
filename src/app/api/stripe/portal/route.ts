"use server";

import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get Stripe customer ID from Subscription by userId
    const sub = await prisma.subscription.findUnique({
      where: { userId: user.id },
      select: { stripeCustomerId: true },
    });

    const stripeCustomerId = sub?.stripeCustomerId || undefined;

    if (!stripeCustomerId) {
      return NextResponse.json(
        { error: "No Stripe customer found for user" },
        { status: 400 }
      );
    }

    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${request.nextUrl.origin}/dashboard/profile`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating customer portal session:", error);
    return NextResponse.json(
      { error: "Failed to create customer portal session" },
      { status: 500 }
    );
  }
}
