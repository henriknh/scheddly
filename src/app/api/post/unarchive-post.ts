"use server";

import prisma from "@/lib/prisma";
import { getPost } from "./get-post";
import { canUnarchivePost } from "@/lib/post";

export async function unarchivePost(postId: string) {
  const post = await getPost(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  if (!post.archived) {
    throw new Error("Post is not archived");
  }

  if (!canUnarchivePost(post)) {
    throw new Error("Post is too old to unarchive");
  }

  await prisma.post.update({
    where: { id: postId },
    data: { archived: false, archivedAt: null },
  });
}
