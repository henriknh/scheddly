"use server";

import prisma from "@/lib/prisma";

export async function revokeTokens(id: string): Promise<void> {
  const integration = await prisma.socialMediaIntegration.findUnique({
    where: { id },
  });

  if (!integration) {
    throw new Error("Social media integration not found");
  }

  // For Instagram/Threads, we can't programmatically revoke tokens
  // We just delete the integration from our database
  await prisma.socialMediaIntegration.delete({
    where: { id },
  });
}