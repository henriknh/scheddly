/*
  Warnings:

  - You are about to drop the column `socialMediaIntegrationId` on the `SocialMediaPost` table. All the data in the column will be lost.
  - Added the required column `socialMedia` to the `SocialMediaPost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandId` to the `SocialMediaPost` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SocialMediaPost" DROP CONSTRAINT "SocialMediaPost_socialMediaIntegrationId_fkey";

-- AlterTable
-- First add the new columns with default values
ALTER TABLE "SocialMediaPost" ADD COLUMN "socialMedia" "SocialMedia" NOT NULL DEFAULT 'INSTAGRAM';
ALTER TABLE "SocialMediaPost" ADD COLUMN "brandId" TEXT NOT NULL DEFAULT '';

-- Update the socialMedia and brandId columns based on the integration
UPDATE "SocialMediaPost" 
SET 
  "socialMedia" = "SocialMediaIntegration"."socialMedia",
  "brandId" = "SocialMediaIntegration"."brandId"
FROM "SocialMediaIntegration" 
WHERE "SocialMediaPost"."socialMediaIntegrationId" = "SocialMediaIntegration"."id";

-- Remove the default constraints
ALTER TABLE "SocialMediaPost" ALTER COLUMN "socialMedia" DROP DEFAULT;
ALTER TABLE "SocialMediaPost" ALTER COLUMN "brandId" DROP DEFAULT;

-- Add foreign key constraint for brandId
ALTER TABLE "SocialMediaPost" ADD CONSTRAINT "SocialMediaPost_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Drop the old column
ALTER TABLE "SocialMediaPost" DROP COLUMN "socialMediaIntegrationId";
