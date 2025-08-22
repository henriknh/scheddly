"use server";

import { getDebugTeams } from "@/app/api/debug/teams";
import { DebugTeamsList } from "@/components/debug/debug-teams-list";

export default async function TeamsPage() {
  const teams = await getDebugTeams();

  return <DebugTeamsList teams={teams} />;
}
