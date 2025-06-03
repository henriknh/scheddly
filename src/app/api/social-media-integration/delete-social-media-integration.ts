"use server";

import { SocialMedia } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { pinterest } from "@/lib/social-media-api-functions/pinterest";

export async function deleteSocialMediaIntegration(
  socialMediaIntegrationId: string
) {
  try {
    if (!socialMediaIntegrationId) {
      throw new Error("SocialMediaIntegration ID is required");
    }

    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    const integration = await prisma.socialMediaIntegration.findUnique({
      where: { id: socialMediaIntegrationId, teamId: user.teamId },
    });

    if (!integration) {
      throw new Error("SocialMediaIntegration not found or unauthorized");
    }

    switch (integration.socialMedia) {
      case SocialMedia.PINTEREST:
        await pinterest.revokeTokens(socialMediaIntegrationId);
        break;
    }

    // First delete all associated social media posts
    await prisma.socialMediaPost.deleteMany({
      where: { socialMediaIntegrationId },
    });

    // Then delete the social media integration
    await prisma.socialMediaIntegration.delete({
      where: { id: socialMediaIntegrationId, teamId: user.teamId },
      include: {
        token: true,
        socialMediaIntegrationAccountInfo: true,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
