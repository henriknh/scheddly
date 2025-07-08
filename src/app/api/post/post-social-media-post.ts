"use server";

import { PostType } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import {
  getSocialMediaApiFunctions,
  SocialMediaApiErrors,
} from "@/lib/social-media-api-functions/social-media-api-functions";
import { randomUUID } from "crypto";
import { PostWithRelations, SocialMediaPostWithRelations } from "./types";

export async function postSocialMediaPost(
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
) {
  console.info("Posting social media post", post.id);

  if (socialMediaPost.postedAt) {
    return;
  }

  const socialMediaApiFunctions = getSocialMediaApiFunctions(
    socialMediaPost.socialMedia
  );

  if (!socialMediaApiFunctions) {
    throw new Error(
      `Social media API functions not found for ${socialMediaPost.socialMedia}`
    );
  }

  try {
    if (post.postType === PostType.TEXT) {
      await socialMediaApiFunctions.postText(post, socialMediaPost);
    } else if (post.postType === PostType.IMAGE) {
      await socialMediaApiFunctions.postImage(post, socialMediaPost);
    } else if (post.postType === PostType.VIDEO) {
      await socialMediaApiFunctions.postVideo(post, socialMediaPost);
    }

    const permalink = await socialMediaApiFunctions.externalPostUrl(
      socialMediaPost
    );

    await prisma.socialMediaPost.update({
      where: { id: socialMediaPost.id },
      data: {
        failedAt: null,
        failedReason: null,
        permalink,
      },
    });
  } catch (error) {
    const errorId = randomUUID();

    console.error(`[${errorId}] Error posting post:`, error);

    let failedReason = `Unknown error (${errorId})`;
    if (error instanceof Error) {
      switch (error.message) {
        case SocialMediaApiErrors.INVALID_TOKEN:
          failedReason = SocialMediaApiErrors.INVALID_TOKEN;
          break;
      }
    }

    await prisma.socialMediaPost.update({
      where: { id: socialMediaPost.id },
      data: {
        failedAt: new Date(),
        failedReason,
      },
    });
  }
}
