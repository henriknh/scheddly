-- AlterTable
ALTER TABLE "SocialMediaPost" ADD COLUMN     "xCommunityId" TEXT,
ADD COLUMN     "xShareWithFollowers" BOOLEAN DEFAULT true;

-- CreateTable
CREATE TABLE "XCommunity" (
    "id" TEXT NOT NULL,
    "xId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "socialMediaIntegrationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "XCommunity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "XCommunity_socialMediaIntegrationId_xId_key" ON "XCommunity"("socialMediaIntegrationId", "xId");

-- AddForeignKey
ALTER TABLE "XCommunity" ADD CONSTRAINT "XCommunity_socialMediaIntegrationId_fkey" FOREIGN KEY ("socialMediaIntegrationId") REFERENCES "SocialMediaIntegration"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
