/*
  Warnings:

  - You are about to drop the column `createdById` on the `Brand` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `SocialMediaIntegration` table. All the data in the column will be lost.
  - Added the required column `teamId` to the `Brand` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `SocialMediaIntegration` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Brand" DROP CONSTRAINT "Brand_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_createdById_fkey";

-- DropForeignKey
ALTER TABLE "SocialMediaIntegration" DROP CONSTRAINT "SocialMediaIntegration_createdById_fkey";

-- AlterTable
ALTER TABLE "Brand" DROP COLUMN "createdById",
ADD COLUMN     "teamId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "createdById",
ADD COLUMN     "teamId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SocialMediaIntegration" DROP COLUMN "createdById",
ADD COLUMN     "teamId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "teamId" TEXT;

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_ownerId_key" ON "Team"("ownerId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialMediaIntegration" ADD CONSTRAINT "SocialMediaIntegration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brand" ADD CONSTRAINT "Brand_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
