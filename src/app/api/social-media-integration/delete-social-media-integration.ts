"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

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

    // switch (integration.socialMedia) {
    //   case SocialMedia.PINTEREST:
    //     await pinterest.revokeTokens(socialMediaIntegrationId);
    //   case SocialMedia.TUMBLR:
    //     await tumblr.revokeTokens(socialMediaIntegrationId);
    //     break;
    //   case SocialMedia.X:
    //     await x.revokeTokens(socialMediaIntegrationId);
    //     break;
    //   case SocialMedia.INSTAGRAM:
    //     await instagram.revokeTokens(socialMediaIntegrationId);
    //     break;
    //   default:
    //     throw new Error(
    //       `Social media ${integration.socialMedia} not supported`
    //     );
    // }

    // Then delete the social media integration
    await prisma.socialMediaIntegration.delete({
      where: { id: socialMediaIntegrationId, teamId: user.teamId },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
