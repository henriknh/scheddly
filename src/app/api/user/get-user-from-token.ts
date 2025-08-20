"use server";

import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { cleanUserData } from "./helpers";
import { CleanedUser } from "./types";

export const getUserFromToken = async (): Promise<CleanedUser | null> => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || !payload.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id as string },
    include: {
      avatar: true,
      team: true,
      teams: true,
    },
  });

  if (!user) {
    return null;
  }

  return cleanUserData(user);
};
