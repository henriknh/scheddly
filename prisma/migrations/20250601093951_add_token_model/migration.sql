/*
  Warnings:

  - You are about to drop the column `accessToken` on the `SocialMediaIntegration` table. All the data in the column will be lost.
  - You are about to drop the column `accessTokenExpiresAt` on the `SocialMediaIntegration` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `SocialMediaIntegration` table. All the data in the column will be lost.
  - You are about to drop the column `refreshTokenExpiresAt` on the `SocialMediaIntegration` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SocialMediaIntegration" DROP COLUMN "accessToken",
DROP COLUMN "accessTokenExpiresAt",
DROP COLUMN "refreshToken",
DROP COLUMN "refreshTokenExpiresAt";

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "accessTokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "refreshTokenExpiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "socialMediaIntegrationId" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_socialMediaIntegrationId_key" ON "Token"("socialMediaIntegrationId");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_socialMediaIntegrationId_fkey" FOREIGN KEY ("socialMediaIntegrationId") REFERENCES "SocialMediaIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
