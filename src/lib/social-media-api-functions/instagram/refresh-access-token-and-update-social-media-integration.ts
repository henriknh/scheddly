"use server";

import prisma from "@/lib/prisma";
import { Tokens } from "../social-media-api-functions";
import { instagramGraphUrl } from ".";

export async function refreshAccessTokenAndUpdateSocialMediaIntegration(
  id: string
): Promise<Tokens> {
  const integration = await prisma.socialMediaIntegration.findFirst({
    where: { id },
  });
  if (!integration?.refreshToken)
    throw new Error("Integration not found or missing refresh token");
  const client_secret =
    process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_SECRET;
  if (!client_secret) throw new Error("Missing Instagram client secret");
  const response = await fetch(
    `${instagramGraphUrl}/refresh_access_token?grant_type=ig_refresh_token&access_token=${integration.refreshToken}`,
    { method: "GET" }
  );
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to refresh Instagram token:", error);
    throw new Error("Failed to refresh token");
  }
  const data = await response.json();
  const accessToken = data.access_token;
  const accessTokenExpiresAt = new Date(Date.now() + data.expires_in * 1000);
  await prisma.socialMediaIntegration.update({
    where: { id },
    data: {
      accessToken,
      accessTokenExpiresAt,
      refreshToken: accessToken,
      refreshTokenExpiresAt: accessTokenExpiresAt,
    },
  });
  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken: accessToken,
    refreshTokenExpiresAt: accessTokenExpiresAt,
  };
}
