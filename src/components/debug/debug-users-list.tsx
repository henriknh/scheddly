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
import { formatDate, formatDateAgo } from "@/lib/format-date";
import { subscriptionTierToLabel } from "@/lib/pricing";

interface DebugUsersListProps {
  users: CleanedUser[];
}

export function DebugUsersList({ users }: DebugUsersListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableCell>Name</TableCell>
          <TableCell>Email</TableCell>
          <TableCell>Joined at</TableCell>
          <TableCell>Last seen at</TableCell>
          <TableCell>Subscription</TableCell>
        </TableRow>
      </TableHeader>

      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <UserAvatar src={user.avatar?.id} />

                {user.name}
              </div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatDate(user.createdAt)}</TableCell>
            <TableCell>{formatDateAgo(user.updatedAt)}</TableCell>
            <TableCell>
              {user.subscription?.subscriptionTier
                ? subscriptionTierToLabel(user.subscription.subscriptionTier)
                : "No subscription"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
