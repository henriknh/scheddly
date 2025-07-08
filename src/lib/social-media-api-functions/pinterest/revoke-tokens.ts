"use server";

import prisma from "@/lib/prisma";
import { pinterestApiUrl } from ".";

export async function revokeTokens(id: string): Promise<void> {
  const integration = await prisma.socialMediaIntegration.findFirst({
    where: { id },
  });
  if (!integration)
    throw new Error("Integration not found or missing access token");
  await fetch(`${pinterestApiUrl}/oauth/token/revoke`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: JSON.stringify({
      token: integration.accessToken,
      token_type_hint: "access_token",
    }),
  });
  await fetch(`${pinterestApiUrl}/oauth/token/revoke`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: JSON.stringify({
      token: integration.refreshToken,
      token_type_hint: "refresh_token",
    }),
  });
}
