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
import { getFileBuffer } from "@/lib/minio";

export async function postImage(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.socialMediaIntegrationId
  );

  console.log('Posting image to X:', {
    postId: post.id,
    imageCount: post.images?.length || 0,
    description: post.description?.substring(0, 50) + '...',
  });

  if (!post.images || post.images.length === 0) {
    throw new Error("No images found in post");
  }

  // Upload images to X using v2 API
  const mediaIds: string[] = [];

  for (const image of post.images) {
    console.log('Processing image:', {
      imageId: image.id,
      mimeType: image.mimeType,
      size: image.size,
      path: image.path,
    });

    // Get the image buffer directly from MinIO
    const imageBuffer = await getFileBuffer(image.path);
    const base64Image = imageBuffer.toString("base64");

    console.log('Image downloaded from MinIO:', {
      originalSize: image.size,
      actualSize: imageBuffer.length,
      base64Length: base64Image.length,
    });

    // Step 1: Initialize media upload
    const mediaId = await initializeMediaUpload({
      accessToken,
      mediaCategory: "tweet_image",
      mediaType: image.mimeType,
      totalBytes: imageBuffer.length,
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
