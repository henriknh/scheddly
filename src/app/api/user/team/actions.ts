"use server";

import { Team, User } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUser } from "@/lib/user";

export async function getCurrentTeam(): Promise<
  | (Team & {
      owner: User;
      members: User[];
    })
  | null
> {
  try {
    const user = await getUser();
    if (!user?.teamId) {
      return null;
    }

    const team = await prisma.team.findUnique({
      where: {
        id: user.teamId,
      },
      include: {
        owner: true,
        members: true,
      },
    });

    return team;
  } catch (error) {
    console.error("Error getting current team:", error);
    throw new Error("Failed to get team");
  }
}
