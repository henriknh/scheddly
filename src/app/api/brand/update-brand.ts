"use server";

import { Brand } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";

export async function updateBrand(
  brandId: string,
  name: string
): Promise<Brand> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    if (!name) {
      throw new Error("Brand name is required");
    }

    // Verify the brand belongs to the user's team
    const existingBrand = await prisma.brand.findFirst({
      where: {
        id: brandId,
        teamId: user.teamId,
      },
    });

    if (!existingBrand) {
      throw new Error("Brand not found");
    }

    const brand = await prisma.brand.update({
      where: {
        id: brandId,
      },
      data: {
        name,
      },
    });

    return brand;
  } catch (error) {
    console.error("Error updating brand:", error);
    throw error;
  }
}
