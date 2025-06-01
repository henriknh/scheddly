/*
  Warnings:

  - You are about to drop the column `images` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `video` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "images",
DROP COLUMN "video",
ADD COLUMN     "imageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "videoURL" TEXT;
