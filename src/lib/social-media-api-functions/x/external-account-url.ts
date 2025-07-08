import { SocialMediaIntegration } from "@/generated/prisma";

export function externalAccountUrl(
  socialMediaIntegration: SocialMediaIntegration
): string {
  return `https://twitter.com/${socialMediaIntegration.accountUsername}`;
}
