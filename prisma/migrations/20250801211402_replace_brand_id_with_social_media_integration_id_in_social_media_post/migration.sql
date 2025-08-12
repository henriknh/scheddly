/*
  Warnings:

  - You are about to drop the column `brandId` on the `SocialMediaPost` table. All the data in the column will be lost.
  - Added the required column `socialMediaIntegrationId` to the `SocialMediaPost` table without a default value. This is not possible if the table is not empty.

*/

-- 1) Add the new column as NULLable so we can backfill safely
ALTER TABLE "SocialMediaPost" ADD COLUMN "socialMediaIntegrationId" TEXT;

-- 2) Backfill using existing mapping from brandId + socialMedia → SocialMediaIntegration
--    If multiple integrations match a brand + social media, pick the most recently created one
UPDATE "SocialMediaPost" p
SET "socialMediaIntegrationId" = i.id
FROM (
  SELECT DISTINCT ON ("brandId", "socialMedia") id, "brandId", "socialMedia"
  FROM "SocialMediaIntegration"
  ORDER BY "brandId", "socialMedia", "createdAt" DESC
) i
WHERE p."brandId" = i."brandId"
  AND p."socialMedia" = i."socialMedia";

-- 3) Remove posts we cannot map to an integration (no socialMediaIntegrationId after backfill)
DELETE FROM "SocialMediaPost" WHERE "socialMediaIntegrationId" IS NULL;

-- 4) Enforce NOT NULL after cleaning up
ALTER TABLE "SocialMediaPost" ALTER COLUMN "socialMediaIntegrationId" SET NOT NULL;

-- 5) Drop old FK and column for brandId
ALTER TABLE "SocialMediaPost" DROP CONSTRAINT "SocialMediaPost_brandId_fkey";
ALTER TABLE "SocialMediaPost" DROP COLUMN "brandId";

-- 6) Add FK for the new relation
ALTER TABLE "SocialMediaPost" ADD CONSTRAINT "SocialMediaPost_socialMediaIntegrationId_fkey" FOREIGN KEY ("socialMediaIntegrationId") REFERENCES "SocialMediaIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
