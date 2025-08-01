"use server";

import { SocialMediaPostWithRelations } from "@/app/api/post/types";
import prisma from "@/lib/prisma";

export async function externalPostUrl(
  socialMediaPost: SocialMediaPostWithRelations
) {
  const integration = await prisma.socialMediaIntegration.findUnique({
    where: {
      id: socialMediaPost.socialMediaIntegrationId,
    },
  });
  if (!integration) throw new Error("Integration not found");

  return `https://tumblr.com/${integration.accountId}/${socialMediaPost.socialMediaPostId}`;
}
