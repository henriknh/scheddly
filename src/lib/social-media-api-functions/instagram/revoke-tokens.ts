"use server";

import prisma from "@/lib/prisma";
import { instagramApiUrl } from ".";

export async function revokeTokens(id: string): Promise<void> {
  const integration = await prisma.socialMediaIntegration.findFirst({
    where: { id },
  });
  if (!integration) throw new Error("Integration not found");
  // Instagram doesn't have a direct token revocation endpoint
  // We'll just remove the tokens from our database
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_ID;
  if (!client_id) throw new Error("Missing Instagram client ID");

  await fetch(`${instagramApiUrl}/revoke_access_and_refresh_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      access_token: integration.accessToken,
      client_id,
    }).toString(),
  });
  await prisma.socialMediaIntegration.update({
    where: { id },
    data: { accessToken: "", refreshToken: "" },
  });
}
