"use server";

import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import prisma from "@/lib/prisma";
import { TeamWithRelations } from "./types";

export async function getTeams(): Promise<TeamWithRelations[]> {
  const user = await getUserFromToken();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const teams = await prisma.team.findMany({
    where: {
      members: {
        some: {
          id: user.id,
        },
      },
    },
    include: {
      owner: true,
      members: {
        include: {
          avatar: true,
        },
      },
      invitations: {
        include: {
          team: true,
          invitedUser: {
            include: {
              avatar: true,
            },
          },
        },
      },
    },
  });

  return teams;
}
