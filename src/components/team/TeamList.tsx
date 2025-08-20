"use client";

import { TeamWithRelations } from "@/app/api/team/types";
import { useAuth } from "@/lib/auth-context";
import { Crown, Mail } from "lucide-react";
import { UserAvatar } from "../common/UserAvatar";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CancelInviteDialog } from "./CancelInviteDialog";
import { EditTeamNameDialog } from "./EditTeamNameDialog";
import { InviteMemberDialog } from "./InviteMemberDialog";
import { KickTeamMemberDialog } from "./KickTeamMemberDialog";
import { LeaveTeamDialog } from "./LeaveTeamDialog";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { InvitationStatus } from "@/generated/prisma";
import { DeleteTeamDialog } from "./DeleteTeamDialog";

interface TeamListProps {
  team: TeamWithRelations;
}

export function TeamList({ team }: TeamListProps) {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const isOwner = user?.id === team.ownerId;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="truncate">{team.name}</div>

          {isOwner ? (
            <div className="flex items-center gap-2">
              <EditTeamNameDialog teamId={team.id} currentName={team.name} />

              <DeleteTeamDialog teamId={team.id} />

              <InviteMemberDialog teamId={team.id} />
            </div>
          ) : (
            <LeaveTeamDialog team={team} />
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {team.members
              .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
              .map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <UserAvatar src={member.avatar?.id} />
                      {member.name}{" "}
                      {member.id === team.ownerId && (
                        <>
                          {isMobile ? (
                            <Tooltip>
                              <TooltipTrigger>
                                <span className="text-xs text-muted-foreground">
                                  <Crown className="h-4 w-4" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>Owner</TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-xs text-muted-foreground flex gap-1 items-center">
                              <Crown className="h-4 w-4" />
                              Owner
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <KickTeamMemberDialog team={team} member={member} />
                  </TableCell>
                </TableRow>
              ))}

            {isOwner &&
              team.invitations?.length > 0 &&
              team.invitations
                .sort((a, b) =>
                  (a.invitedUser?.name ?? "").localeCompare(
                    b.invitedUser?.name ?? ""
                  )
                )
                .sort((a, b) =>
                  !a.invitedUserId ? 1 : !b.invitedUserId ? -1 : 0
                )
                .filter(
                  (invitation) => invitation.status === InvitationStatus.pending
                )
                .map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <UserAvatar src={invitation.invitedUser?.avatar?.id} />
                        {invitation.invitedUser?.name ?? invitation.email}

                        {isMobile ? (
                          <Tooltip>
                            <TooltipTrigger>
                              <span className="text-xs text-muted-foreground">
                                <Mail className="h-4 w-4" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Invite pending</TooltipContent>
                          </Tooltip>
                        ) : (
                          <span className="text-xs text-muted-foreground flex gap-1 items-center">
                            <Mail className="h-4 w-4" />
                            Invite pending
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="flex justify-end gap-2">
                      <CancelInviteDialog invitation={invitation} />
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
