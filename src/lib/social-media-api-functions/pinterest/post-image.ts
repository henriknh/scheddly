"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { getValidAccessToken } from "../social-media-api-functions";
const pinterestApiUrl = "https://api-sandbox.pinterest.com/v5";

export async function postImage(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  if (!post.images?.length) throw new Error("No images provided");
  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMediaIntegrationId
  );
  // TODO: Replace hardcoded board_id and image URLs with real data
  const body = {
    link: "https://www.pinterest.com/",
    title: post.description,
    description: post.description,
    board_id: "1049972169315366740",
    media_source: {
      source_type: "multiple_image_urls",
      items: post.images.map(() => ({
        title: "string",
        description: "string",
        link: "string",
        url: "https://commons.wikimedia.org/wiki/File:PNG_Test.png",
      })),
      index: 0,
    },
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
  return await response.json();
}
