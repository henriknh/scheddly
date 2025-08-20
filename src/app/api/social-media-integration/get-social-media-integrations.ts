"use server";

import { SocialMediaIntegrationWithRelations } from "./types";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";

export async function getSocialMediaIntegrations(): Promise<
  SocialMediaIntegrationWithRelations[]
> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    if (!user.teamId) {
      return [];
    }

    const integrations = await prisma.socialMediaIntegration.findMany({
      where: {
        teamId: user.teamId,
      },
      include: {
        brand: true,
        xCommunities: true,
      },
      orderBy: {
        socialMedia: "asc",
      },
    });

    return integrations;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
