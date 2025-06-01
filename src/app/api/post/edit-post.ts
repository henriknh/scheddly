"use server";

import { getUserFromToken } from "@/lib/user";
import prisma from "@/lib/prisma";

export async function editPost(
  postId: string,
  description,
  postType,
  images,
  video,
  scheduledAt,
  socialMediaIntegrations
) {
  const user = await getUserFromToken();

  if (!user || !user.id || !user.teamId) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId, teamId: user.teamId },
  });

  if (!post) {
    throw new Error("Post not found");
  }
}
