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
  finalizeMediaUpload,
  checkMediaStatus,
  uploadMediaInChunks,
} from "./media-upload";

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
  const videoSize = videoBuffer.byteLength;

  // Step 1: Initialize media upload
  const mediaId = await initializeMediaUpload({
    accessToken,
    mediaCategory: "tweet_video",
    mediaType: post.video.mimeType,
    totalBytes: videoSize,
  });

  // Step 2: Upload video data in chunks
  await uploadMediaInChunks(mediaId, accessToken, videoBuffer);

  // Step 3: Finalize media upload
  await finalizeMediaUpload(mediaId, accessToken);

  // Step 4: Wait for video processing with proper status checking
  await checkMediaStatus(mediaId, accessToken);

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
