-- CreateEnum
CREATE TYPE "PricingTier" AS ENUM ('STARTER', 'CREATOR', 'PRO');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "pricingTier" "PricingTier";
