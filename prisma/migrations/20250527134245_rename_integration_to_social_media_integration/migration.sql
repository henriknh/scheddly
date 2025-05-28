/*
  Warnings:

  - You are about to drop the `Integration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Integration" DROP CONSTRAINT "Integration_brandId_fkey";

-- DropTable
DROP TABLE "Integration";

-- CreateTable
CREATE TABLE "SocialMediaIntegration" (
    "id" TEXT NOT NULL,
    "socialMedia" "SocialMedia" NOT NULL,
    "code" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialMediaIntegration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SocialMediaIntegration" ADD CONSTRAINT "SocialMediaIntegration_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
