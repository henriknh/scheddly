"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { getValidAccessToken } from "../social-media-api-functions";
import { getPresignedUrl } from "@/lib/minio";
import prisma from "@/lib/prisma";
import { pinterestApiUrl } from ".";

export async function postImage(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  let media_source;
  if (post.images.length === 1) {
    // Single image
    media_source = {
      source_type: "image_url",
      url: await getPresignedUrl(post.images[0].path),
    };
  } else if (post.images.length > 1) {
    // Multiple images
    const items = await Promise.all(
      post.images.map(async (image) => ({
        url: await getPresignedUrl(image.path),
      }))
    );
    media_source = {
      source_type: "multiple_image_urls",
      items,
      index: 0,
    };
  } else {
    throw new Error("No images provided");
  }
  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.brandId
  );
  const body = {
    link: "https://www.pinterest.com/",
    title: post.description,
    description: post.description,
    media_source,
    note: `Created with Scheddly`,
    is_removable: true,
  };
  const response = await fetch(`${pinterestApiUrl}/pins`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("Failed to post image", error);
    throw new Error("Failed to post image");
  }
  const data = await response.json();

  await prisma.socialMediaPost.update({
    where: { id: socialMediaPost.id },
    data: { socialMediaPostId: data.id, postedAt: new Date() },
  });
}
