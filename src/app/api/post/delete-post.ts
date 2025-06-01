"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { postIsEditable } from "@/lib/post-is-editable";

export async function deletePost(postId: string) {
  const user = await getUserFromToken();

  if (!user || !user.id || !user.teamId) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId, teamId: user.teamId },
    include: {
      socialMediaPosts: true,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const canEditPost = postIsEditable(post);
  if (!canEditPost) {
    throw new Error("Post is not editable");
  }

  // Use a transaction to ensure atomic operations
  await prisma.$transaction(async (tx) => {
    // First delete all related social media posts
    await tx.socialMediaPost.deleteMany({
      where: { postId: post.id },
    });

    // Then delete the main post
    await tx.post.delete({
      where: { id: post.id },
    });
  });
}
