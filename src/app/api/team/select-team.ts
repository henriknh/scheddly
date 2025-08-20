"use server";

import { getUserFromToken } from "../user/get-user-from-token";
import prisma from "@/lib/prisma";

export async function selectTeam(teamId: string) {
  const user = await getUserFromToken();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const team = await prisma.team.findUnique({
    where: { id: teamId, members: { some: { id: user.id } } },
  });

  if (!team) {
    throw new Error("Team not found");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { teamId },
  });
}
