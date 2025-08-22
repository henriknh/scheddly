"use server";

import prisma from "@/lib/prisma";
import { cleanUserData } from "../user/helpers";
import { CleanedUser } from "../user/types";
import { assertDebugUser } from "./helpers";

export async function getDebugUsers(): Promise<CleanedUser[]> {
  await assertDebugUser();

  const users = await prisma.user.findMany({
    include: {
      avatar: true,
      subscription: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return Promise.all(users.map((user) => cleanUserData(user)));
}
