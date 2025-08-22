"use server";

import { Breadcrumb } from "@/components/common/breadcrumb";

export default async function DebugUsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb label="Users" href="/dashboard/debug/users" />

      {children}
    </>
  );
}
