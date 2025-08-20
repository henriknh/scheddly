"use server";

import { getUserFromToken } from "../user/get-user-from-token";
import prisma from "@/lib/prisma";

export async function deleteTeam(teamId: string) {
  const user = await getUserFromToken();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      members: true,
    },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  if (team.ownerId !== user.id) {
    throw new Error("Unauthorized");
  }

  const isEmpty =
    team.members.length === 0 ||
    (team.members.length === 1 && team.members[0].id === team.ownerId);

  if (!isEmpty) {
    throw new Error("Team is not empty. Please remove all members first.");
  }

  if (team.id === user.team?.id) {
    const fallbackTeam = await prisma.team.findFirst({
      where: {
        ownerId: {
          not: user.id,
        },
      },
    });

    if (!fallbackTeam) {
      throw new Error("No fallback team found");
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: { teamId: fallbackTeam.id },
      });

      await tx.team.delete({
        where: { id: teamId },
      });
    });
  } else {
    await prisma.team.delete({
      where: { id: teamId },
    });
  }
}
