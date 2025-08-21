"use client";

import { loadStripe } from "@stripe/stripe-js";

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set");
}

// Initialize Stripe.js
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId: string) => {
  const stripe = await stripePromise;

  if (!stripe) {
    throw new Error("Stripe failed to initialize");
  }

  const { error } = await stripe.redirectToCheckout({
    sessionId,
  });

  if (error) {
    throw error;
  }
};
