import { SocialMediaPostWithRelations } from "@/app/api/post/types";

export function externalPostUrl(socialMediaPost: SocialMediaPostWithRelations) {
  return `https://tumblr.com/${socialMediaPost.socialMediaIntegration.accountId}/${socialMediaPost.socialMediaPostId}`;
}
