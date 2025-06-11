/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `videoCoverUrl` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Post` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[videoId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[videoCoverId]` on the table `Post` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "imageUrls",
DROP COLUMN "videoCoverUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "videoCoverId" TEXT,
ADD COLUMN     "videoId" TEXT;

-- CreateTable
CREATE TABLE "_FileToPost" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_FileToPost_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_FileToPost_B_index" ON "_FileToPost"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Post_videoId_key" ON "Post"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "Post_videoCoverId_key" ON "Post"("videoCoverId");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_videoCoverId_fkey" FOREIGN KEY ("videoCoverId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToPost" ADD CONSTRAINT "_FileToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FileToPost" ADD CONSTRAINT "_FileToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
