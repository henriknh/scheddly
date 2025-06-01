"use server";

import { Brand } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function createBrand(name: string): Promise<Brand> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    if (!name) {
      throw new Error("Brand name is required");
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        teamId: user.teamId,
      },
    });

    return brand;
  } catch (error) {
    console.error("Error creating brand:", error);
    throw error;
  }
}
