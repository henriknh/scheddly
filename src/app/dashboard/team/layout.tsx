import { Breadcrumb } from "@/components/common/breadcrumb";
import { SubscriptionTier } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  let isPro = false;
  if (user?.team?.id) {
    const stripeSub = await prisma.subscription.findUnique({
      where: { teamId: user.team.id },
      select: { subscriptionTier: true },
    });
    isPro = stripeSub?.subscriptionTier === SubscriptionTier.PRO;
  }

  if (!isPro) {
    redirect("/dashboard/profile");
  }

  return (
    <div>
      <Breadcrumb label="Team" href="/dashboard/team" />
      {children}
    </div>
  );
}
