"use server";

import {
  PostType,
  SocialMediaIntegration,
  InstagramPostType,
} from "@/generated/prisma";
import {
  uploadPostImages,
  uploadPostVideo,
  uploadPostVideoCover,
} from "@/lib/minio";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { PostWithRelations } from "./types";
import { postPost } from "./post-post";

export interface SocialMediaPostParams {
  socialMediaIntegration: SocialMediaIntegration;
  xCommunityId?: string | null;
  xShareWithFollowers?: boolean;
  instagramPostType?: InstagramPostType | null;
}

export interface CreatePostParams {
  description: string;
  postType: PostType;
  images?: File[];
  video?: File | null;
  videoCover?: File | null;
  scheduledAt?: Date | null;
  socialMediaPosts?: SocialMediaPostParams[];
}

export async function createPost({
  description,
  postType,
  images,
  video,
  videoCover,
  scheduledAt,
  socialMediaPosts = [],
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
          create: socialMediaPosts.map(
            ({
              socialMediaIntegration,
              xCommunityId,
              xShareWithFollowers,
              instagramPostType,
            }) => ({
              socialMedia: socialMediaIntegration.socialMedia,
              socialMediaIntegrationId: socialMediaIntegration.id,
              xCommunityId,
              xShareWithFollowers: xShareWithFollowers ?? true,
              instagramPostType,
            })
          ),
        },
        teamId: user.teamId!,
        description,
        postType,
        scheduledAt,
      },
    });

    if (images?.length) {
      const uploadResults = await uploadPostImages(images, newPost.id);

      await Promise.all(
        uploadResults?.map(async (uploadResult) => {
          const { path, mimeType, size } = uploadResult;

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
