"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "../social-media-api-functions";
import { instagramGraphUrl } from ".";

export async function postVideo(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.socialMediaIntegrationId
  );
  if (!post.video) throw new Error("No video found in post");
  const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/file/${post.video.id}`;
  const coverUrl = post.videoCover
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/file/${post.videoCover.id}`
    : undefined;
  // Step 1: Create media container for video
  const createMediaResponse = await fetch(
    `${instagramGraphUrl}/me/media?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        media_type: "VIDEO",
        video_url: videoUrl,
        caption: post.description,
        ...(coverUrl && { cover_url: coverUrl }),
        access_token: accessToken,
      }).toString(),
    }
  );
  if (!createMediaResponse.ok) {
    const error = await createMediaResponse.json().catch(() => null);
    console.error("Failed to create Instagram video media:", error);
    throw new Error("Failed to create Instagram video media");
  }
  const mediaData = await createMediaResponse.json();
  const mediaId = mediaData.id;
  // Step 2: Publish the video
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
