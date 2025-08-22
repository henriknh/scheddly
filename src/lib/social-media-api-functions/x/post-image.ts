"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "../social-media-api-functions";
import {
  createTweet,
  fetchBlobByFileId,
  uploadImageMedia,
} from "./media-helpers";

export async function postImage(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  if (!post.images?.length) {
    throw new Error("No images provided");
  }

  // X allows up to 4 images per post
  const images = post.images.slice(0, 4);

  const accessToken = await getValidAccessToken(
    socialMediaPost.socialMedia,
    socialMediaPost.socialMediaIntegrationId
  );

  try {
    // Load images as blobs from our file redirect endpoint
    const mediaIds: string[] = [];
    for (const image of images) {
      const { blob, mimeType } = await fetchBlobByFileId(
        image.id,
        image.mimeType || "image/jpeg"
      );

      const mediaId = await uploadImageMedia(accessToken, blob, mimeType);
      mediaIds.push(mediaId);
    }

    // Create the Tweet with attached media
    const tweetId = await createTweet(accessToken, {
      text: post.description,
      mediaIds,
      communityId: socialMediaPost.xCommunityId,
      shareWithFollowers: socialMediaPost.xShareWithFollowers,
    });

    await prisma.socialMediaPost.update({
      where: { id: socialMediaPost.id },
      data: { socialMediaPostId: tweetId, postedAt: new Date() },
    });
  } catch (error) {
    console.error("Failed to post image to X:", error);
    throw error;
  }
}
