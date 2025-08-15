import { Breadcrumb } from "@/components/common/breadcrumb";
import { Subscription } from "@/generated/prisma";
import { getUserFromToken } from "@/lib/user";
import { redirect } from "next/navigation";

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  if (user?.team?.subscription !== Subscription.PRO) {
    redirect("/dashboard/profile");
  }

  return (
    <div>
      <Breadcrumb label="Team" href="/dashboard/team" />
      {children}
    </div>
  );
}
