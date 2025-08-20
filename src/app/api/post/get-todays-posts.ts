"use server";

import { PostType, SocialMedia } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { PostWithRelations } from "./types";

export interface GetTodaysPostsFilter {
  brandId?: string;
  postType?: PostType;
  socialMedia?: SocialMedia;
}

export async function getTodaysPosts(
  filter?: GetTodaysPostsFilter
): Promise<PostWithRelations[]> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id) {
      throw new Error("Unauthorized");
    }

    if (!user.teamId) {
      return [];
    }

    // Get today's date range (start of day to end of day)
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999
    );

    const posts = await prisma.post.findMany({
      where: {
        teamId: user.teamId,
        ...(filter?.brandId && {
          socialMediaPosts: {
            some: {
              socialMediaIntegration: {
                brandId: filter.brandId,
              },
            },
          },
        }),
        ...(filter?.postType && {
          postType: filter.postType,
        }),
        ...(filter?.socialMedia && {
          socialMediaPosts: {
            some: {
              socialMedia: filter.socialMedia,
            },
          },
        }),
        // Filter for posts scheduled today
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
        archived: false,
      },
      orderBy: [
        {
          scheduledAt: "asc",
        },
        {
          updatedAt: "asc",
        },
      ],
      include: {
        socialMediaPosts: {
          include: {
            socialMediaIntegration: {
              include: {
                brand: true,
              },
            },
          },
        },
        images: true,
        video: true,
        videoCover: true,
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching today's posts:", error);
    throw new Error("Internal Server Error");
  }
}
