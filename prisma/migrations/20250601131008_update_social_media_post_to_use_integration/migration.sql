/*
  Warnings:

  - You are about to drop the column `socialMedia` on the `SocialMediaPost` table. All the data in the column will be lost.
  - Added the required column `socialMediaIntegrationId` to the `SocialMediaPost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SocialMediaPost" DROP COLUMN "socialMedia",
ADD COLUMN     "socialMediaIntegrationId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SocialMediaPost" ADD CONSTRAINT "SocialMediaPost_socialMediaIntegrationId_fkey" FOREIGN KEY ("socialMediaIntegrationId") REFERENCES "SocialMediaIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
