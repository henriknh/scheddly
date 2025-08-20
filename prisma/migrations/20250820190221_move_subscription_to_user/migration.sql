/*
  Data migration: move Subscription ownership from Team to User (team owner)
*/

-- 1) Add nullable userId column
ALTER TABLE "public"."Subscription" ADD COLUMN IF NOT EXISTS "userId" TEXT;

-- 2) Populate userId from the owning team's ownerId
UPDATE "public"."Subscription" AS s
SET "userId" = t."ownerId"
FROM "public"."Team" AS t
WHERE s."teamId" = t."id" AND s."userId" IS NULL;

-- 2.5) Deduplicate by userId: keep the most recent (by currentPeriodEnd, then createdAt)
WITH ranked AS (
  SELECT id,
         "userId",
         ROW_NUMBER() OVER (
           PARTITION BY "userId"
           ORDER BY COALESCE("currentPeriodEnd", "createdAt") DESC, "createdAt" DESC, id DESC
         ) AS rn
  FROM "public"."Subscription"
  WHERE "userId" IS NOT NULL
)
DELETE FROM "public"."Subscription" s
USING ranked r
WHERE s.id = r.id AND r.rn > 1;

-- 3) Add FK to User and make userId NOT NULL
DO $$ BEGIN
  BEGIN
    ALTER TABLE "public"."Subscription"
    ADD CONSTRAINT "Subscription_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
  EXCEPTION WHEN duplicate_object THEN
    NULL;
  END;
END $$;

ALTER TABLE "public"."Subscription" ALTER COLUMN "userId" SET NOT NULL;

-- 4) Drop old FK and unique index on teamId, then drop column
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'Subscription'
      AND constraint_name = 'Subscription_teamId_fkey'
  ) THEN
    ALTER TABLE "public"."Subscription" DROP CONSTRAINT "Subscription_teamId_fkey";
  END IF;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'Subscription_teamId_key'
  ) THEN
    EXECUTE 'DROP INDEX "public"."Subscription_teamId_key"';
  END IF;
END $$;

ALTER TABLE "public"."Subscription" DROP COLUMN IF EXISTS "teamId";

-- 5) Add unique index on userId
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'Subscription_userId_key'
  ) THEN
    CREATE UNIQUE INDEX "Subscription_userId_key" ON "public"."Subscription"("userId");
  END IF;
END $$;
