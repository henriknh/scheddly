import { SocialMediaIntegration } from "@/generated/prisma";

export function externalAccountUrl(
  socialMediaIntegration: SocialMediaIntegration
): string {
  const username = socialMediaIntegration.accountUsername;
  if (!username) {
    return "https://twitter.com";
  }
  return `https://twitter.com/${username}`;
}
