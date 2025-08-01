"use client";

import { UserAvatar } from "@/components/common/UserAvatar";
import { DataTable, DataTableColumnDef } from "@/components/ui/data-table";
import { Team } from "@/generated/prisma";
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
            <UserAvatar src={user.avatar?.id} />
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
      <p className="text-sm text-muted-foreground">
        Teams allow you to collaborate with others on your social media content.
        Invite team members to help create, schedule, and manage posts across
        your brands and integrations.
      </p>

      <DataTable columns={columns} data={team.members} />
    </div>
  );
}
