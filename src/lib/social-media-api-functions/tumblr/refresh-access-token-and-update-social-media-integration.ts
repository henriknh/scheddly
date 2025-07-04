"use server";

import prisma from "@/lib/prisma";
import { Tokens } from "../social-media-api-functions";
import { tumblrApiUrl } from ".";

const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_TUMBLR_CLIENT_ID;

if (!client_id) {
  throw new Error("Missing Tumblr client ID");
}

const client_secret = process.env.SOCIAL_MEDIA_INTEGRATION_TUMBLR_CLIENT_SECRET;

if (!client_secret) {
  throw new Error("Missing Tumblr client secret");
}

export const refreshAccessTokenAndUpdateSocialMediaIntegration = async (
  id: string
): Promise<Tokens> => {
  const integration = await prisma.socialMediaIntegration.findFirst({
    where: {
      id,
    },
  });

  if (!integration?.refreshToken) {
    throw new Error("Integration not found or missing refresh token");
  }

  const response = await fetch(`${tumblrApiUrl}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: integration.refreshToken,
      client_id,
      client_secret,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Failed to refresh access token", error);
    throw new Error("Failed to refresh access token");
  }

  const data = await response.json();

  await prisma.socialMediaIntegration.update({
    where: {
      id,
    },
    data: {
      accessToken: data.access_token,
      accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      refreshToken: data.refresh_token,
    },
  });

  return {
    accessToken: data.access_token,
    accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
    refreshToken: data.refresh_token,
  };
};
