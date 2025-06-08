/*
  Warnings:

  - You are about to drop the column `failedAt` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `postedAt` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "failedAt",
DROP COLUMN "postedAt";

-- AlterTable
ALTER TABLE "SocialMediaPost" ADD COLUMN     "failedAt" TIMESTAMP(3),
ADD COLUMN     "postedAt" TIMESTAMP(3);
