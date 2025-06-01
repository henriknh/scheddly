/*
  Warnings:

  - Made the column `accessToken` on table `SocialMediaIntegration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `accessTokenExpiresAt` on table `SocialMediaIntegration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `refreshToken` on table `SocialMediaIntegration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `refreshTokenExpiresAt` on table `SocialMediaIntegration` required. This step will fail if there are existing NULL values in that column.

*/
-- First update any NULL values with default values
UPDATE "SocialMediaIntegration"
SET 
  "accessToken" = 'pending',
  "accessTokenExpiresAt" = NOW() + INTERVAL '1 day',
  "refreshToken" = 'pending',
  "refreshTokenExpiresAt" = NOW() + INTERVAL '30 days'
WHERE 
  "accessToken" IS NULL 
  OR "accessTokenExpiresAt" IS NULL 
  OR "refreshToken" IS NULL 
  OR "refreshTokenExpiresAt" IS NULL;

-- Then make the columns required
ALTER TABLE "SocialMediaIntegration" 
  ALTER COLUMN "accessToken" SET NOT NULL,
  ALTER COLUMN "accessTokenExpiresAt" SET NOT NULL,
  ALTER COLUMN "refreshToken" SET NOT NULL,
  ALTER COLUMN "refreshTokenExpiresAt" SET NOT NULL;
