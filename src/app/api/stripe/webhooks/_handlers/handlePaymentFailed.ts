"use server";

import Stripe from "stripe";

export async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.info("[WEBHOOK] Payment failed:", invoice.id);
}
