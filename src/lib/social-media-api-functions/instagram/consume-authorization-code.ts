"use server";

import { Tokens } from "../social-media-api-functions";
import { instagramGraphUrl, instagramApiUrl } from ".";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error("Missing API URL");
const redirect_uri = `${apiUrl}/oauth2-redirect/instagram`;

export async function consumeAuthorizationCode(code: string, state?: string): Promise<Tokens> {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_ID;
  if (!client_id) throw new Error("Missing Instagram client ID");
  const client_secret =
    process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_SECRET;
  if (!client_secret) throw new Error("Missing Instagram client secret");

  // Step 1: Exchange authorization code for short-lived access token
  const tokenResponse = await fetch(`${instagramApiUrl}/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id,
      client_secret,
      grant_type: "authorization_code",
      redirect_uri,
      code,
    }).toString(),
  });
  if (!tokenResponse.ok) {
    const error = await tokenResponse.json().catch(() => null);
    console.error("Failed to exchange authorization code:", error);
    throw new Error("Failed to exchange authorization code");
  }
  const tokenData = await tokenResponse.json();
  const shortLivedToken =
    tokenData.data?.[0]?.access_token || tokenData.access_token;
  if (!shortLivedToken)
    throw new Error("No access token received from Instagram");

  // Step 2: Exchange short-lived token for long-lived token
  const longLivedTokenResponse = await fetch(
    `${instagramGraphUrl}/access_token?grant_type=ig_exchange_token&client_secret=${client_secret}&access_token=${shortLivedToken}`,
    { method: "GET" }
  );
  if (!longLivedTokenResponse.ok) {
    const error = await longLivedTokenResponse.json().catch(() => null);
    console.error("Failed to get long-lived token:", error);
    throw new Error("Failed to get long-lived token");
  }
  const longLivedTokenData = await longLivedTokenResponse.json();
  const accessToken = longLivedTokenData.access_token;
  const accessTokenExpiresAt = new Date(
    Date.now() + longLivedTokenData.expires_in * 1000
  );
  // Instagram doesn't provide refresh tokens in the same way as other platforms
  // We'll use the access token as the refresh token for consistency
  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken: accessToken,
    refreshTokenExpiresAt: accessTokenExpiresAt,
  };
}
