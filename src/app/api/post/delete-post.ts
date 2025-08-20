"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/app/api/user/get-user-from-token";
import { deleteFile } from "../file/delete-file";
import { deleteSocialMediaPost } from "./delete-social-media-post";
import { getPost } from "./get-post";

export async function deletePost(postId: string) {
  const user = await getUserFromToken();

  if (!user || !user.id || !user.teamId) {
    throw new Error("Unauthorized");
  }

  const post = await getPost(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const socialMediaPosts = post.socialMediaPosts;

  await prisma.$transaction(async (tx) => {
    const files = await tx.file.findMany({
      where: {
        postId: post.id,
      },
    });

    await Promise.all(
      files.map(async (file) => {
        await deleteFile(file.id, { prismaTx: tx });
      })
    );

    await Promise.all(
      socialMediaPosts.map(async (socialMediaPost) =>
        deleteSocialMediaPost(socialMediaPost.id, { prismaTx: tx })
      )
    );

    await tx.post.delete({
      where: { id: post.id },
    });
  });
}
