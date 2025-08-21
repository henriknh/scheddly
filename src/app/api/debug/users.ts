"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { allowedEmails } from "./helpers";

export interface DebugUserDTO {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getDebugUsers(): Promise<DebugUserDTO[]> {
  const currentUser = await getUserFromToken();

  if (!currentUser || !allowedEmails.includes(currentUser.email || "")) {
    throw new Error("Forbidden");
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return users;
}
