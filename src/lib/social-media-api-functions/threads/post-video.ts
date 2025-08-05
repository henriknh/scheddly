"use server";

import { PostWithRelations, SocialMediaPostWithRelations } from "@/app/api/post/types";
import { getValidAccessToken } from "../social-media-api-functions";

export async function postVideo(
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

  if (!post.video) {
    throw new Error("No video found in post");
  }

  // Post video to Instagram
  const postResponse = await fetch(
    `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        access_token: accessToken,
        media_type: "VIDEO",
        video_url: post.video.path,
        caption: post.description,
        ...(post.videoCover && { cover_url: post.videoCover.path }),
      }).toString(),
    }
  );

  if (!postResponse.ok) {
    const errorText = await postResponse.text();
    throw new Error(`Failed to post video to Threads: ${errorText}`);
  }

  const postData = await postResponse.json();
  console.log("Posted video to Instagram/Threads:", postData);
}