"use client";

import { Team } from "@/generated/prisma";
import { DataTable, DataTableColumnDef } from "@/components/ui/data-table";
import { Avatar } from "@/components/common/UserAvatar";
import { Header } from "@/components/common/Header";
import { UserWithRelations } from "@/lib/user";

interface TeamListProps {
  team: Team & {
    owner: UserWithRelations;
    members: UserWithRelations[];
  };
}

export function TeamList({ team }: TeamListProps) {
  const columns: DataTableColumnDef<UserWithRelations, unknown>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <Avatar src={user.avatar?.path} fallback={user.name} />
            <span>{user.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "owner",
      header: "Role",
      cell: ({ row }) => {
        const user = row.original;
        return user.id === team.ownerId ? "Owner" : "Member";
      },
    },
  ];

  return (
    <div className="space-y-4">
      <Header>Team Members</Header>
      <DataTable columns={columns} data={team.members} />
    </div>
  );
}
