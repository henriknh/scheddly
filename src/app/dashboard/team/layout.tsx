import { Breadcrumb } from "@/components/common/breadcrumb";
import { SubscriptionTier } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { redirect } from "next/navigation";
import { getPendingInvitationsForCurrentUser } from "../../api/team/get-pending-invitations-for-current-user";

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  const pendingInvitations = await getPendingInvitationsForCurrentUser();

  let isPro = false;
  if (user?.team?.id) {
    const stripeSub = await prisma.subscription.findUnique({
      where: { teamId: user.team.id },
      select: { subscriptionTier: true },
    });
    isPro = stripeSub?.subscriptionTier === SubscriptionTier.PRO;
  }

  if (!isPro && pendingInvitations.length === 0 && false) {
    console.log("TODO");
    redirect("/dashboard/profile");
  }

  return (
    <div>
      <Breadcrumb label="Team" href="/dashboard/team" />
      {children}
    </div>
  );
}
