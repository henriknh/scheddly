"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DataTable, DataTableColumnDef } from "@/components/ui/data-table";

interface DebugUserRow {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface DebugUsersListProps {
  users: Array<{
    id: string;
    name: string | null;
    email: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }>;
}

export function DebugUsersList({ users }: DebugUsersListProps) {
  const data: DebugUserRow[] = (users || []).map((u) => ({
    id: u.id,
    name: u.name ?? null,
    email: u.email,
    createdAt: new Date(u.createdAt).toLocaleString(),
    updatedAt: new Date(u.updatedAt).toLocaleString(),
  }));

  const columns: DataTableColumnDef<DebugUserRow, unknown>[] = [
    { accessorKey: "id", header: "ID", width: 280 },
    { accessorKey: "name", header: "Name", width: 180 },
    { accessorKey: "email", header: "Email", width: 220 },
    { accessorKey: "createdAt", header: "Created", width: 200 },
    { accessorKey: "updatedAt", header: "Updated", width: 200 },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <DataTable columns={columns} data={data} />
      </CardContent>
    </Card>
  );
}
