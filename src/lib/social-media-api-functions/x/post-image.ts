"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "../social-media-api-functions";

const xApiUrl = "https://api.twitter.com";

export async function postImage(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.brandId
  );

  if (!post.images || post.images.length === 0) {
    throw new Error("No images found in post");
  }

  // Upload images to X
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
    const initResponse = await fetch(`${xApiUrl}/1.1/media/upload.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        command: "INIT",
        total_bytes: imageBuffer.byteLength.toString(),
        media_type: image.mimeType,
        media_category: "tweet_image",
      }).toString(),
    });

    if (!initResponse.ok) {
      const error = await initResponse.json().catch(() => null);
      console.error("Failed to initialize media upload:", error);
      throw new Error("Failed to initialize media upload");
    }

    const initData = await initResponse.json();
    const mediaId = initData.media_id_string;

    // Step 2: Upload media data
    const appendResponse = await fetch(`${xApiUrl}/1.1/media/upload.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        command: "APPEND",
        media_id: mediaId,
        segment_index: "0",
        media_data: base64Image,
      }).toString(),
    });

    if (!appendResponse.ok) {
      const error = await appendResponse.json().catch(() => null);
      console.error("Failed to append media data:", error);
      throw new Error("Failed to append media data");
    }

    // Step 3: Finalize media upload
    const finalizeResponse = await fetch(`${xApiUrl}/1.1/media/upload.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        command: "FINALIZE",
        media_id: mediaId,
      }).toString(),
    });

    if (!finalizeResponse.ok) {
      const error = await finalizeResponse.json().catch(() => null);
      console.error("Failed to finalize media upload:", error);
      throw new Error("Failed to finalize media upload");
    }

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
