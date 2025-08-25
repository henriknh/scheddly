-- CreateEnum
CREATE TYPE "public"."InstagramPostType" AS ENUM ('POST', 'STORY', 'REEL');

-- AlterTable
ALTER TABLE "public"."SocialMediaPost" ADD COLUMN     "instagramPostType" "public"."InstagramPostType";
