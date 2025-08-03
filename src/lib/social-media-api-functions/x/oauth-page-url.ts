"use server";

import { xApiUrl } from ".";
import crypto from "crypto";
import { sessionStore } from "./session-store";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  console.error("Missing NEXT_PUBLIC_API_URL environment variable");
  throw new Error("Missing API URL");
}

const redirect_uri = `${apiUrl}/oauth2-redirect/x`;
const scope = "tweet.read tweet.write users.read offline.access media.write";

export async function oauthPageUrl(brandId?: string | null): Promise<string> {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID;
  if (!client_id) {
    console.error("Missing SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID environment variable");
    throw new Error("Missing X client ID");
  }
  
  // Generate PKCE code verifier and challenge
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  
  // Generate state parameter
  const state = brandId || crypto.randomBytes(16).toString('hex');
  
  // Store the code verifier in session store
  sessionStore.setSession(state, codeVerifier, brandId || undefined);
  
  const oauthUrl = `https://twitter.com/i/oauth2/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
  
  console.log("Generated OAuth URL:", oauthUrl);
  return oauthUrl;
}

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(codeVerifier: string): string {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  return hash.toString('base64url');
}
