"use server";

import { SocialMedia } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";

/**
 * Add an X community to a specific social media integration.
 * - Validates auth via the cookie token
 * - Ensures the integration belongs to the user's team
 * - Ensures the integration is for X
 * - Creates the community if it does not already exist (idempotent)
 */
export async function addXCommunity(
  socialMediaIntegrationId: string,
  xCommunityName: string,
  xCommunityId: string
) {
  try {
    if (!socialMediaIntegrationId || !xCommunityId || !xCommunityName) {
      throw new Error("socialMediaIntegrationId and xCommunityId are required");
    }

    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    const integration = await prisma.socialMediaIntegration.findFirst({
      where: {
        id: socialMediaIntegrationId,
        teamId: user.teamId,
      },
    });

    if (!integration) {
      throw new Error("Integration not found");
    }

    if (integration.socialMedia !== SocialMedia.X) {
      throw new Error("Communities are only supported for X integrations");
    }

    const normalizedXId = String(xCommunityId).trim();
    if (!normalizedXId) {
      throw new Error("Invalid X community id");
    }

    const existing = await prisma.xCommunity.findFirst({
      where: {
        socialMediaIntegrationId: integration.id,
        xId: normalizedXId,
      },
    });

    if (existing) {
      return existing;
    }

    const created = await prisma.xCommunity.create({
      data: {
        xId: normalizedXId,
        name: xCommunityName,
        socialMediaIntegrationId: integration.id,
      },
    });

    return created;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
