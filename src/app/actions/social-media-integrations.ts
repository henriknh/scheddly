"use server";

import { socialMediaPlatforms } from "@/lib/social-media-platforms";
import prisma from "@/lib/prisma";

export async function updateAccountInfo(integrationId: string) {
  const integration = await prisma.socialMediaIntegration.findUnique({
    where: { id: integrationId },
  });

  if (!integration) {
    throw new Error("Integration not found");
  }

  const platform = socialMediaPlatforms.find(
    (p) => p.id === integration.socialMedia
  );

  if (!platform) {
    throw new Error("Platform not found");
  }

  await platform.socialMediaApiFunctions.updateAccountInfo(integrationId);
}
