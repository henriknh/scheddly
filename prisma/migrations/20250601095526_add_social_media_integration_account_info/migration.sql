-- CreateTable
CREATE TABLE "SocialMediaIntegrationAccountInfo" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "socialMediaIntegrationId" TEXT NOT NULL,

    CONSTRAINT "SocialMediaIntegrationAccountInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialMediaIntegrationAccountInfo_socialMediaIntegrationId_key" ON "SocialMediaIntegrationAccountInfo"("socialMediaIntegrationId");

-- AddForeignKey
ALTER TABLE "SocialMediaIntegrationAccountInfo" ADD CONSTRAINT "SocialMediaIntegrationAccountInfo_socialMediaIntegrationId_fkey" FOREIGN KEY ("socialMediaIntegrationId") REFERENCES "SocialMediaIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
