-- AlterTable
ALTER TABLE "public"."Invitation" ADD COLUMN     "invitedUserId" TEXT;

-- CreateIndex
CREATE INDEX "Invitation_invitedUserId_idx" ON "public"."Invitation"("invitedUserId");

-- AddForeignKey
ALTER TABLE "public"."Invitation" ADD CONSTRAINT "Invitation_invitedUserId_fkey" FOREIGN KEY ("invitedUserId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
