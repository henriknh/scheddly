/*
  Warnings:

  - A unique constraint covering the columns `[stripeSubscriptionId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeSubscriptionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Team_stripeSubscriptionId_key" ON "public"."Team"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_stripeCustomerId_key" ON "public"."Team"("stripeCustomerId");
