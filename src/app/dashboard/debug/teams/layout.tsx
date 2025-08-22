"use server";

import { Breadcrumb } from "@/components/common/breadcrumb";

export default async function DebugTeamsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Breadcrumb label="Teams" href="/dashboard/debug/teams" />

      {children}
    </>
  );
}
