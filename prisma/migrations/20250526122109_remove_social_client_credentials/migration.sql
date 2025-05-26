/*
  Warnings:

  - You are about to drop the column `pinterestClientId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `pinterestClientSecret` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tumblrClientId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tumblrClientSecret` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "pinterestClientId",
DROP COLUMN "pinterestClientSecret",
DROP COLUMN "tumblrClientId",
DROP COLUMN "tumblrClientSecret";
