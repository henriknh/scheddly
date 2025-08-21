"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { BrandWithRelations } from "./types";

export async function getBrands(): Promise<BrandWithRelations[]> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    if (!user.teamId) {
      return [];
    }

    const brands = await prisma.brand.findMany({
      where: {
        teamId: user.teamId,
      },
      include: {
        socialMediaIntegrations: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return brands;
  } catch (error) {
    console.error("Error getting team brands:", error);
    throw new Error("Failed to get brands");
  }
}
