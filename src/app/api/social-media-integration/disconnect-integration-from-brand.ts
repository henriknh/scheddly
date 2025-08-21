"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";

export async function disconnectIntegrationFromBrand(integrationId: string) {
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

    // Update the integration to disconnect it from the brand
    const updatedIntegration = await prisma.socialMediaIntegration.update({
      where: {
        id: integrationId,
      },
      data: {
        brandId: null,
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
