"use server";

import { getUserFromToken } from "@/lib/user";
import prisma from "@/lib/prisma";
import { CreatePostParams } from "./create-post";
import { uploadImagesToMinio, uploadVideoToMinio } from "@/lib/minio";
import { getPost } from "./get-post";

export async function editPost(postId: string, data: CreatePostParams) {
  const user = await getUserFromToken();

  if (!user || !user.id || !user.teamId) {
    throw new Error("Unauthorized");
  }

  const post = await getPost(postId);

  if (!post) {
    throw new Error("Post not found");
  }

  const {
    description,
    images,
    video,
    videoCover,
    scheduledAt,
    socialMediaIntegrations,
  } = data;

  await prisma.post.update({
    where: { id: postId },
    data: {
      description,
      imageUrls: images ? await uploadImagesToMinio(images) : undefined,
      videoUrl: video ? await uploadVideoToMinio(video) : undefined,
      videoCoverUrl: videoCover
        ? await uploadVideoToMinio(videoCover)
        : undefined,
      scheduledAt,
      socialMediaPosts: {
        deleteMany: {},
        create: socialMediaIntegrations.map((integration) => ({
          socialMediaIntegrationId: integration.id,
        })),
      },
    },
  });
}
