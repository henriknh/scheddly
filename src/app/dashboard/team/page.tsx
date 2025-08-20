import { getTeams } from "@/app/api/team/get-teams";
import { Breadcrumb } from "@/components/common/breadcrumb";
import { InvitationCards } from "@/components/profile/InvitationCards";
import { TeamList } from "@/components/team/TeamList";
import { getPendingInvitationsForCurrentUser } from "@/app/api/team/get-pending-invitations-for-current-user";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  const teams = await getTeams();

  const pendingInvitations = await getPendingInvitationsForCurrentUser();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Breadcrumb label="Team" href="/dashboard/team" />
      </div>

      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Teams allow you to collaborate with others on your social media
          content. Invite team members to help create, schedule, and manage
          posts across your brands and integrations.
        </p>

        <InvitationCards pendingInvitations={pendingInvitations} />

        {teams.map((team) => (
          <TeamList key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
