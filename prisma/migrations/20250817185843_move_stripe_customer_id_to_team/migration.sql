/*
  Warnings:

  - You are about to drop the column `stripeCustomerId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."User_stripeCustomerId_key";

-- AlterTable
ALTER TABLE "public"."Team" ADD COLUMN     "stripeCustomerId" TEXT;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "stripeCustomerId";

-- CreateIndex
CREATE UNIQUE INDEX "Team_stripeCustomerId_key" ON "public"."Team"("stripeCustomerId");
