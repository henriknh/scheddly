/*
  Warnings:

  - Added the required column `createdById` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `SocialMediaIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SocialMediaIntegration" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "SocialMediaIntegration" ADD CONSTRAINT "SocialMediaIntegration_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
