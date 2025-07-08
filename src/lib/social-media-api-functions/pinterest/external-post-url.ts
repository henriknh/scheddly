"use server";

import { SocialMediaPostWithRelations } from "@/app/api/post/types";

export async function externalPostUrl(
  socialMediaPost: SocialMediaPostWithRelations
): Promise<string> {
  if (!socialMediaPost.socialMediaPostId) return "";
  return `https://www.pinterest.com/pin/${socialMediaPost.socialMediaPostId}`;
}
