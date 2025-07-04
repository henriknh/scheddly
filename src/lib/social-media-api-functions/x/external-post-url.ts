import { SocialMediaPostWithRelations } from "@/app/api/post/types";

export function externalPostUrl(
  socialMediaPost: SocialMediaPostWithRelations
): string {
  if (!socialMediaPost.socialMediaPostId) {
    return "https://twitter.com";
  }
  return `https://twitter.com/i/status/${socialMediaPost.socialMediaPostId}`;
}
