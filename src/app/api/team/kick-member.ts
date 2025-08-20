"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function kickMember(teamId: string, memberUserId: string) {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    const team = await prisma.team.findUnique({ where: { id: teamId } });
    if (!team || team.ownerId !== user.id) {
      throw new Error("Only the team owner can kick members");
    }
    if (memberUserId === team.ownerId) {
      throw new Error("You cannot kick the team owner");
    }

    await prisma.team.update({
      where: { id: team.id },
      data: { members: { disconnect: { id: memberUserId } } },
    });

    return { success: true };
  } catch (error) {
    console.error("KICK_MEMBER_ERROR", error);
    throw error instanceof Error ? error : new Error("Failed to kick member");
  }
}
