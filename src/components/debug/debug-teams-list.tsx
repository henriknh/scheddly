"use client";

import { TeamWithRelations } from "@/app/api/team/types";
import { UserAvatar } from "../common/UserAvatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface DebugTeamsListProps {
  teams: TeamWithRelations[];
}

export function DebugTeamsList({ teams }: DebugTeamsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Owner</TableCell>
          <TableCell>Members</TableCell>
          <TableCell>Invitations</TableCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {teams.map((team) => (
          <TableRow key={team.id}>
            <TableCell>{team.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <UserAvatar src={team.owner.avatar?.id} />

                {team.owner.name}
              </div>
            </TableCell>
            <TableCell>{team.members.length} members</TableCell>
            <TableCell>{team.invitations.length} invitations</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
