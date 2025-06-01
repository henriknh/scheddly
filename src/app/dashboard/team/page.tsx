import { getCurrentTeam } from "@/app/api/user/team/actions";
import { TeamList } from "@/components/team/TeamList";

export default async function TeamPage() {
  const team = await getCurrentTeam();

  if (!team) {
    throw new Error("Team not found");
  }

  return <TeamList team={team} />;
}
