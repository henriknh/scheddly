"use server";

import { SocialMedia } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { getUserFromToken } from "@/lib/user";

export async function addSocialMediaIntegration(
  platform: SocialMedia,
  code: string
) {
  try {
    if (!platform || !code) {
      throw new Error("Platform and code are required");
    }

    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    const getTokens = async () => {
      const socialMediaPlatform = socialMediaPlatforms.find(
        (p) => p.id === platform
      );

      if (!socialMediaPlatform) {
        throw new Error("Invalid platform");
      }

      if (
        typeof socialMediaPlatform.socialMediaApiFunctions
          .consumeAuthorizationCode !== "function"
      ) {
        throw new Error(
          "Platform does not have consumeAuthorizationCode function"
        );
      }

      return socialMediaPlatform.socialMediaApiFunctions.consumeAuthorizationCode(
        code
      );
    };

    const {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    } = await getTokens();

    const getAccountInfo = async () => {
      const socialMediaPlatform = socialMediaPlatforms.find(
        (p) => p.id === platform
      );

      if (!socialMediaPlatform) {
        throw new Error("Invalid platform");
      }

      if (
        typeof socialMediaPlatform.socialMediaApiFunctions
          .fetchAccountInfoByAccessToken !== "function"
      ) {
        throw new Error(
          "Platform does not have fetchAccountInfoByAccessToken function"
        );
      }

      return socialMediaPlatform.socialMediaApiFunctions.fetchAccountInfoByAccessToken(
        accessToken
      );
    };

    const { accountId, name, avatarUrl } = await getAccountInfo();

    const existingIntegration = await prisma.socialMediaIntegration.findFirst({
      where: {
        AND: {
          accountId,
          socialMedia: platform,
          teamId: user.teamId,
        },
      },
    });

    console.log("existingIntegration", existingIntegration);

    console.log("data", {
      id: existingIntegration?.id,
      accountId,
      socialMedia: platform,
      teamId: user.teamId,
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    });

    if (existingIntegration) {
      await prisma.socialMediaIntegration.update({
        where: {
          id: existingIntegration.id,
        },
        data: {
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt,
        },
      });

      return existingIntegration;
    } else {
      const integration = await prisma.socialMediaIntegration.create({
        data: {
          accountId,
          name,
          avatarUrl,
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt,
          socialMedia: platform,
          team: {
            connect: {
              id: user.teamId,
            },
          },
        },
      });

      return integration;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
