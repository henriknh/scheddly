"use server";

import prisma from "@/lib/prisma";
import { tumblrApiUrl } from ".";

export async function revokeTokens(id: string): Promise<void> {
  const integration = await prisma.socialMediaIntegration.findFirst({
    where: {
      id,
    },
  });

  if (!integration?.refreshToken) {
    throw new Error("Integration not found or missing refresh token");
  }

  const response = await fetch(`${tumblrApiUrl}/oauth/token/revoke`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify({
      token: integration.refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to revoke tokens");
  }
}
