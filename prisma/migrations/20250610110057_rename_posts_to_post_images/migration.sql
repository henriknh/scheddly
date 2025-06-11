/*
  Warnings:

  - You are about to drop the `_FileToPost` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[postId]` on the table `File` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_FileToPost" DROP CONSTRAINT "_FileToPost_A_fkey";

-- DropForeignKey
ALTER TABLE "_FileToPost" DROP CONSTRAINT "_FileToPost_B_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "postId" TEXT;

-- DropTable
DROP TABLE "_FileToPost";

-- CreateIndex
CREATE UNIQUE INDEX "File_postId_key" ON "File"("postId");

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
