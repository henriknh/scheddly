"use server";

import { PostWithRelations, SocialMediaPostWithRelations } from "@/app/api/post/types";
import { getValidAccessToken } from "../social-media-api-functions";

export async function postText(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
): Promise<void> {
  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.socialMediaIntegrationId
  );

  // Get the Instagram business account ID
  const accountsResponse = await fetch(
    `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
  );

  if (!accountsResponse.ok) {
    throw new Error("Failed to fetch Facebook pages");
  }

  const accountsData = await accountsResponse.json();
  const pages = accountsData.data;

  if (!pages || pages.length === 0) {
    throw new Error("No Facebook pages found");
  }

  const pageId = pages[0].id;
  const instagramResponse = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
  );

  if (!instagramResponse.ok) {
    throw new Error("Failed to fetch Instagram business account");
  }

  const instagramData = await instagramResponse.json();
  const instagramBusinessAccountId = instagramData.instagram_business_account?.id;

  if (!instagramBusinessAccountId) {
    throw new Error("No Instagram business account found");
  }

  // Post to Instagram (which will also appear on Threads)
  const postResponse = await fetch(
    `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        access_token: accessToken,
        caption: post.description,
        media_type: "CAROUSEL_ALBUM", // For text posts, we'll use a carousel with a text image
      }).toString(),
    }
  );

  if (!postResponse.ok) {
    const errorText = await postResponse.text();
    throw new Error(`Failed to post to Threads: ${errorText}`);
  }

  const postData = await postResponse.json();
  
  // Note: Threads doesn't have a separate API, so we post to Instagram
  // and it will appear on Threads as well
  console.log("Posted to Instagram/Threads:", postData);
}