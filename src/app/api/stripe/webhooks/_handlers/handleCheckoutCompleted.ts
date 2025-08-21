"use server";

import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
) {
  console.info("[WEBHOOK] Checkout session completed:", session.id);

  const { userId, subscriptionTier } = session.metadata || {};

  if (!userId || !subscriptionTier) {
    console.error("[WEBHOOK] Missing metadata in checkout session");
    return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
  }

  console.info(
    `[WEBHOOK] Checkout completed for user ${userId}, tier ${subscriptionTier}`
  );
}
