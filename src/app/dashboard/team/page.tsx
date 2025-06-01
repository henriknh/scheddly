import { getTeamWithMembers } from "@/app/api/team/get-team-with-members";
import { TeamList } from "@/components/team/TeamList";

export default async function TeamPage() {
  const team = await getTeamWithMembers();

  if (!team) {
    throw new Error("Team not found");
  }

  return <TeamList team={team} />;
}
