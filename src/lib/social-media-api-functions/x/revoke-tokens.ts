"use server";

import prisma from "@/lib/prisma";

const xApiUrl = "https://api.twitter.com";

export async function revokeTokens(id: string): Promise<void> {
  const integration = await prisma.socialMediaIntegration.findFirst({
    where: { id },
  });

  if (!integration?.accessToken) {
    throw new Error("Integration not found or missing access token");
  }

  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID;
  if (!client_id) throw new Error("Missing X client ID");
  const client_secret = process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_SECRET;
  if (!client_secret) throw new Error("Missing X client secret");

  const revokeResponse = await fetch(`${xApiUrl}/2/oauth2/revoke`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      token: integration.accessToken,
      token_type_hint: "access_token",
    }).toString(),
  });

  if (!revokeResponse.ok) {
    const error = await revokeResponse.json().catch(() => null);
    console.error("Failed to revoke access token:", error);
    throw new Error("Failed to revoke access token");
  }

  // Also try to revoke refresh token if it exists
  if (integration.refreshToken) {
    const refreshTokenRevokeResponse = await fetch(
      `${xApiUrl}/2/oauth2/revoke`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${client_id}:${client_secret}`
          ).toString("base64")}`,
        },
        body: new URLSearchParams({
          token: integration.refreshToken,
          token_type_hint: "refresh_token",
        }).toString(),
      }
    );

    if (!refreshTokenRevokeResponse.ok) {
      console.error("Failed to revoke refresh token");
    }
  }

  // Remove the integration from the database
  await prisma.socialMediaIntegration.delete({
    where: { id },
  });
}
