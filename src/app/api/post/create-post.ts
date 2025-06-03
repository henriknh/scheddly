"use server";

import { PostType, SocialMediaIntegration } from "@/generated/prisma";
import {
  uploadImagesToMinio,
  uploadImageToMinio,
  uploadVideoToMinio,
} from "@/lib/minio";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

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
}: CreatePostParams) {
  const user = await getUserFromToken();

  if (!user || !user.id || !user.teamId) {
    throw new Error("Unauthorized");
  }

  const imageUrls = await uploadImagesToMinio(images);

  if (postType === PostType.IMAGE && !imageUrls.length) {
    throw new Error("Images are required for image posts");
  }

  const videoCoverUrl = await uploadImageToMinio(videoCover);
  if (postType === PostType.VIDEO && !videoCoverUrl) {
    throw new Error("Video is required for video posts");
  }

  const videoUrl = await uploadVideoToMinio(video);
  if (postType === PostType.VIDEO && !videoUrl) {
    throw new Error("Video is required for video posts");
  }

  const newPost = await prisma.post.create({
    data: {
      socialMediaPosts: {
        create: socialMediaIntegrations.map((integration) => ({
          socialMediaIntegrationId: integration.id,
        })),
      },
      teamId: user.teamId,
      description,
      postType,
      imageUrls,
      videoUrl,
      videoCoverUrl,
      scheduledAt,
    },
  });

  return newPost;
}
