# Stripe Setup Documentation

## Required Environment Variables

Add these environment variables to your `.env` file:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_... # Your Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... # Your Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # Your webhook endpoint secret

# Stripe Price IDs (create these in your Stripe dashboard)
# Monthly price IDs
STRIPE_STARTER_MONTHLY_PRICE_ID=price_... # Monthly price ID for Starter plan
STRIPE_CREATOR_MONTHLY_PRICE_ID=price_... # Monthly price ID for Creator plan
STRIPE_PRO_MONTHLY_PRICE_ID=price_... # Monthly price ID for Pro plan

# Yearly price IDs
STRIPE_STARTER_YEARLY_PRICE_ID=price_... # Yearly price ID for Starter plan
STRIPE_CREATOR_YEARLY_PRICE_ID=price_... # Yearly price ID for Creator plan
STRIPE_PRO_YEARLY_PRICE_ID=price_... # Yearly price ID for Pro plan
```

## Stripe Dashboard Setup

### 1. Create Products and Prices

In your Stripe Dashboard:

1. Go to Products → Add Product
2. Create three products:

   - **Starter Plan**

     - Monthly: $9.99/month → Copy this price ID to `STRIPE_STARTER_MONTHLY_PRICE_ID`
     - Yearly: $99.99/year → Copy this price ID to `STRIPE_STARTER_YEARLY_PRICE_ID`

   - **Creator Plan**

     - Monthly: $19.99/month → Copy this price ID to `STRIPE_CREATOR_MONTHLY_PRICE_ID`
     - Yearly: $199.99/year → Copy this price ID to `STRIPE_CREATOR_YEARLY_PRICE_ID`

   - **Pro Plan**
     - Monthly: $39.99/month → Copy this price ID to `STRIPE_PRO_MONTHLY_PRICE_ID`
     - Yearly: $399.99/year → Copy this price ID to `STRIPE_PRO_YEARLY_PRICE_ID`

3. **Important**: You must create 6 separate price IDs total (3 monthly + 3 yearly)
4. Copy each price ID to the corresponding environment variable

### 2. Set Up Webhooks

1. Go to Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhooks`
3. Select these events:

   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

4. Copy the webhook signing secret and add it to your environment variables

## Testing

Use Stripe's test card numbers:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`

## Production Checklist

- [ ] Replace test keys with live keys
- [ ] Update webhook endpoint to production URL
- [ ] Test all subscription flows
- [ ] Verify webhook delivery
- [ ] Set up monitoring for failed payments
