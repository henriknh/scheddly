"use server";

import { InvitationStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function cancelInvitation(invitationId: string) {
  const user = await getUserFromToken();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const invitation = await prisma.invitation.findUnique({
    where: { id: invitationId },
  });

  if (!invitation) {
    throw new Error("Invitation not found");
  }

  if (invitation.status !== InvitationStatus.pending) {
    throw new Error("Invitation is not pending");
  }

  const team = await prisma.team.findUnique({
    where: { id: invitation.teamId },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (team.ownerId !== user.id) {
    throw new Error("You are not the owner of the team");
  }

  await prisma.invitation.delete({
    where: { id: invitationId },
  });
}
