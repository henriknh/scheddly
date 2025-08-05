import { SocialMediaIntegration } from "@/generated/prisma";

export function externalAccountUrl(
  socialMediaIntegration: SocialMediaIntegration
): string {
  return `https://www.threads.net/@${socialMediaIntegration.accountUsername}`;
}