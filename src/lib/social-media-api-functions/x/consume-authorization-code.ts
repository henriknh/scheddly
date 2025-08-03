"use server";

import { Tokens } from "../social-media-api-functions";
import { xApiUrl } from "./index";
import { sessionStore } from "./session-store";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  console.error("Missing NEXT_PUBLIC_API_URL environment variable");
  throw new Error("Missing API URL");
}

const redirect_uri = `${apiUrl}/oauth2-redirect/x`;

export async function consumeAuthorizationCode(code: string, state?: string): Promise<Tokens> {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID;
  if (!client_id) {
    console.error("Missing SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID environment variable");
    throw new Error("Missing X client ID");
  }
  
  const client_secret = process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_SECRET;
  if (!client_secret) {
    console.error("Missing SOCIAL_MEDIA_INTEGRATION_X_CLIENT_SECRET environment variable");
    throw new Error("Missing X client secret");
  }

  // Get the code verifier from session store
  let codeVerifier: string;
  if (state) {
    const session = sessionStore.getSession(state);
    if (!session) {
      console.error("Invalid or expired OAuth session for state:", state);
      throw new Error("Invalid or expired OAuth session");
    }
    codeVerifier = session.codeVerifier;
    // Clean up the session
    sessionStore.deleteSession(state);
  } else {
    // Fallback for backward compatibility (remove this in production)
    console.warn("No state parameter provided, using fallback code verifier");
    codeVerifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
  }

  console.log("Exchanging authorization code for tokens...");
  
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
      code_verifier: codeVerifier,
    }).toString(),
  });

  if (!tokenResponse.ok) {
    const errorText = await tokenResponse.text();
    console.error("Failed to exchange authorization code:", {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      error: errorText
    });
    
    let errorMessage = "Failed to exchange authorization code";
    try {
      const errorData = JSON.parse(errorText);
      if (errorData.error_description) {
        errorMessage = errorData.error_description;
      } else if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch (e) {
      // If parsing fails, use the raw error text
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const accessTokenExpiresAt = new Date(
    Date.now() + tokenData.expires_in * 1000
  );

  if (!accessToken) throw new Error("No access token received from X");
  if (!refreshToken) throw new Error("No refresh token received from X");

  console.log("Successfully obtained tokens from X");

  return {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    refreshTokenExpiresAt: undefined, // X doesn't provide refresh token expiry
  };
}
