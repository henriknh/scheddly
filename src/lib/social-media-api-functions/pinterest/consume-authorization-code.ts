"use server";

import { Tokens } from "../social-media-api-functions";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error("Missing API URL");
const redirect_uri = `${apiUrl}/oauth2-redirect/pinterest`;
const pinterestApiUrl = "https://api-sandbox.pinterest.com/v5";

export async function consumeAuthorizationCode(code: string): Promise<Tokens> {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_ID;
  if (!client_id) throw new Error("Missing Pinterest client ID");
  const client_secret =
    process.env.SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_SECRET;
  if (!client_secret) throw new Error("Missing Pinterest client secret");

  const response = await fetch(`${pinterestApiUrl}/oauth/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${client_id}:${client_secret}`
      ).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to consume authorization code:", error);
    throw new Error("Failed to consume authorization code");
  }

  const data = await response.json();
  return {
    accessToken: data.access_token,
    accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
    refreshToken: data.refresh_token,
    refreshTokenExpiresAt: new Date(
      Date.now() + data.refresh_token_expires_in * 1000
    ),
  };
}
