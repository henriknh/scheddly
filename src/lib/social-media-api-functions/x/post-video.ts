"use server";

import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import { getValidAccessToken } from "../social-media-api-functions";
import { xApiUrl } from "./index";
import {
  createTweet,
  fetchBlobByFileId,
  uploadVideoMedia,
} from "./media-helpers";

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

  try {
    const { blob, mimeType } = await fetchBlobByFileId(
      post.video.id,
      post.video.mimeType || "video/mp4"
    );

    const mediaId = await uploadVideoMedia(accessToken, blob, mimeType);

    const tweetId = await createTweet(accessToken, {
      text: post.description,
      mediaIds: [mediaId],
      communityId: socialMediaPost.xCommunityId,
      shareWithFollowers: socialMediaPost.xShareWithFollowers,
    });

    await prisma.socialMediaPost.update({
      where: { id: socialMediaPost.id },
      data: { socialMediaPostId: tweetId, postedAt: new Date() },
    });
  } catch (error) {
    console.error("Failed to post video to X:", error);
    throw error;
  }
}
