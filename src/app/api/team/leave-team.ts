"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { updateUserTokenWithCleanedUser } from "../user/helpers";

export async function leaveTeam(teamId: string) {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      throw new Error("Team not found");
    }
    if (team.ownerId === user.id) {
      throw new Error("Team owners cannot leave their own team");
    }

    const fallbackTeam = await prisma.team.findFirst({
      where: {
        id: {
          not: team.id,
        },
        members: {
          some: {
            id: user.id,
          },
        },
      },
    });

    if (!fallbackTeam) {
      throw new Error("No fallback team found");
    }

    await prisma.$transaction(async (tx) => {
      await tx.team.update({
        where: { id: team.id },
        data: { members: { disconnect: { id: user.id } } },
      });

      await tx.user.update({
        where: { id: user.id },
        data: {
          teamId: fallbackTeam.id,
        },
      });
    });

    return updateUserTokenWithCleanedUser(user);
  } catch (error) {
    console.error("LEAVE_TEAM_ERROR", error);
    throw error instanceof Error ? error : new Error("Failed to leave team");
  }
}
