"use server";

import prisma from "@/lib/prisma";

export async function revokeTokens(id: string): Promise<void> {
  const integration = await prisma.socialMediaIntegration.findFirst({
    where: { id },
  });
  if (!integration) throw new Error("Integration not found");
  // Instagram doesn't have a direct token revocation endpoint
  // We'll just remove the tokens from our database
  await prisma.socialMediaIntegration.update({
    where: { id },
    data: { accessToken: "", refreshToken: "" },
  });
}
