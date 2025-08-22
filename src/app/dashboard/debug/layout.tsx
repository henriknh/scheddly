"use server";

import { isDebugUser } from "@/app/api/debug/helpers";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { DebugTabs } from "@/components/debug/DebugTabs";
import { redirect } from "next/navigation";

export default async function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromToken();

  if (!user) {
    redirect("/login");
  }

  if (!(await isDebugUser())) {
    redirect("/dashboard");
  }

  return (
    <>
      <Breadcrumb label="Debug" href="/dashboard/debug" />

      <div className="flex flex-col gap-4">
        <DebugTabs />

        {children}
      </div>
    </>
  );
}
