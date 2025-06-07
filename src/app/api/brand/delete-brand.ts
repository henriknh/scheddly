"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function deleteBrand(brandId: string) {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
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

    // Use a transaction to ensure both operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // Delete all associated social media integrations first
      await tx.socialMediaIntegration.deleteMany({
        where: {
          brandId: brandId,
        },
      });

      // Then delete the brand
      await tx.brand.delete({
        where: {
          id: brandId,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
}
