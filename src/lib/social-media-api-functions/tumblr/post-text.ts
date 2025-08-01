"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "../social-media-api-functions";
import { tumblrApiUrl } from ".";

export async function postText(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.socialMediaIntegrationId
  );

  const integration = await prisma.socialMediaIntegration.findUnique({
    where: {
      id: socialMediaPost.socialMediaIntegrationId,
    },
  });
  if (!integration) throw new Error("Integration not found");

  const response = await fetch(
    `${tumblrApiUrl}/blog/${integration.accountId}/posts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blog_identifier: integration.accountId,
        content: [
          {
            type: "text",
            text: post.description,
          },
        ],
        state: "published",
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Failed to post text to Tumblr", error);
    throw new Error("Failed to post text to Tumblr");
  }

  try {
    const data = await response.json();

    await prisma.socialMediaPost.update({
      where: {
        id: socialMediaPost.id,
      },
      data: {
        socialMediaPostId: data.response.id,
        postedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Failed to update database  ", error);
    throw new Error("Post created but failed to update database");
  }
}
