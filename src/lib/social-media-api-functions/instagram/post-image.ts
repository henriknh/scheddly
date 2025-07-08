"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "../social-media-api-functions";
import { instagramGraphUrl } from ".";

export async function postImage(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.brandId
  );
  if (!post.images || post.images.length === 0)
    throw new Error("No images found in post");
  const image = post.images[0];
  const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/file/${image.id}`;
  // Step 1: Create media container
  const createMediaResponse = await fetch(
    `${instagramGraphUrl}/me/media?access_token=${accessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        image_url: imageUrl,
        caption: post.description,
        access_token: accessToken,
      }).toString(),
    }
  );
  if (!createMediaResponse.ok) {
    const error = await createMediaResponse.json().catch(() => null);
    console.error("Failed to create Instagram media:", error);
    throw new Error("Failed to create Instagram media");
  }
  const mediaData = await createMediaResponse.json();
  const mediaId = mediaData.id;
  // Step 2: Publish the media
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
    console.error("Failed to publish Instagram media:", error);
    throw new Error("Failed to publish Instagram media");
  }
  const publishData = await publishResponse.json();
  await prisma.socialMediaPost.update({
    where: { id: socialMediaPost.id },
    data: { socialMediaPostId: publishData.id, postedAt: new Date() },
  });
}
