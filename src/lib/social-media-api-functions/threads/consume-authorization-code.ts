"use server";

import { Tokens } from "../social-media-api-functions";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error("Missing API URL");

const redirect_uri = `${apiUrl}/oauth2-redirect/threads`;

export async function consumeAuthorizationCode(code: string, state?: string): Promise<Tokens> {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_ID;
  if (!client_id) throw new Error("Missing Instagram client ID");
  
  const client_secret = process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_SECRET;
  if (!client_secret) throw new Error("Missing Instagram client secret");

  // Exchange authorization code for access token
  const tokenResponse = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id,
      client_secret,
      redirect_uri,
      code,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    let errorMessage = "Failed to exchange authorization code";
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch (e) {
      // If parsing fails, use the raw error text
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  const accessTokenExpiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  );

  if (!accessToken) throw new Error("No access token received from Threads");

  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken: accessToken, // Instagram doesn't provide refresh tokens, we'll use the access token
    refreshTokenExpiresAt: undefined,
  };
}