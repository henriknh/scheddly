"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { TeamWithRelations } from "./types";
import { SubscriptionTier } from "@/generated/prisma";

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
      subscription: {
        subscriptionTier: SubscriptionTier.PRO,
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
