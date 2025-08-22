"use client";

import { CleanedUser } from "@/app/api/user/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { UserAvatar } from "../common/UserAvatar";

interface DebugUsersListProps {
  users: CleanedUser[];
}

export function DebugUsersList({ users }: DebugUsersListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>Name</TableRow>
        <TableRow>Email</TableRow>
        <TableRow>Joined at</TableRow>
        <TableRow>Last seen at</TableRow>
        <TableRow>Subscription</TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell className="flex items-center gap-2">
              <UserAvatar src={user.avatar?.path} />

              {user.name}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.createdAt.toLocaleString()}</TableCell>
            <TableCell>{user.updatedAt.toLocaleString()}</TableCell>
            <TableCell>
              {user.subscription?.status || "No subscription"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
