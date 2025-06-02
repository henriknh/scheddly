/*
  Warnings:

  - You are about to drop the column `failedAt` on the `SocialMediaPost` table. All the data in the column will be lost.
  - You are about to drop the column `postedAt` on the `SocialMediaPost` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "failedAt" TIMESTAMP(3),
ADD COLUMN     "postedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "SocialMediaPost" DROP COLUMN "failedAt",
DROP COLUMN "postedAt";
