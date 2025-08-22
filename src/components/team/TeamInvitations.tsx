"use client";

import { InvitationWithRelations } from "@/app/api/team/types";
import { TeamInvitation } from "./TeamInvitation";

interface TeamInvitationsProps {
  pendingInvitations: InvitationWithRelations[];
}

export function TeamInvitations({ pendingInvitations }: TeamInvitationsProps) {
  if (pendingInvitations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {pendingInvitations.map((inv) => (
        <TeamInvitation key={inv.id} pendingInvitation={inv} />
      ))}
    </div>
  );
}
