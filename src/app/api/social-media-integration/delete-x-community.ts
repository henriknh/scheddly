"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

/**
 * Delete an X community by its database id, ensuring it belongs to the
 * authenticated user's team via the owning integration.
 */
export async function deleteXCommunity(xCommunityId: string) {
  try {
    if (!xCommunityId) {
      throw new Error("xCommunityId is required");
    }

    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    const community = await prisma.xCommunity.findUnique({
      where: { id: xCommunityId },
      include: { socialMediaIntegration: true },
    });

    if (!community) {
      throw new Error("Community not found");
    }

    if (community.socialMediaIntegration.teamId !== user.teamId) {
      throw new Error("Forbidden");
    }

    await prisma.xCommunity.delete({
      where: { id: xCommunityId },
    });

    return { success: true } as const;
  } catch (error) {
    console.error(error);
    throw new Error("Internal Server Error");
  }
}
