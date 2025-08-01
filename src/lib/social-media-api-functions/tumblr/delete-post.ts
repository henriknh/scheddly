"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { getValidAccessToken } from "../social-media-api-functions";
import { tumblrApiUrl } from ".";
import prisma from "@/lib/prisma";

export async function deletePost(
  socialMediaPost: SocialMediaPostWithRelations
) {
  if (!socialMediaPost.socialMediaPostId) {
    throw new Error("Social media post ID is required");
  }

  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.socialMediaIntegrationId
  );

  const integration = await prisma.socialMediaIntegration.findUnique({
    where: {
      id: socialMediaPost.socialMediaIntegrationId,
    },
  });
  if (!integration) throw new Error("Integration not found");

  const response = await fetch(
    `${tumblrApiUrl}/blog/${integration.accountId}/post/delete`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        id: socialMediaPost.socialMediaPostId,
      }).toString(),
    }
  );

  if (!response.ok) {
    const data = await response.json();
    if (data.meta.status === 404) {
      console.error("Post not found, skipping delete");
    } else {
      console.error("Failed to delete post from Tumblr", data);
      throw new Error("Failed to delete post from Tumblr");
    }
  }
}
