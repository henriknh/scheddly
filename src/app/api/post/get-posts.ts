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
  dateFrom?: string;
  dateTo?: string;
  archived?: boolean;
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
              brandId: filter.brandId,
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
        ...(filter?.status === "scheduled" && {
          AND: [
            {
              scheduledAt: {
                not: null,
              },
            },
            {
              socialMediaPosts: {
                none: {
                  failedAt: {
                    not: null,
                  },
                  postedAt: {
                    not: null,
                  },
                },
              },
            },
          ],
        }),
        ...(filter?.status === "failed" && {
          socialMediaPosts: {
            some: {
              failedAt: {
                not: null,
              },
            },
          },
        }),
        ...(filter?.status === "posted" && {
          socialMediaPosts: {
            some: {
              postedAt: {
                not: null,
              },
            },
          },
        }),
        ...(filter?.status === "pending" && {
          AND: [
            {
              scheduledAt: {
                lte: new Date(),
              },
            },
            {
              socialMediaPosts: {
                none: {
                  failedAt: {
                    not: null,
                  },
                  postedAt: {
                    not: null,
                  },
                },
              },
            },
          ],
        }),
        ...(filter?.dateFrom &&
          filter?.dateTo && {
            OR: [
              {
                scheduledAt: {
                  gte: new Date(filter.dateFrom),
                  lt: new Date(filter.dateTo),
                  not: null,
                },
              },
              {
                updatedAt: {
                  gte: new Date(filter.dateFrom),
                  lt: new Date(filter.dateTo),
                },
              },
            ],
          }),
        ...(filter?.archived
          ? { archived: true }
          : { OR: [{ archived: false }, { archived: null }] }),
      },
      orderBy: [
        {
          scheduledAt: {
            sort: "asc",
            nulls: "last",
          },
        },
        {
          createdAt: "asc",
        },
      ],
      include: {
        socialMediaPosts: {
          include: {
            brand: true,
          },
        },
        images: true,
        video: true,
        videoCover: true,
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Internal Server Error");
  }
}
