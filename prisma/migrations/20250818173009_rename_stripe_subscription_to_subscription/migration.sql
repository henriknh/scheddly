-- CreateEnum
CREATE TYPE "public"."SubscriptionStatus" AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');

-- Update status column to use new enum
ALTER TABLE "public"."StripeSubscription" ALTER COLUMN "status" TYPE "public"."SubscriptionStatus" USING "status"::text::"public"."SubscriptionStatus";

-- DropEnum
DROP TYPE "public"."StripeSubscriptionStatus";

-- RenameTable
ALTER TABLE "public"."StripeSubscription" RENAME TO "Subscription";

-- Rename constraints to match new table name
ALTER TABLE "public"."Subscription" RENAME CONSTRAINT "StripeSubscription_pkey" TO "Subscription_pkey";
ALTER TABLE "public"."Subscription" RENAME CONSTRAINT "StripeSubscription_teamId_fkey" TO "Subscription_teamId_fkey";

-- Rename indexes to match new table name
ALTER INDEX "public"."StripeSubscription_teamId_key" RENAME TO "Subscription_teamId_key";
ALTER INDEX "public"."StripeSubscription_stripeCustomerId_key" RENAME TO "Subscription_stripeCustomerId_key";
ALTER INDEX "public"."StripeSubscription_stripeSubscriptionId_key" RENAME TO "Subscription_stripeSubscriptionId_key";