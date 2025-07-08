"use server";

import prisma from "@/lib/prisma";
import { Tokens } from "../social-media-api-functions";
import { pinterestApiUrl } from ".";

const scope =
  "boards:read,pins:read,user_accounts:read,boards:read,boards:write,pins:read,pins:write";

export async function refreshAccessTokenAndUpdateSocialMediaIntegration(
  id: string
): Promise<Tokens> {
  const integration = await prisma.socialMediaIntegration.findFirst({
    where: { id },
  });
  if (!integration?.refreshToken)
    throw new Error("Integration not found or missing refresh token");
  const response = await fetch(`${pinterestApiUrl}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: JSON.stringify({
      grant_type: "refresh_token",
      refresh_token: integration.refreshToken,
      scope,
    }),
  });
  if (!response.ok) throw new Error("Failed to refresh token");
  const data = await response.json();
  const accessToken = data.access_token;
  const accessTokenExpiresAt = new Date(Date.now() + data.expires_in * 1000);
  const refreshToken = data.refresh_token;
  const refreshTokenExpiresAt = new Date(
    Date.now() + data.refresh_token_expires_in * 1000
  );
  await prisma.socialMediaIntegration.update({
    where: { id },
    data: {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    },
  });
  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt,
  };
}
