"use server";

import { xApiUrl } from ".";
import crypto from "crypto";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error("Missing API URL");

const redirect_uri = `${apiUrl}/oauth2-redirect/x`;
const scope = "tweet.read tweet.write users.read offline.access media.write";

export async function oauthPageUrl(brandId?: string | null): Promise<string> {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID;
  if (!client_id) throw new Error("Missing X client ID");
  
  // Generate PKCE code verifier and challenge
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  
  // Generate state parameter for CSRF protection
  const state = brandId || crypto.randomBytes(32).toString('hex');
  
  // Store the code verifier in memory for later use
  // In production, you might want to use a more persistent storage
  globalThis.pkceStore = globalThis.pkceStore || new Map();
  globalThis.pkceStore.set(state, codeVerifier);
  
  return `https://twitter.com/i/oauth2/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
}

function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(codeVerifier: string): string {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  return hash.toString('base64url');
}
