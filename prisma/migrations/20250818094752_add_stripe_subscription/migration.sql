/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSubscriptionId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `subscription` on the `Team` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."BillingInterval" AS ENUM ('monthly', 'yearly');

-- DropIndex
DROP INDEX "public"."Team_stripeCustomerId_key";

-- DropIndex
DROP INDEX "public"."Team_stripeSubscriptionId_key";

-- AlterTable
ALTER TABLE "public"."Team" DROP COLUMN "stripeCustomerId",
DROP COLUMN "stripeSubscriptionId",
DROP COLUMN "subscription";

-- CreateTable
CREATE TABLE "public"."StripeSubscription" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "status" TEXT,
    "subscription" "public"."Subscription",
    "billingInterval" "public"."BillingInterval",
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "currentPeriodStart" TIMESTAMP(3),
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StripeSubscription_teamId_key" ON "public"."StripeSubscription"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeSubscription_stripeCustomerId_key" ON "public"."StripeSubscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "StripeSubscription_stripeSubscriptionId_key" ON "public"."StripeSubscription"("stripeSubscriptionId");

-- AddForeignKey
ALTER TABLE "public"."StripeSubscription" ADD CONSTRAINT "StripeSubscription_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "public"."Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
