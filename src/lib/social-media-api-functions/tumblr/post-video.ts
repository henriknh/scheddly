"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { tumblrApiUrl } from ".";
import { getValidAccessToken } from "../social-media-api-functions";

export async function postVideo(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  if (!post.video) {
    throw new Error("No video provided");
  }

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

  // Create a FormData object for multipart/form-data
  const formData = new FormData();

  try {
    // Get the video data
    const videoResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/file/${post.video.id}`
    );
    const videoBlob = await videoResponse.blob();

    // Add the video file to formData
    const videoIdentifier = "video-0";
    formData.append(videoIdentifier, videoBlob, "video.mp4");

    // Create the JSON payload
    const jsonPayload = {
      blog_identifier: integration.accountId,
      content: [
        {
          type: "video",
          media: {
            type: "video/mp4",
            identifier: videoIdentifier,
            width: 0, // We don't know the dimensions, Tumblr will handle this
            height: 0,
          },
        },
        {
          type: "text",
          text: post.description,
        },
      ],
      state: "published",
    };

    // Add the JSON payload to formData
    formData.append("json", JSON.stringify(jsonPayload));
  } catch (error) {
    console.error("Failed to create form data", error);
    throw new Error("Failed to create form data");
  }

  const response = await fetch(
    `${tumblrApiUrl}/blog/${integration.accountId}/posts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Failed to post video to Tumblr", error);
    throw new Error("Failed to post video to Tumblr");
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
