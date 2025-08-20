-- CreateTable
CREATE TABLE "public"."_TeamMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeamMembers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TeamMembers_B_index" ON "public"."_TeamMembers"("B");

-- AddForeignKey
ALTER TABLE "public"."_TeamMembers" ADD CONSTRAINT "_TeamMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_TeamMembers" ADD CONSTRAINT "_TeamMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Backfill existing single-team memberships into the new many-to-many table
INSERT INTO "public"."_TeamMembers" ("A", "B")
SELECT "teamId", "id"
FROM "public"."User"
WHERE "teamId" IS NOT NULL;
