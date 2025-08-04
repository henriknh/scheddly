"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "../social-media-api-functions";
import { xApiUrl } from "./index";
import {
  initializeMediaUpload,
  appendMediaData,
  finalizeMediaUpload,
  checkMediaStatus,
} from "./media-upload";

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

  // Upload images to X using v2 API
  const mediaIds: string[] = [];

  for (const image of post.images) {
    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/file/${image.id}`;

    // Download the image data
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${image.id}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(imageBuffer).toString("base64");

    // Step 1: Initialize media upload
    const mediaId = await initializeMediaUpload({
      accessToken,
      mediaCategory: "tweet_image",
      mediaType: image.mimeType,
      totalBytes: imageBuffer.byteLength,
    });

    // Step 2: Upload media data
    await appendMediaData(mediaId, accessToken, base64Image);

    // Step 3: Finalize media upload
    await finalizeMediaUpload(mediaId, accessToken);

    // Step 4: Check media upload status
    await checkMediaStatus(mediaId, accessToken);

    mediaIds.push(mediaId);
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
    throw new Error("Failed to post image to X");
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
}
