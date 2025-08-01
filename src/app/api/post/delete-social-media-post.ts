"use server";

import _prisma, { PrismaTransaction } from "@/lib/prisma";
import { getSocialMediaApiFunctions } from "@/lib/social-media-api-functions/social-media-api-functions";
import { getUserFromToken } from "@/lib/user";

export interface DeleteSocialMediaPostOptions {
  prismaTx?: PrismaTransaction;
}

export async function deleteSocialMediaPost(
  socialMediaPostId: string,
  { prismaTx }: DeleteSocialMediaPostOptions = {}
) {
  const user = await getUserFromToken();

  if (!user || !user.id || !user.teamId) {
    throw new Error("Unauthorized");
  }

  const prisma = prismaTx || _prisma;

  const socialMediaPost = await prisma.socialMediaPost.findUnique({
    where: {
      id: socialMediaPostId,
      post: {
        teamId: user.teamId,
      },
    },
    include: {
      socialMediaIntegration: {
        include: {
          brand: true,
        },
      },
    },
  });

  if (!socialMediaPost) {
    throw new Error("Not found or unauthorized");
  }

  const socialMediaApiFunctions = getSocialMediaApiFunctions(
    socialMediaPost.socialMedia
  );

  if (socialMediaApiFunctions && socialMediaPost.socialMediaPostId) {
    await socialMediaApiFunctions.deletePost(socialMediaPost);
  }

  await prisma.socialMediaPost.delete({
    where: { id: socialMediaPost.id },
  });
}
