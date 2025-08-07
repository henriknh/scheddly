import { getTeamWithMembers } from "@/app/api/team/get-team-with-members";
import { TeamList } from "@/components/team/TeamList";
import { Breadcrumb } from "@/components/common/breadcrumb";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const team = await getTeamWithMembers();

  if (!team) {
    throw new Error("Team not found");
  }

  return (
    <div>
      <Breadcrumb label="Team" href="/dashboard/team" />
      <TeamList team={team} />
    </div>
  );
}
