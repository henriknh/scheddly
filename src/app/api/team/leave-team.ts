"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

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

    await prisma.team.update({
      where: { id: team.id },
      data: { members: { disconnect: { id: user.id } } },
    });

    return { success: true };
  } catch (error) {
    console.error("LEAVE_TEAM_ERROR", error);
    throw error instanceof Error ? error : new Error("Failed to leave team");
  }
}
