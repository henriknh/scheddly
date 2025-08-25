"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import {
  getValidAccessToken,
  SocialMediaApiErrors,
} from "../social-media-api-functions";
import { instagramGraphUrl } from ".";
import { InstagramPostType } from "@/generated/prisma";
import { getFileUrl } from "@/app/api/file/get-file-url";

// Helper function to wait for media to be ready
async function waitForMediaReady(
  mediaId: string,
  accessToken: string,
  maxAttempts = 30,
  intervalMs = 2000
): Promise<boolean> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const statusResponse = await fetch(
      `${instagramGraphUrl}/${mediaId}?fields=status_code&access_token=${accessToken}`
    );

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      if (statusData.status_code === "FINISHED") {
        return true;
      } else if (statusData.status_code === "ERROR") {
        throw new Error(SocialMediaApiErrors.MEDIA_PROCESSING_FAILED);
      }
      // Status is "IN_PROGRESS", wait and retry
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error(SocialMediaApiErrors.MEDIA_PROCESSING_TIMEOUT);
}

export async function postVideo(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.socialMediaIntegrationId
  );
  if (!post.video) throw new Error("No video found in post");
  const videoUrl = await getFileUrl(post.video.id);
  const coverUrl = post.videoCover
    ? await getFileUrl(post.videoCover.id)
    : undefined;

  // Determine the media type based on instagramPostType
  const getVideoMediaTypeParams = () => {
    const baseParams = {
      video_url: videoUrl,
      caption: post.description,
      ...(coverUrl && { cover_url: coverUrl }),
      access_token: accessToken,
    };

    switch (socialMediaPost.instagramPostType) {
      case InstagramPostType.STORY:
        return {
          ...baseParams,
          media_type: "STORIES",
        };
      case InstagramPostType.REEL:
        return {
          ...baseParams,
          media_type: "REELS",
          share_to_feed: "false",
        };
      case InstagramPostType.POST:
      default:
        return {
          ...baseParams,
          media_type: "REELS", // Instagram now requires REELS for video posts
          share_to_feed: "true",
        };
    }
  };

  // Step 1: Create media container for video
  const createMediaResponse = await fetch(
    `${instagramGraphUrl}/me/media?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(getVideoMediaTypeParams()).toString(),
    }
  );
  if (!createMediaResponse.ok) {
    const error = await createMediaResponse.json().catch(() => null);
    console.error("Failed to create Instagram video media:", error);
    throw new Error("Failed to create Instagram video media");
  }
  const mediaData = await createMediaResponse.json();
  const mediaId = mediaData.id;

  // Step 2: Wait for media to be ready (only for videos, not stories)
  await waitForMediaReady(mediaId, accessToken);

  // Step 3: Publish the video
  const publishResponse = await fetch(
    `${instagramGraphUrl}/me/media_publish?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        creation_id: mediaId,
        access_token: accessToken,
      }).toString(),
    }
  );
  if (!publishResponse.ok) {
    const error = await publishResponse.json().catch(() => null);
    console.error("Failed to publish Instagram video:", error);
    throw new Error("Failed to publish Instagram video");
  }
  const publishData = await publishResponse.json();
  await prisma.socialMediaPost.update({
    where: { id: socialMediaPost.id },
    data: { socialMediaPostId: publishData.id, postedAt: new Date() },
  });
}
