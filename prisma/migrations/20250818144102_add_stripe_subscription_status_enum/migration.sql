/*
  Warnings:

  - The `status` column on the `StripeSubscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."StripeSubscriptionStatus" AS ENUM ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused');

-- AlterTable
ALTER TABLE "public"."StripeSubscription" DROP COLUMN "status",
ADD COLUMN     "status" "public"."StripeSubscriptionStatus";
