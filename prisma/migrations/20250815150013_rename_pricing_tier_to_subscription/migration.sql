/*
  Warnings:

  - You are about to drop the column `pricingTier` on the `Team` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Subscription" AS ENUM ('STARTER', 'CREATOR', 'PRO');

-- AlterTable
ALTER TABLE "Team" DROP COLUMN "pricingTier",
ADD COLUMN     "subscription" "Subscription";

-- DropEnum
DROP TYPE "PricingTier";
