"use server";

import { PostType, SocialMediaIntegration } from "@/generated/prisma";
import {
  uploadPostImages,
  uploadPostVideo,
  uploadPostVideoCover,
} from "@/lib/minio";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { PostWithRelations } from "./types";
import { postPost } from "./post-post";

export interface CreatePostParams {
  description: string;
  postType: PostType;
  images?: File[];
  video?: File | null;
  videoCover?: File | null;
  scheduledAt?: Date | null;
  socialMediaIntegrations: SocialMediaIntegration[];
}

export async function createPost({
  description,
  postType,
  images,
  video,
  videoCover,
  scheduledAt,
  socialMediaIntegrations,
}: CreatePostParams): Promise<PostWithRelations> {
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

  const post = await prisma.$transaction(async (tx) => {
    const newPost = await tx.post.create({
      data: {
        socialMediaPosts: {
          create: socialMediaIntegrations.map((integration) => ({
            socialMediaIntegrationId: integration.id,
          })),
        },
        teamId: user.teamId!,
        description,
        postType,
        scheduledAt,
      },
    });

    if (images?.length) {
      const uploadResults = await uploadPostImages(images, newPost.id);

      console.log("uploadResults", uploadResults);

      await Promise.all(
        uploadResults?.map(async (uploadResult) => {
          const { path, mimeType, size } = uploadResult;

          console.log("uploadResult", uploadResult);

          return tx.file.create({
            data: {
              path,
              mimeType,
              size,
              postId: newPost.id,
            },
          });
        })
      );

      console.log("newPost", newPost);
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

    const postWithRelations = await tx.post.findUnique({
      where: { id: newPost.id },
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

    return postWithRelations!;
  });

  if (!post.scheduledAt) {
    await postPost(post);
  }

  return post;
}
