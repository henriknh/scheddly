"use server";

import { PostWithRelations, SocialMediaPostWithRelations } from "@/app/api/post/types";
import { getValidAccessToken } from "../social-media-api-functions";

export async function postImage(
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

  // Upload images to Instagram
  const imageUrls = post.images.map(image => image.path);
  
  if (imageUrls.length === 0) {
    throw new Error("No images found in post");
  }

  // For single image
  if (imageUrls.length === 1) {
    const postResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          access_token: accessToken,
          image_url: imageUrls[0],
          caption: post.description,
        }).toString(),
      }
    );

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      throw new Error(`Failed to post image to Threads: ${errorText}`);
    }

    const postData = await postResponse.json();
    console.log("Posted image to Instagram/Threads:", postData);
  } else {
    // For multiple images, create a carousel
    const postResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}/media`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          access_token: accessToken,
          media_type: "CAROUSEL_ALBUM",
          caption: post.description,
          children: imageUrls.join(','),
        }).toString(),
      }
    );

    if (!postResponse.ok) {
      const errorText = await postResponse.text();
      throw new Error(`Failed to post carousel to Threads: ${errorText}`);
    }

    const postData = await postResponse.json();
    console.log("Posted carousel to Instagram/Threads:", postData);
  }
}