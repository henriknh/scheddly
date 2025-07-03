"use server";

import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { getPost } from "./get-post";
import { getSocialMediaApiFunctions } from "@/lib/social-media-api-functions/social-media-api-functions";
import { deleteFile } from "../file/delete-file";

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
      socialMediaPosts.map(async (socialMediaPost) => {
        const socialMediaApiFunctions = getSocialMediaApiFunctions(
          socialMediaPost.socialMediaIntegration.socialMedia
        );

        if (socialMediaApiFunctions && socialMediaPost.socialMediaPostId) {
          await socialMediaApiFunctions.deletePost(post, socialMediaPost);
        }

        await tx.socialMediaPost.delete({
          where: { id: socialMediaPost.id },
        });
      })
    );

    await tx.post.delete({
      where: { id: post.id },
    });
  });
}
