/*
  Warnings:

  - The `subscription` column on the `StripeSubscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `billingInterval` column on the `StripeSubscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."SubscriptionTier" AS ENUM ('STARTER', 'CREATOR', 'PRO');

-- CreateEnum
CREATE TYPE "public"."SubscriptionBillingInterval" AS ENUM ('monthly', 'yearly');

-- AlterTable
ALTER TABLE "public"."StripeSubscription" DROP COLUMN "subscription",
ADD COLUMN     "subscription" "public"."SubscriptionTier",
DROP COLUMN "billingInterval",
ADD COLUMN     "billingInterval" "public"."SubscriptionBillingInterval";

-- DropEnum
DROP TYPE "public"."BillingInterval";

-- DropEnum
DROP TYPE "public"."Subscription";
