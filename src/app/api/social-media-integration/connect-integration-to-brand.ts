"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function connectIntegrationToBrand(
  integrationId: string,
  brandId: string
) {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    // Verify the integration belongs to the user's team
    const integration = await prisma.socialMediaIntegration.findFirst({
      where: {
        id: integrationId,
        teamId: user.teamId,
      },
    });

    if (!integration) {
      throw new Error("Integration not found");
    }

    // Verify the brand belongs to the user's team
    const brand = await prisma.brand.findFirst({
      where: {
        id: brandId,
        teamId: user.teamId,
      },
    });

    if (!brand) {
      throw new Error("Brand not found");
    }

    // Update the integration to connect it to the brand
    const updatedIntegration = await prisma.socialMediaIntegration.update({
      where: {
        id: integrationId,
      },
      data: {
        brandId: brandId,
      },
      include: {
        brand: true,
      },
    });

    return updatedIntegration;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
