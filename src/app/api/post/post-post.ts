"use server";

import { PostType } from "@/generated/prisma";
import {
  getSocialMediaApiFunctions,
  SocialMediaApiErrors,
} from "@/lib/social-media-api-functions/social-media-api-functions";
import { PostWithRelations } from "./types";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";

export async function postPost(post: PostWithRelations) {
  console.info("Posting post", post.id);

  await Promise.all(
    post.socialMediaPosts.map(async (socialMediaPost) => {
      if (socialMediaPost.postedAt) {
        return;
      }

      const socialMediaApiFunctions = getSocialMediaApiFunctions(
        socialMediaPost.socialMediaIntegration.socialMedia
      );

      if (!socialMediaApiFunctions) {
        throw new Error(
          `Social media API functions not found for ${socialMediaPost.socialMediaIntegration.socialMedia}`
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
    })
  );
}
