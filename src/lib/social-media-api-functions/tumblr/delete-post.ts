"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { getValidAccessToken } from "../social-media-api-functions";
import { tumblrApiUrl } from ".";

export const deletePost = async (
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) => {
  if (!socialMediaPost.socialMediaPostId) {
    throw new Error("Social media post ID is required");
  }

  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMediaIntegrationId
  );

  const response = await fetch(
    `${tumblrApiUrl}/blog/${socialMediaPost.socialMediaIntegration.accountId}/post/delete`,
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
};
