"use server";

import { SocialMediaPostWithRelations } from "@/app/api/post/types";
import prisma from "@/lib/prisma";

export async function externalPostUrl(
  socialMediaPost: SocialMediaPostWithRelations
) {
  const integration = await prisma.socialMediaIntegration.findFirst({
    where: {
      socialMedia: socialMediaPost.socialMedia,
      brandId: socialMediaPost.brandId,
    },
  });
  if (!integration) throw new Error("Integration not found");

  return `https://tumblr.com/${integration.accountId}/${socialMediaPost.socialMediaPostId}`;
}
