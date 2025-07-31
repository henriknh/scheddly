"use server";

import prisma from "@/lib/prisma";

export interface StatisticsData {
  successfulPosts: number;
  failedPosts: number;
  totalPosts: number;
  totalUsers: number;
  totalImpressions: number;
}

export async function getStatistics(): Promise<StatisticsData> {
  try {
    // Count successfully posted posts (those with postedAt not null)
    const successfulPosts = await prisma.socialMediaPost.count({
      where: {
        postedAt: {
          not: null,
        },
      },
    });

    // Count failed posts (those with failedAt not null)
    const failedPosts = await prisma.socialMediaPost.count({
      where: {
        failedAt: {
          not: null,
        },
      },
    });

    // Count total posts created
    const totalPosts = await prisma.socialMediaPost.count();

    // Count total users
    const totalUsers = await prisma.user.count();

    // Dummy data for impressions (you can replace this with real data later)
    const totalImpressions = 2500000; // 2.5M+ dummy impressions

    return {
      successfulPosts,
      failedPosts,
      totalPosts,
      totalUsers,
      totalImpressions,
    };
  } catch (error) {
    console.error("Error getting statistics:", error);
    throw new Error("Failed to get statistics");
  }
}
