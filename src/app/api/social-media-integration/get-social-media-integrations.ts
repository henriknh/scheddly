"use server";

import { SocialMediaIntegrationWithRelations } from "./types";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function getSocialMediaIntegrations(): Promise<
  SocialMediaIntegrationWithRelations[]
> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    const integrations = await prisma.socialMediaIntegration.findMany({
      where: {
        teamId: user.teamId,
      },
      include: {
        brand: true,
      },
    });

    return integrations;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
