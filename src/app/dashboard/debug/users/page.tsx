"use server";

import { Breadcrumb } from "@/components/common/breadcrumb";
import { DebugUsersList } from "@/components/debug/debug-users-list";
import { getDebugUsers } from "@/app/api/debug/users";

export default async function DebugUsersPage() {
  const users = await getDebugUsers();

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb label="Debug" href="/dashboard/debug" />
      <Breadcrumb label="Users" href="/dashboard/debug/users" />

      <DebugUsersList users={users} />
    </div>
  );
}
