"use server";

import { PostType, SocialMedia } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { PostWithRelations } from "./types";

export interface GetPostsFilter {
  status?: "scheduled" | "posted" | "failed" | "pending";
  brandId?: string;
  postType?: PostType;
  socialMedia?: SocialMedia;
}

export async function getPosts(
  filter?: GetPostsFilter
): Promise<PostWithRelations[]> {
  try {
    const user = await getUserFromToken();
    if (!user || !user.id || !user.teamId) {
      throw new Error("Unauthorized");
    }

    const posts = await prisma.post.findMany({
      where: {
        teamId: user.teamId,
        ...(filter?.brandId && {
          socialMediaPosts: {
            some: {
              socialMediaIntegration: {
                brand: {
                  id: filter.brandId,
                },
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
              socialMediaIntegration: {
                socialMedia: filter.socialMedia,
              },
            },
          },
        }),
        ...(filter?.status === "failed" && {
          failedAt: {
            not: null,
          },
        }),
        ...(filter?.status === "scheduled" && {
          scheduledAt: {
            not: null,
          },
        }),
        ...(filter?.status === "posted" && {
          postedAt: {
            not: null,
          },
        }),
        ...(filter?.status === "pending" && {
          scheduledAt: {
            lte: new Date(),
          },
        }),
      },
      orderBy: [
        {
          scheduledAt: {
            sort: "desc",
            nulls: "last",
          },
        },
        {
          createdAt: "desc",
        },
      ],
      include: {
        socialMediaPosts: {
          include: {
            socialMediaIntegration: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Internal Server Error");
  }
}
