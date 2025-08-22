"use server";

import prisma from "@/lib/prisma";
import { TeamWithRelations } from "../team/types";
import { assertDebugUser } from "./helpers";

export async function getDebugTeam(
  teamId: string
): Promise<TeamWithRelations | null> {
  if (!teamId) {
    throw new Error("Team ID is required");
  }

  await assertDebugUser();

  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
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
      invitations: {
        include: {
          team: true,
          invitedUser: true,
        },
      },
    },
  });

  return team;
}
