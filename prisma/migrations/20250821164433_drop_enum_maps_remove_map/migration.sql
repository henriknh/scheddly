/*
  Warnings:

  - The values [CREATOR,PRO] on the enum `SubscriptionTier` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."SubscriptionTier_new" AS ENUM ('STARTER', 'GROWTH', 'SCALE');
ALTER TABLE "public"."Subscription" ALTER COLUMN "subscriptionTier" TYPE "public"."SubscriptionTier_new" USING (
  CASE ("subscriptionTier"::text)
    WHEN 'CREATOR' THEN 'GROWTH'
    WHEN 'PRO' THEN 'SCALE'
    ELSE "subscriptionTier"::text
  END::"public"."SubscriptionTier_new"
);
ALTER TYPE "public"."SubscriptionTier" RENAME TO "SubscriptionTier_old";
ALTER TYPE "public"."SubscriptionTier_new" RENAME TO "SubscriptionTier";
DROP TYPE "public"."SubscriptionTier_old";
COMMIT;
