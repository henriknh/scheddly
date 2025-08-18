/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `Team` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Team_stripeCustomerId_key";

-- AlterTable
ALTER TABLE "public"."Team" DROP COLUMN "stripeCustomerId";
