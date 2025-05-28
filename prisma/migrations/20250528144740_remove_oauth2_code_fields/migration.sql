/*
  Warnings:

  - You are about to drop the column `oauth2PinterestCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `oauth2TumblrCode` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "oauth2PinterestCode",
DROP COLUMN "oauth2TumblrCode";
