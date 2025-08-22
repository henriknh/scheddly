"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "../user/get-user-from-token";

export async function getAlreadyScheduledDates(): Promise<Date[]> {
  const user = await getUserFromToken();

  if (!user) {
    throw new Error("Unauthorized");
  }

  if (!user.teamId) {
    return [];
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  now.setMinutes(0, 0, 0);
  now.setSeconds(0, 0);
  now.setMilliseconds(0);

  const posts = await prisma.post.findMany({
    where: {
      teamId: user.teamId,
      scheduledAt: {
        gte: now,
        not: null,
      },
      archived: false,
    },
    select: {
      scheduledAt: true,
    },
  });

  return posts
    .map((post) => post.scheduledAt)
    .filter((date) => date !== null) as Date[];
}
