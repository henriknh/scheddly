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
  
  // Generate a simple state parameter
  const state = brandId || crypto.randomBytes(16).toString('hex');
  
  return `https://twitter.com/i/oauth2/authorize?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;
}
