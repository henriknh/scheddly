"use server";

import { getDebugTeams } from "@/app/api/debug/teams";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { DebugTeamsList } from "@/components/debug/debug-teams-list";

export default async function TeamsPage() {
  const teams = await getDebugTeams();

  return (
    <div>
      <Breadcrumb label="Debug" href="/dashboard/debug" />
      <Breadcrumb label="Teams" href="/dashboard/debug/teams" />

      <DebugTeamsList teams={teams} />
    </div>
  );
}
