"use server";

import {
  Brand,
  SocialMedia,
  SocialMediaIntegration,
  SocialMediaIntegrationAccountInfo,
} from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { pinterest } from "@/lib/social-media-api-functions/pinterest";
import { getUserFromToken } from "@/lib/user";

export async function getSocialMediaIntegrations(): Promise<
  (SocialMediaIntegration & {
    brand?: Brand | null;
    socialMediaIntegrationAccountInfo?: SocialMediaIntegrationAccountInfo | null;
  })[]
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
        socialMediaIntegrationAccountInfo: true,
      },
    });

    return integrations;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}

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

    const integration = await prisma.socialMediaIntegration.create({
      data: {
        socialMedia: platform,
        team: {
          connect: {
            id: user.teamId,
          },
        },
        token: {
          create: {
            accessToken,
            accessTokenExpiresAt,
            refreshToken,
            refreshTokenExpiresAt,
          },
        },
        socialMediaIntegrationAccountInfo: {
          create: {
            accountId,
            name,
            avatarUrl,
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
