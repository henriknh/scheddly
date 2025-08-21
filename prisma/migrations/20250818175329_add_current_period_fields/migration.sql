/*
  Warnings:

  - You are about to drop the column `planAmount` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `planCreated` on the `Subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Subscription" DROP COLUMN "planAmount",
DROP COLUMN "planCreated",
ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "currentPeriodStart" TIMESTAMP(3);
