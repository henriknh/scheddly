"use server";

import { SocialMedia } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import { getUserFromToken } from "@/lib/user";

export async function addSocialMediaIntegration(
  platform: SocialMedia,
  code: string,
  brandId?: string | null
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

    const { accountId, accountName, accountUsername, accountAvatarUrl } =
      await getAccountInfo();

    if (brandId) {
      const brandExists = await prisma.brand.findFirst({
        where: {
          id: brandId,
          teamId: user.teamId,
        },
      });

      if (!brandExists) {
        throw new Error("Brand not found");
      }
    }

    const existingIntegration = await prisma.socialMediaIntegration.findFirst({
      where: {
        AND: {
          accountId,
          socialMedia: platform,
          teamId: user.teamId,
        },
      },
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
          socialMedia: platform,
          accessToken,
          accessTokenExpiresAt,
          refreshToken,
          refreshTokenExpiresAt,
          accountId,
          accountName,
          accountUsername,
          accountAvatarUrl,
          teamId: user.teamId,
          brandId: brandId || null,
        },
      });

      return integration;
    }
  } catch (error) {
    console.log(error);
    throw new Error("Internal Server Error");
  }
}
