"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "../user/get-user-from-token";
import { allowedEmails } from "./helpers";
import { TeamWithRelations } from "../team/types";

export async function getDebugTeams(): Promise<TeamWithRelations[]> {
  const currentUser = await getUserFromToken();

  if (!currentUser || !allowedEmails.includes(currentUser.email || "")) {
    throw new Error("Forbidden");
  }

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
