import { SocialMediaIntegration } from "@/generated/prisma";

export function externalAccountUrl(
  socialMediaIntegration: SocialMediaIntegration
) {
  return `https://www.tumblr.com/blog/${socialMediaIntegration.accountId}`;
}
