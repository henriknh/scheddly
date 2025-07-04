import { SocialMediaPostWithRelations } from "@/app/api/post/types";
export function externalPostUrl(
  socialMediaPost: SocialMediaPostWithRelations
): string {
  if (!socialMediaPost.socialMediaPostId) return "";
  return `https://www.instagram.com/p/${socialMediaPost.socialMediaPostId}`;
}
