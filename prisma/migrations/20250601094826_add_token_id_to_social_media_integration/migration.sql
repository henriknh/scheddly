/*
  Warnings:

  - You are about to drop the column `socialMediaIntegrationId` on the `Token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tokenId]` on the table `SocialMediaIntegration` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tokenId` to the `SocialMediaIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_socialMediaIntegrationId_fkey";

-- DropIndex
DROP INDEX "Token_socialMediaIntegrationId_key";

-- AlterTable
ALTER TABLE "SocialMediaIntegration" ADD COLUMN     "tokenId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "socialMediaIntegrationId";

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaIntegration_tokenId_key" ON "SocialMediaIntegration"("tokenId");

-- AddForeignKey
ALTER TABLE "SocialMediaIntegration" ADD CONSTRAINT "SocialMediaIntegration_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Token"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
