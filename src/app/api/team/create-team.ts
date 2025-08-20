"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";

export async function createTeam(name: string) {
  const user = await getUserFromToken();
  if (!user || !user.id) {
    throw new Error("User not found");
  }

  const team = await prisma.team.create({
    data: { name, ownerId: user.id, members: { connect: { id: user.id } } },
  });

  return team;
}
