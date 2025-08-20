"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { startOfDay, endOfDay, addDays } from "date-fns";

export interface PostsSummary {
  today: number;
  tomorrow: number;
}

export async function getPostsSummary(): Promise<PostsSummary> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    const today = new Date();
    const tomorrow = addDays(today, 1);

    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const tomorrowStart = startOfDay(tomorrow);
    const tomorrowEnd = endOfDay(tomorrow);

    // Get today's posts count
    const todayPosts = await prisma.post.count({
      where: {
        teamId: user.teamId,
        scheduledAt: {
          gte: todayStart,
          lte: todayEnd,
        },
        archived: false,
      },
    });

    // Get tomorrow's posts count
    const tomorrowPosts = await prisma.post.count({
      where: {
        teamId: user.teamId,
        scheduledAt: {
          gte: tomorrowStart,
          lte: tomorrowEnd,
        },
        archived: false,
      },
    });

    return {
      today: todayPosts,
      tomorrow: tomorrowPosts,
    };
  } catch (error) {
    console.error("Error fetching posts summary:", error);
    throw new Error("Internal Server Error");
  }
}
