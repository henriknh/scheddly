"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";

export async function deletePost(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  if (!socialMediaPost.socialMediaPostId)
    throw new Error("No Instagram post ID found");
  // Instagram doesn't support deleting posts via API
  // We'll mark it as failed in our database
  await prisma.socialMediaPost.update({
    where: { id: socialMediaPost.id },
    data: {
      failedAt: new Date(),
      failedReason: "Instagram doesn't support post deletion via API",
    },
  });
}
