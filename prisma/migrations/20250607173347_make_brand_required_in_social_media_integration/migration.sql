/*
  Warnings:

  - Made the column `brandId` on table `SocialMediaIntegration` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "SocialMediaIntegration" DROP CONSTRAINT "SocialMediaIntegration_brandId_fkey";

-- AlterTable
ALTER TABLE "SocialMediaIntegration" ALTER COLUMN "brandId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "SocialMediaIntegration" ADD CONSTRAINT "SocialMediaIntegration_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
