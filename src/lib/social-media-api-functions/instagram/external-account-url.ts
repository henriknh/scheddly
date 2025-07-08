import { SocialMediaIntegration } from "@/generated/prisma";

export function externalAccountUrl(
  socialMediaIntegration: SocialMediaIntegration
): string {
  return `https://www.instagram.com/${
    socialMediaIntegration.accountUsername || socialMediaIntegration.accountName
  }`;
}
