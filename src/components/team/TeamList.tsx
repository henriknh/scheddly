"use client";

import { Team, User } from "@/generated/prisma";
import { DataTable, DataTableColumnDef } from "@/components/ui/data-table";
import { UserAvatar } from "@/components/common/UserAvatar";
import { Header } from "@/components/common/Header";

interface TeamListProps {
  team: Team & {
    owner: User;
    members: User[];
  };
}

export function TeamList({ team }: TeamListProps) {
  const columns: DataTableColumnDef<User, unknown>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            <UserAvatar
              src={user.avatarUrl || undefined}
              fallback={user.name || undefined}
            />
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
