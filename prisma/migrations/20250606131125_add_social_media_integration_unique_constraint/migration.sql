/*
  Warnings:

  - A unique constraint covering the columns `[socialMedia,accountId]` on the table `SocialMediaIntegration` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaIntegration_socialMedia_accountId_key" ON "SocialMediaIntegration"("socialMedia", "accountId");
