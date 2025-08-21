/*
  Warnings:

  - You are about to drop the column `currentPeriodEnd` on the `StripeSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `currentPeriodStart` on the `StripeSubscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."StripeSubscription" DROP COLUMN "currentPeriodEnd",
DROP COLUMN "currentPeriodStart",
ADD COLUMN     "planAmount" INTEGER,
ADD COLUMN     "planCreated" TIMESTAMP(3);
