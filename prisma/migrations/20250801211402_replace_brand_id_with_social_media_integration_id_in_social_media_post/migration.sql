/*
  Warnings:

  - You are about to drop the column `brandId` on the `SocialMediaPost` table. All the data in the column will be lost.
  - Added the required column `socialMediaIntegrationId` to the `SocialMediaPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SocialMediaPost" DROP CONSTRAINT "SocialMediaPost_brandId_fkey";

-- AlterTable
ALTER TABLE "SocialMediaPost" DROP COLUMN "brandId",
ADD COLUMN     "socialMediaIntegrationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SocialMediaPost" ADD CONSTRAINT "SocialMediaPost_socialMediaIntegrationId_fkey" FOREIGN KEY ("socialMediaIntegrationId") REFERENCES "SocialMediaIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
