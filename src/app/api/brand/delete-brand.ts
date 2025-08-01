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

    await prisma.brand.delete({
      where: {
        id: brandId,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting brand:", error);
    throw error;
  }
}
