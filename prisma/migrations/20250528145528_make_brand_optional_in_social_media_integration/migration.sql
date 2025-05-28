-- DropForeignKey
ALTER TABLE "SocialMediaIntegration" DROP CONSTRAINT "SocialMediaIntegration_brandId_fkey";

-- AlterTable
ALTER TABLE "SocialMediaIntegration" ALTER COLUMN "brandId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "SocialMediaIntegration" ADD CONSTRAINT "SocialMediaIntegration_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
