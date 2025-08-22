"use server";

import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import prisma from "@/lib/prisma";
import { cleanUserData } from "../user/helpers";
import { allowedEmails } from "./helpers";
import { CleanedUser } from "../user/types";

export async function getDebugUsers(): Promise<CleanedUser[]> {
  const currentUser = await getUserFromToken();

  if (!currentUser || !allowedEmails.includes(currentUser.email || "")) {
    throw new Error("Forbidden");
  }

  const users = await prisma.user.findMany({
    include: {
      avatar: true,
      subscription: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(users.map((user) => cleanUserData(user)));
}
