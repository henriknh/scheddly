"use server";

import Stripe from "stripe";

export async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.info("[WEBHOOK] Payment succeeded:", invoice.id);
}
