"use server";

import { getDebugTeam } from "@/app/api/debug/team";
import { DebugTeamView } from "@/components/debug/debug-team-view";

export default async function DebugTeamPage({
  params,
}: {
  params: Promise<{ teamId: string }>;
}) {
  const { teamId } = await params;
  const team = await getDebugTeam(teamId);

  if (!team) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Team not found</p>
      </div>
    );
  }

  return <DebugTeamView team={team} />;
}
