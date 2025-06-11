"use server";

import { PostType } from "@/generated/prisma";
import {
  uploadPostImage,
  uploadPostVideo,
  uploadPostVideoCover,
} from "@/lib/minio";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { CreatePostParams } from "./create-post";
import { getPost } from "./get-post";

export async function editPost(
  postId: string,
  {
    description,
    postType,
    images,
    video,
    videoCover,
    scheduledAt,
    socialMediaIntegrations,
  }: CreatePostParams
): Promise<void> {
  const user = await getUserFromToken();

  if (!user || !user.id || !user.teamId) {
    throw new Error("Unauthorized");
  }

  if (postType === PostType.IMAGE && !images?.length) {
    throw new Error("Images are required for image posts");
  }

  if (postType === PostType.VIDEO && !videoCover) {
    throw new Error("Video is required for video posts");
  }

  if (postType === PostType.VIDEO && !video) {
    throw new Error("Video is required for video posts");
  }

  const post = await getPost(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  await prisma.file.deleteMany({
    where: {
      postVideo: {
        id: postId,
      },
      postVideoCover: {
        id: postId,
      },
      postImages: {
        id: postId,
      },
    },
  });

  await prisma.$transaction(async (tx) => {
    const newPost = await tx.post.update({
      where: { id: postId },
      data: {
        description,
        scheduledAt,
        socialMediaPosts: {
          deleteMany: {},
          create: socialMediaIntegrations.map((integration) => ({
            socialMediaIntegrationId: integration.id,
          })),
        },
      },
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

    if (newPost.images) {
      await tx.file.deleteMany({
        where: {
          postImages: { id: newPost.id },
        },
      });
    }

    if (newPost.videoCover) {
      await tx.file.deleteMany({
        where: {
          postVideoCover: { id: newPost.id },
        },
      });
    }

    if (newPost.video) {
      await tx.file.deleteMany({
        where: {
          postVideo: { id: newPost.id },
        },
      });
    }

    if (images?.length) {
      await Promise.all(
        images?.map(async (image) => {
          const { path, mimeType, size } = await uploadPostImage(
            image,
            newPost.id
          );

          return await tx.file.create({
            data: {
              path,
              mimeType,
              size,
              postId: newPost.id,
            },
          });
        })
      );
    }

    if (videoCover && video) {
      const handleVideoCover = async () => {
        const { path, mimeType, size } = await uploadPostVideoCover(
          videoCover,
          newPost.id
        );

        return await tx.file.create({
          data: {
            path,
            mimeType,
            size,
            postVideoCover: {
              connect: {
                id: newPost.id,
              },
            },
          },
        });
      };

      const handleVideo = async () => {
        const { path, mimeType, size } = await uploadPostVideo(
          video,
          newPost.id
        );

        return await tx.file.create({
          data: {
            path,
            mimeType,
            size,
            postVideo: {
              connect: {
                id: newPost.id,
              },
            },
          },
        });
      };

      await Promise.all([handleVideoCover(), handleVideo()]);
    }
  });
}
