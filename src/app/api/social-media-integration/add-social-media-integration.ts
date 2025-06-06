"use server";

import { SocialMedia } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { pinterest } from "@/lib/social-media-api-functions/pinterest";

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
      switch (platform) {
        case SocialMedia.PINTEREST:
          return pinterest.consumeAuthorizationCode(code);
      }

      throw new Error("Invalid platform");
    };

    const {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    } = await getTokens();

    const getAccountInfo = async () => {
      switch (platform) {
        case SocialMedia.PINTEREST:
          return pinterest.fetchAccountInfoByAccessToken(accessToken);
      }
      throw new Error("Invalid platform");
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

    const integration = await prisma.socialMediaIntegration.upsert({
      where: {
        id: existingIntegration?.id,
        accountId,
        socialMedia: platform,
        teamId: user.teamId,
      },
      update: {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
      },
      create: {
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
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
