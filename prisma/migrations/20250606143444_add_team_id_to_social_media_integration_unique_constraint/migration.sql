/*
  Warnings:

  - A unique constraint covering the columns `[socialMedia,accountId,teamId]` on the table `SocialMediaIntegration` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "SocialMediaIntegration_socialMedia_accountId_key";

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaIntegration_socialMedia_accountId_teamId_key" ON "SocialMediaIntegration"("socialMedia", "accountId", "teamId");
