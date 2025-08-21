"use server";

import { InvitationStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";

export async function acceptInvitation(invitationId: string) {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
    });
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    if (
      invitation.status !== InvitationStatus.pending ||
      !(invitation.invitedUserId === user.id || invitation.email === user.email)
    ) {
      throw new Error("You cannot accept this invitation");
    }

    await prisma.$transaction(async (tx) => {
      await tx.team.update({
        where: { id: invitation.teamId },
        data: {
          members: { connect: { id: user.id } },
        },
      });

      await tx.invitation.update({
        where: { id: invitationId },
        data: {
          status: InvitationStatus.accepted,
          invitedUserId: user.id,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("ACCEPT_INVITE_ERROR", error);
    throw error instanceof Error ? error : new Error("Failed to accept");
  }
}
