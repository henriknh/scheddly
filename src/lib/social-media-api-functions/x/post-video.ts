"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "../social-media-api-functions";
import { xApiUrl } from "./index";

export async function postVideo(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.socialMediaIntegrationId
  );

  if (!post.video) {
    throw new Error("No video found in post");
  }

  const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/file/${post.video.id}`;

  // Download the video data
  const videoResponse = await fetch(videoUrl);
  if (!videoResponse.ok) {
    throw new Error(`Failed to fetch video: ${post.video.id}`);
  }

  const videoBuffer = await videoResponse.arrayBuffer();
  const base64Video = Buffer.from(videoBuffer).toString("base64");

  // Step 1: Initialize media upload using v2 API
  const initResponse = await fetch(`${xApiUrl}/2/media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_category: "tweet_video",
      media_type: post.video.mimeType,
      total_bytes: videoBuffer.byteLength,
    }),
  });

  if (!initResponse.ok) {
    const error = await initResponse.json().catch(() => null);
    console.error("Failed to initialize video upload:", error);
    throw new Error("Failed to initialize video upload");
  }

  const initData = await initResponse.json();
  const mediaId = initData.media_id_string;

  // Step 2: Upload video data in chunks
  const chunkSize = 1024 * 1024; // 1MB chunks
  const totalChunks = Math.ceil(videoBuffer.byteLength / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, videoBuffer.byteLength);
    const chunk = videoBuffer.slice(start, end);
    const base64Chunk = Buffer.from(chunk).toString("base64");

    const appendResponse = await fetch(`${xApiUrl}/2/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_id: mediaId,
        segment_index: i,
        media_data: base64Chunk,
      }),
    });

    if (!appendResponse.ok) {
      const error = await appendResponse.json().catch(() => null);
      console.error("Failed to append video chunk:", error);
      throw new Error("Failed to append video chunk");
    }
  }

  // Step 3: Finalize media upload
  const finalizeResponse = await fetch(`${xApiUrl}/2/media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      media_id: mediaId,
    }),
  });

  if (!finalizeResponse.ok) {
    const error = await finalizeResponse.json().catch(() => null);
    console.error("Failed to finalize video upload:", error);
    throw new Error("Failed to finalize video upload");
  }

  // Step 4: Wait for video processing
  let processingComplete = false;
  let attempts = 0;
  const maxAttempts = 30; // Wait up to 5 minutes (30 * 10 seconds)

  while (!processingComplete && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds

    const statusResponse = await fetch(`${xApiUrl}/2/media`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        media_id: mediaId,
      }),
    });

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      if (statusData.processing_info?.state === "succeeded") {
        processingComplete = true;
      } else if (statusData.processing_info?.state === "failed") {
        throw new Error("Video processing failed");
      }
    }

    attempts++;
  }

  if (!processingComplete) {
    throw new Error("Video processing timeout");
  }

  // Create tweet with video
  const response = await fetch(`${xApiUrl}/2/tweets`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: post.description,
      media: {
        media_ids: [mediaId],
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to post video to X:", error);
    throw new Error("Failed to post video to X");
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
