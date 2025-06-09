-- Add new columns
ALTER TABLE "SocialMediaIntegration" ADD COLUMN "accountName" TEXT;
ALTER TABLE "SocialMediaIntegration" ADD COLUMN "accountAvatarUrl" TEXT;

-- Copy data from old columns to new columns
UPDATE "SocialMediaIntegration"
SET "accountName" = "name",
    "accountAvatarUrl" = "avatarUrl";

-- Make new columns required
ALTER TABLE "SocialMediaIntegration" ALTER COLUMN "accountName" SET NOT NULL;

-- Remove old columns
ALTER TABLE "SocialMediaIntegration" DROP COLUMN "name";
ALTER TABLE "SocialMediaIntegration" DROP COLUMN "avatarUrl"; 