/*
  Warnings:

  - The `targetPlatforms` column on the `Post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SocialMediaPlatform" AS ENUM ('INSTAGRAM', 'YOUTUBE', 'TUMBLR', 'PINTEREST', 'THREADS', 'TIKTOK');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "targetPlatforms",
ADD COLUMN     "targetPlatforms" "SocialMediaPlatform"[];

-- DropEnum
DROP TYPE "TargetPlatform";
