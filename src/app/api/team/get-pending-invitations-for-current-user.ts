"use server";

import { InvitationStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { InvitationWithRelations } from "./types";

export async function getPendingInvitationsForCurrentUser(): Promise<
  InvitationWithRelations[]
> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id || !user.email) {
      throw new Error("Unauthorized");
    }

    const invitations = await prisma.invitation.findMany({
      where: {
        status: InvitationStatus.pending,
        OR: [{ invitedUserId: user.id }, { email: user.email.toLowerCase() }],
      },
      include: {
        team: true,
        invitedUser: {
          include: {
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return invitations;
  } catch (error) {
    console.error("GET_PENDING_INVITES_ERROR", error);
    throw new Error("Failed to load invitations");
  }
}
