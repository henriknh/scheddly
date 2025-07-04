"use server";

import { tumblrApiUrl } from ".";
import { Tokens } from "../social-media-api-functions";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Missing API URL");
}

const redirect_uri = `${apiUrl}/oauth2-redirect/tumblr`;

export const consumeAuthorizationCode = async (
  code: string
): Promise<Tokens> => {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_TUMBLR_CLIENT_ID;

  if (!client_id) {
    throw new Error("Missing Tumblr client ID");
  }

  const client_secret =
    process.env.SOCIAL_MEDIA_INTEGRATION_TUMBLR_CLIENT_SECRET;

  if (!client_secret) {
    throw new Error("Missing Tumblr client secret");
  }

  const response = await fetch(`${tumblrApiUrl}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id,
      client_secret,
      code,
      grant_type: "authorization_code",
      redirect_uri,
    }).toString(),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Failed to exchange authorization code for tokens", error);
    throw new Error("Failed to exchange authorization code for tokens");
  }

  const data = await response.json();

  return {
    accessToken: data.access_token,
    accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
    refreshToken: data.refresh_token,
  };
};
