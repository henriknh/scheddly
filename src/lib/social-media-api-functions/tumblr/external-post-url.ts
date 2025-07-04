"use server";

import { SocialMediaPostWithRelations } from "@/app/api/post/types";

export const externalPostUrl = (
  socialMediaPost: SocialMediaPostWithRelations
) => {
  return `https://tumblr.com/${socialMediaPost.socialMediaIntegration.accountId}/${socialMediaPost.socialMediaPostId}`;
};
