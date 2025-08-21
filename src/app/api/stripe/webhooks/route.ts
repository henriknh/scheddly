import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import { handleCheckoutCompleted } from "./_handlers/handleCheckoutCompleted";
import { handleSubscriptionCreated } from "./_handlers/handleSubscriptionCreated";
import { handleSubscriptionUpdated } from "./_handlers/handleSubscriptionUpdated";
import { handleSubscriptionDeleted } from "./_handlers/handleSubscriptionDeleted";
import { handlePaymentSucceeded } from "./_handlers/handlePaymentSucceeded";
import { handlePaymentFailed } from "./_handlers/handlePaymentFailed";

// Configure for raw body handling
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not set");
}

export async function POST(request: NextRequest) {
  try {
    // Get raw body as Buffer for Stripe signature verification
    const arrayBuffer = await request.arrayBuffer();
    const body = Buffer.from(arrayBuffer);
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature provided" },
        { status: 400 }
      );
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.error("[WEBHOOK] Signature verification failed:", err);
      console.error(
        "[WEBHOOK] Using webhook secret starting with:",
        process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 15)
      );
      console.error(
        "[WEBHOOK] Expected secret should start with: whsec_b618aea58c"
      );
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object);
        break;
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.info(`[WEBHOOK] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK] Error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 500 });
  }
}
