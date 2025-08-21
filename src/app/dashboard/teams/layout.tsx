"use server";

import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { SubscriptionTier } from "@/generated/prisma";
import { redirect } from "next/navigation";
import { getPendingInvitationsForCurrentUser } from "../../api/team/get-pending-invitations-for-current-user";

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();
  const pendingInvitations = await getPendingInvitationsForCurrentUser();

  if (
    user?.subscription?.subscriptionTier !== SubscriptionTier.PRO &&
    pendingInvitations.length === 0
  ) {
    redirect("/dashboard/profile");
  }

  return (
    <div>
      <Breadcrumb label="Teams" href="/dashboard/teams" />
      {children}
    </div>
  );
}
