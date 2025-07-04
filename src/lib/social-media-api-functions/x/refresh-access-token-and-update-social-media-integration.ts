"use server";

import { Tokens } from "../social-media-api-functions";
import prisma from "@/lib/prisma";

const xApiUrl = "https://api.twitter.com";

export async function refreshAccessTokenAndUpdateSocialMediaIntegration(
  id: string
): Promise<Tokens> {
  const integration = await prisma.socialMediaIntegration.findFirst({
    where: { id },
  });

  if (!integration?.refreshToken) {
    throw new Error("Integration not found or missing refresh token");
  }

  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID;
  if (!client_id) throw new Error("Missing X client ID");
  const client_secret = process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_SECRET;
  if (!client_secret) throw new Error("Missing X client secret");

  const tokenResponse = await fetch(`${xApiUrl}/2/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: integration.refreshToken,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.json().catch(() => null);
    console.error("Failed to refresh access token:", error);
    throw new Error("Failed to refresh access token");
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token || integration.refreshToken; // Use new refresh token if provided
  const accessTokenExpiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  );

  if (!accessToken) throw new Error("No access token received from X");

  // Update the integration with new tokens
  await prisma.socialMediaIntegration.update({
    where: { id },
    data: {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
    },
  });

  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt: undefined,
  };
}
