/*
  Warnings:

  - You are about to drop the column `socialMediaIntegrationAccountInfoId` on the `SocialMediaIntegration` table. All the data in the column will be lost.
  - You are about to drop the `SocialMediaIntegrationAccountInfo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accountId` to the `SocialMediaIntegration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `SocialMediaIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SocialMediaIntegration" DROP CONSTRAINT IF EXISTS "SocialMediaIntegration_socialMediaIntegrationAccountInfoId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "SocialMediaIntegration_socialMediaIntegrationAccountInfoId_key";

-- AlterTable
ALTER TABLE "SocialMediaIntegration" 
DROP COLUMN IF EXISTS "socialMediaIntegrationAccountInfoId",
ADD COLUMN     "accountId" TEXT NOT NULL DEFAULT 'unknown',
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'Unknown';

-- DropTable
DROP TABLE IF EXISTS "SocialMediaIntegrationAccountInfo";
