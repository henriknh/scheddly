-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "TargetPlatform" AS ENUM ('INSTAGRAM', 'YOUTUBE', 'TUMBLR', 'PINTEREST', 'THREADS', 'TIKTOK');

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "postType" "PostType" NOT NULL,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "video" TEXT,
    "targetPlatforms" "TargetPlatform"[],
    "scheduledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
