"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "../social-media-api-functions";

const xApiUrl = "https://api.twitter.com";

export async function deletePost(
  socialMediaPost: SocialMediaPostWithRelations
) {
  if (!socialMediaPost.socialMediaPostId) {
    throw new Error("No X post ID found");
  }

  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.brandId
  );

  const response = await fetch(
    `${xApiUrl}/2/tweets/${socialMediaPost.socialMediaPostId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to delete X post:", error);
    throw new Error("Failed to delete X post");
  }

  // Update the social media post to mark it as deleted
  await prisma.socialMediaPost.update({
    where: { id: socialMediaPost.id },
    data: {
      socialMediaPostId: null,
      failedAt: new Date(),
      failedReason: "Post deleted",
    },
  });
}
