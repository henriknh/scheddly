"use server";

import { Tokens } from "../social-media-api-functions";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error("Missing API URL");
const redirect_uri = `${apiUrl}/oauth2-redirect/x`;
const xApiUrl = "https://api.twitter.com";

export async function consumeAuthorizationCode(code: string): Promise<Tokens> {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID;
  if (!client_id) throw new Error("Missing X client ID");
  const client_secret = process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_SECRET;
  if (!client_secret) throw new Error("Missing X client secret");

  // For PKCE, we need the code verifier that corresponds to the code challenge
  // In a real implementation, this should be stored and retrieved based on the state parameter
  const code_verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";

  const tokenResponse = await fetch(`${xApiUrl}/2/oauth2/token`, {
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
      code_verifier,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.json().catch(() => null);
    console.error("Failed to exchange authorization code:", error);
    throw new Error("Failed to exchange authorization code");
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const accessTokenExpiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  );

  if (!accessToken) throw new Error("No access token received from X");
  if (!refreshToken) throw new Error("No refresh token received from X");

  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt: undefined, // X doesn't provide refresh token expiry
  };
}
