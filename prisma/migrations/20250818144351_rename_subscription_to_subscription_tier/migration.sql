/*
  Warnings:

  - You are about to drop the column `subscription` on the `StripeSubscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."StripeSubscription" DROP COLUMN "subscription",
ADD COLUMN     "subscriptionTier" "public"."SubscriptionTier";
