"use server";

import { SocialMediaPostWithRelations } from "@/app/api/post/types";
import { getValidAccessToken } from "../social-media-api-functions";
import { pinterestApiUrl } from ".";

export async function deletePost(
  socialMediaPost: SocialMediaPostWithRelations
) {
  if (!socialMediaPost.socialMediaPostId) {
    throw new Error("Missing Pinterest post ID (socialMediaPostId)");
  }

  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.socialMediaIntegrationId
  );

  try {
    const response = await fetch(
      `${pinterestApiUrl}/pins/${socialMediaPost.socialMediaPostId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      console.error("Failed to delete Pinterest post", error);
      throw new Error("Failed to delete Pinterest post");
    }
  } catch (err) {
    console.error("Pinterest deletePost error", err);
    throw err;
  }
}
