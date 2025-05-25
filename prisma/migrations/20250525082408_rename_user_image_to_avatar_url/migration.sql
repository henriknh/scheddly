/*
  Warnings:

  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tumblrOAuthConsumerKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `tumblrOAuthConsumerSecret` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "image",
DROP COLUMN "tumblrOAuthConsumerKey",
DROP COLUMN "tumblrOAuthConsumerSecret",
ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "tumblrClientId" TEXT,
ADD COLUMN     "tumblrClientSecret" TEXT;
