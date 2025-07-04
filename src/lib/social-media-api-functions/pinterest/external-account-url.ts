import { SocialMediaIntegration } from "@/generated/prisma";
export function externalAccountUrl(
  socialMediaIntegration: SocialMediaIntegration
) {
  return `https://pinterest.com/${socialMediaIntegration.accountUsername}`;
}
