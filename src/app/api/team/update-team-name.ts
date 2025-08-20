"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function updateTeamName(teamId: string, newName: string) {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    const name = (newName ?? "").trim();
    if (name.length === 0) {
      throw new Error("Team name cannot be empty");
    }

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team) {
      throw new Error("Team not found");
    }
    if (team.ownerId !== user.id) {
      throw new Error("Only the team owner can rename the team");
    }

    const updated = await prisma.team.update({
      where: { id: teamId },
      data: { name },
    });

    return updated;
  } catch (error) {
    console.error("UPDATE_TEAM_NAME_ERROR", error);
    throw error instanceof Error
      ? error
      : new Error("Failed to update team name");
  }
}
