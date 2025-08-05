"use server";

import { SocialMediaPostWithRelations } from "@/app/api/post/types";
import { getValidAccessToken } from "../social-media-api-functions";

export async function deletePost(
  socialMediaPost: SocialMediaPostWithRelations
): Promise<void> {
  if (!socialMediaPost.socialMediaPostId) {
    throw new Error("No social media post ID found");
  }

  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.socialMediaIntegrationId
  );

  // Delete from Instagram (which will also remove from Threads)
  const deleteResponse = await fetch(
    `https://graph.facebook.com/v18.0/${socialMediaPost.socialMediaPostId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        access_token: accessToken,
      }).toString(),
    }
  );

  if (!deleteResponse.ok) {
    const errorText = await deleteResponse.text();
    throw new Error(`Failed to delete post from Threads: ${errorText}`);
  }

  console.log("Deleted post from Instagram/Threads");
}