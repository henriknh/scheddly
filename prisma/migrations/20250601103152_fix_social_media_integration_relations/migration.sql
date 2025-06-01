/*
  Warnings:

  - You are about to drop the column `socialMediaIntegrationId` on the `SocialMediaIntegrationAccountInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[socialMediaIntegrationAccountInfoId]` on the table `SocialMediaIntegration` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "SocialMediaIntegrationAccountInfo" DROP CONSTRAINT "SocialMediaIntegrationAccountInfo_socialMediaIntegrationId_fkey";

-- DropIndex
DROP INDEX "SocialMediaIntegrationAccountInfo_socialMediaIntegrationId_key";

-- AlterTable
ALTER TABLE "SocialMediaIntegration" ADD COLUMN     "socialMediaIntegrationAccountInfoId" TEXT;

-- AlterTable
ALTER TABLE "SocialMediaIntegrationAccountInfo" DROP COLUMN "socialMediaIntegrationId";

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaIntegration_socialMediaIntegrationAccountInfoId_key" ON "SocialMediaIntegration"("socialMediaIntegrationAccountInfoId");

-- AddForeignKey
ALTER TABLE "SocialMediaIntegration" ADD CONSTRAINT "SocialMediaIntegration_socialMediaIntegrationAccountInfoId_fkey" FOREIGN KEY ("socialMediaIntegrationAccountInfoId") REFERENCES "SocialMediaIntegrationAccountInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
