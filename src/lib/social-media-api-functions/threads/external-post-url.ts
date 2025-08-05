"use server";

import { SocialMediaPostWithRelations } from "@/app/api/post/types";

export async function externalPostUrl(
  socialMediaPost: SocialMediaPostWithRelations
): Promise<string> {
  if (!socialMediaPost.socialMediaPostId) {
    throw new Error("No social media post ID found");
  }

  // Since Threads doesn't have a separate API, we'll return the Instagram post URL
  // which will also be accessible on Threads
  return `https://www.instagram.com/p/${socialMediaPost.socialMediaPostId}/`;
}