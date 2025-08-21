"use server";

import { allowedEmails } from "@/app/api/debug/helpers";
import { getUser } from "@/app/api/user/get-user";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";

export default async function DebugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDevMode = process.env.NODE_ENV === "development";

  const user = await getUser();

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
    <div>
      <Breadcrumb label="Debug" href="/dashboard/debug" />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="actions">Actions</TabsTrigger>
        </TabsList>
      </Tabs>

      {children}
    </div>
  );
}
