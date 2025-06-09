"use server";

import { Team } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken, UserWithRelations } from "@/lib/user";

export async function getTeamWithMembers(): Promise<
  | (Team & {
      owner: UserWithRelations;
      members: UserWithRelations[];
    })
  | null
> {
  try {
    const user = await getUserFromToken();
    if (!user?.teamId) {
      return null;
    }

    const team = await prisma.team.findUnique({
      where: {
        id: user.teamId,
      },
      include: {
        owner: {
          include: {
            avatar: true,
          },
        },
        members: {
          include: {
            avatar: true,
          },
        },
      },
    });

    return team;
  } catch (error) {
    console.error("Error getting current team:", error);
    throw new Error("Failed to get team");
  }
}
