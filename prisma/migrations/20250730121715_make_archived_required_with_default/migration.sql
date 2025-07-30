/*
  Warnings:

  - Made the column `archived` on table `Post` required. This step will fail if there are existing NULL values in that column.

*/
-- Update existing NULL values to false
UPDATE "Post" SET "archived" = false WHERE "archived" IS NULL;

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "archived" SET NOT NULL,
ALTER COLUMN "archived" SET DEFAULT false;
