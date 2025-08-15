/*
  Warnings:

  - You are about to drop the column `pricingTier` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "pricingTier" "PricingTier";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "pricingTier";
