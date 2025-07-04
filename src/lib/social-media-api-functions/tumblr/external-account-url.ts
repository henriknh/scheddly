"use server";

import { SocialMediaIntegration } from "@/generated/prisma";

export const externalAccountUrl = (
  socialMediaIntegration: SocialMediaIntegration
) => {
  return `https://www.tumblr.com/blog/${socialMediaIntegration.accountId}`;
};
