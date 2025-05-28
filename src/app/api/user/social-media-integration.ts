"use server";

import { Brand, SocialMedia, SocialMediaIntegration } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function getSocialMediaIntegrations(): Promise<
  (SocialMediaIntegration & {
    brand?: Brand | null;
  })[]
> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    const integrations = await prisma.socialMediaIntegration.findMany({
      where: {
        createdById: user.id,
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

export async function deleteSocialMediaIntegration(
  socialMediaIntegrationId: string
) {
  try {
    if (!socialMediaIntegrationId) {
      throw new Error("SocialMediaIntegration ID is required");
    }

    const user = await getUserFromToken();
    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    await prisma.socialMediaIntegration.delete({
      where: { id: socialMediaIntegrationId, createdById: user.id },
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
    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    const integration = await prisma.socialMediaIntegration.create({
      data: {
        socialMedia: platform,
        code,
        createdById: user.id,
      },
    });

    return integration;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
