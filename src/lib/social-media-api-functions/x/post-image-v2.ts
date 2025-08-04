"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "../social-media-api-functions";
import { xApiUrl } from "./index";
import {
  uploadMedia,
  validateMediaFile,
  getMimeType,
} from "./media-upload-v2";

export async function postImage(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.socialMediaIntegrationId
  );

  if (!post.images || post.images.length === 0) {
    throw new Error("No images found in post");
  }

  // Upload images to X using improved v2 API
  const mediaIds: string[] = [];

  for (const image of post.images) {
    try {
      const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/file/${image.id}`;

      // Download the image data
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${image.id}`);
      }

      const imageBuffer = await imageResponse.arrayBuffer();
      
      // Validate the image file
      validateMediaFile(imageBuffer, image.mimeType);
      
      // Upload the image using the new media upload function
      const mediaId = await uploadMedia(imageBuffer, image.mimeType, accessToken);
      mediaIds.push(mediaId);
      
      console.log(`Successfully uploaded image ${image.id} as media ID: ${mediaId}`);
    } catch (error) {
      console.error(`Failed to upload image ${image.id}:`, error);
      throw new Error(`Failed to upload image ${image.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Create tweet with media
  const response = await fetch(`${xApiUrl}/2/tweets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: post.description,
      media: {
        media_ids: mediaIds,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to post image to X:", error);
    throw new Error(`Failed to post image to X: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const tweetId = data.data?.id;

  if (!tweetId) {
    throw new Error("No tweet ID received from X");
  }

  await prisma.socialMediaPost.update({
    where: { id: socialMediaPost.id },
    data: { socialMediaPostId: tweetId, postedAt: new Date() },
  });

  console.log(`Successfully posted image tweet with ID: ${tweetId}`);
}