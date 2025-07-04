import { SocialMediaIntegration } from "@/generated/prisma";
export function externalAccountUrl(
  socialMediaIntegration: SocialMediaIntegration
) {
  return `https://www.instagram.com/${
    socialMediaIntegration.accountUsername || socialMediaIntegration.accountName
  }`;
}
