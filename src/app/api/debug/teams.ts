"use server";

import prisma from "@/lib/prisma";
import { assertDebugUser } from "./helpers";
import { TeamWithRelations } from "../team/types";

export async function getDebugTeams(): Promise<TeamWithRelations[]> {
  await assertDebugUser();

  const teams = await prisma.team.findMany({
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

  return teams;
}
