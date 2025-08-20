"use server";

import { InvitationStatus } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";

export async function inviteUserByEmail(email: string, teamId: string) {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team || team.ownerId !== user.id) {
      throw new Error("Only the team owner can invite members");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.invitation.findFirst({
      where: {
        teamId,
        email: normalizedEmail,
        status: InvitationStatus.pending,
      },
    });
    if (existing) {
      return existing;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true },
    });

    const invitation = await prisma.invitation.create({
      data: {
        email: normalizedEmail,
        teamId,
        invitedById: user.id,
        invitedUserId: existingUser?.id ?? null,
      },
    });

    return invitation;
  } catch (error) {
    console.error("INVITE_USER_ERROR", error);
    throw error instanceof Error ? error : new Error("Failed to invite user");
  }
}
