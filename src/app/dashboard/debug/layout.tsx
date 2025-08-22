"use server";

import { allowedEmails } from "@/app/api/debug/helpers";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDevMode = process.env.NODE_ENV === "development";

  const user = await getUserFromToken();

  if (!user) {
    redirect("/login");
  }

  if (!allowedEmails.includes(user?.email ?? "")) {
    redirect("/dashboard");
  }

  if (!isDevMode) {
    redirect("/dashboard");
  }

  return (
    <>
      <Breadcrumb label="Debug" href="/dashboard/debug" />

      <div className="flex flex-col gap-4">
        <Tabs defaultValue="overview">
          <TabsList>
            <Link href="/dashboard/debug">
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </Link>
            <Link href="/dashboard/debug/users">
              <TabsTrigger value="users">Users</TabsTrigger>
            </Link>
            <Link href="/dashboard/debug/actions">
              <TabsTrigger value="actions">Actions</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>

        {children}
      </div>
    </>
  );
}
