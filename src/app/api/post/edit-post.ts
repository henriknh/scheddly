"use server";

import { getUserFromToken } from "@/lib/user";
import prisma from "@/lib/prisma";
import { CreatePostParams } from "./create-post";

export async function editPost(postId: string, data: CreatePostParams) {
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

  throw new Error("Not implemented");
}
