"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "../social-media-api-functions";
import { tumblrApiUrl } from ".";

export async function postImage(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  if (!post.images?.length) {
    throw new Error("No images provided");
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
    // For multiple images, we'll create a photoset
    const mediaIdentifiers = await Promise.all(
      post.images.map(async (image, index) => {
        const identifier = `image-${index}`;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/file/${image.id}`
        );
        const blob = await response.blob();

        // Add the image file to formData
        formData.append(identifier, blob, `image-${index}.jpg`);

        return {
          type: "image/jpeg",
          identifier,
          width: 0, // We don't know the dimensions, Tumblr will handle this
          height: 0,
        };
      })
    );

    // Create the JSON payload
    const jsonPayload = {
      blog_identifier: integration.accountId,
      content: [
        ...mediaIdentifiers.map((mediaIdentifier) => ({
          type: "image",
          media: mediaIdentifier,
        })),
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
    console.error("Failed to post image to Tumblr", error);
    throw new Error("Failed to post image to Tumblr");
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
