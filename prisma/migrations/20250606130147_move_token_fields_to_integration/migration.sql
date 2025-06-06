/*
  Warnings:

  - You are about to drop the column `tokenId` on the `SocialMediaIntegration` table. All the data in the column will be lost.
  - You are about to drop the `Token` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `accessToken` to the `SocialMediaIntegration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accessTokenExpiresAt` to the `SocialMediaIntegration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `SocialMediaIntegration` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshTokenExpiresAt` to the `SocialMediaIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SocialMediaIntegration" DROP CONSTRAINT "SocialMediaIntegration_tokenId_fkey";

-- DropIndex
DROP INDEX "SocialMediaIntegration_tokenId_key";

-- AlterTable
ALTER TABLE "SocialMediaIntegration" DROP COLUMN "tokenId",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "accessTokenExpiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL,
ADD COLUMN     "refreshTokenExpiresAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "accountId" DROP DEFAULT,
ALTER COLUMN "name" DROP DEFAULT;

-- DropTable
DROP TABLE "Token";
