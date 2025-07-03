"use server";

import { PostType } from "@/generated/prisma";
import {
  uploadPostImages,
  uploadPostVideo,
  uploadPostVideoCover,
} from "@/lib/minio";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { CreatePostParams } from "./create-post";
import { getPost } from "./get-post";
import { deleteFile } from "../file/delete-file";

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
      await Promise.all(
        newPost.images.map(async (image) => {
          await deleteFile(image.id);
        })
      );
    }

    if (newPost.videoCover) {
      await deleteFile(newPost.videoCover.id);
    }

    if (newPost.video) {
      await deleteFile(newPost.video.id);
    }

    if (images?.length) {
      const uploadResults = await uploadPostImages(images, newPost.id);

      await Promise.all(
        uploadResults?.map(async (uploadResult) => {
          const { path, mimeType, size } = uploadResult;

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
