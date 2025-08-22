"use client";

import { TeamWithRelations } from "@/app/api/team/types";
import { formatDate } from "@/lib/format-date";
import { Header } from "../common/Header";
import { UserAvatar } from "../common/UserAvatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Mail } from "lucide-react";

interface DebugTeamViewProps {
  team: TeamWithRelations;
}

export function DebugTeamView({ team }: DebugTeamViewProps) {
  return (
    <div className="flex flex-col gap-8">
      <Header>{team.name}</Header>

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Member since</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {team.members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <UserAvatar src={member.avatar?.id} />

                  {member.name}
                </div>
              </TableCell>
              <TableCell>{formatDate(member.createdAt)}</TableCell>
            </TableRow>
          ))}

          {team.invitations
            .sort((a) => (a.invitedUser ? -1 : 1))
            .map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell>
                  <div className="flex items-center gap-4">
                    {invitation.invitedUser ? (
                      <div className="flex items-center gap-2">
                        <UserAvatar src={invitation.invitedUser.avatar?.id} />

                        {invitation.invitedUser.name}
                      </div>
                    ) : (
                      <div>{invitation.email}</div>
                    )}

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      Invitation sent
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatDate(invitation.createdAt)}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
