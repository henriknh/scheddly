/*
  Warnings:

  - You are about to drop the column `targetPlatforms` on the `Post` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SocialMedia" AS ENUM ('INSTAGRAM', 'YOUTUBE', 'TUMBLR', 'PINTEREST', 'THREADS', 'TIKTOK');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "targetPlatforms";

-- DropEnum
DROP TYPE "SocialMediaPlatform";

-- CreateTable
CREATE TABLE "SocialMediaPost" (
    "id" TEXT NOT NULL,
    "socialMedia" "SocialMedia" NOT NULL,
    "failedReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "SocialMediaPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SocialMediaPost" ADD CONSTRAINT "SocialMediaPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
