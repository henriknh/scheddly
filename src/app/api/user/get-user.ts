"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "./get-user-from-token";
import { updateUserTokenWithCleanedUser } from "./helpers";
import { CleanedUser } from "./types";

export async function getUser(): Promise<CleanedUser | null> {
  const payload = await getUserFromToken();
  if (!payload || !payload.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id as string,
    },
    include: {
      avatar: true,
      team: true,
      teams: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  const cleanedUser = await updateUserTokenWithCleanedUser(user);

  return cleanedUser;
}
