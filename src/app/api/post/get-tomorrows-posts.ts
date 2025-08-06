"use server";

import { PostType, SocialMedia } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { PostWithRelations } from "./types";

export interface GetTomorrowsPostsFilter {
  brandId?: string;
  postType?: PostType;
  socialMedia?: SocialMedia;
}

export async function getTomorrowsPosts(
  filter?: GetTomorrowsPostsFilter
): Promise<PostWithRelations[]> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    // Get tomorrow's date range (start of day to end of day)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfDay = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    const endOfDay = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 23, 59, 59, 999);

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
        // Filter for posts scheduled tomorrow
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
    console.error("Error fetching tomorrow's posts:", error);
    throw new Error("Internal Server Error");
  }
}