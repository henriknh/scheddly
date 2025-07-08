"use server";

import prisma from "@/lib/prisma";
import { getPost } from "./get-post";

export async function archivePost(postId: string) {
  const post = await getPost(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  await prisma.post.update({
    where: { id: postId },
    data: { archived: true, archivedAt: new Date() },
  });
}
