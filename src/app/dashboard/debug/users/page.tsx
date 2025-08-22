"use server";

import { getDebugUsers } from "@/app/api/debug/users";
import { DebugUsersList } from "@/components/debug/debug-users-list";

export default async function DebugUsersPage() {
  const users = await getDebugUsers();

  return <DebugUsersList users={users} />;
}
