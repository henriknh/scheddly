"use server";

import { InvitationStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function declineInvitation(invitationId: string) {
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
      throw new Error("You cannot decline this invitation");
    }

    await prisma.invitation.update({
      where: { id: invitationId },
      data: { status: InvitationStatus.declined },
    });

    return { success: true };
  } catch (error) {
    console.error("DECLINE_INVITE_ERROR", error);
    throw error instanceof Error ? error : new Error("Failed to decline");
  }
}
