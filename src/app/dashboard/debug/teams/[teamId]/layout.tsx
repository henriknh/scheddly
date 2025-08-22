"use server";

import { Breadcrumb } from "@/components/common/breadcrumb";

export default async function DebugTeamLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;

  return (
    <>
      <Breadcrumb label="Team" href={`/dashboard/debug/teams/${teamId}`} />

      {children}
    </>
  );
}
