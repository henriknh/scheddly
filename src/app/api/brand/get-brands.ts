"use server";

import { Brand } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function getBrands(): Promise<Brand[]> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    const brands = await prisma.brand.findMany({
      where: {
        teamId: user.teamId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return brands;
  } catch (error) {
    console.error("Error getting team brands:", error);
    throw new Error("Failed to get brands");
  }
}
