/*
  Warnings:

  - You are about to drop the column `videoURL` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "videoURL",
ADD COLUMN     "videoUrl" TEXT;
