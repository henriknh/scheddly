"use server";

import { xApiUrl } from ".";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error("Missing API URL");
const redirect_uri = `${apiUrl}/oauth2-redirect/x`;
const scope = "tweet.read tweet.write users.read offline.access media.write";

export async function oauthPageUrl(brandId?: string | null): Promise<string> {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID;
  if (!client_id) throw new Error("Missing X client ID");
  return `https://twitter.com/i/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=${
    brandId || ""
  }&code_challenge_method=S256&code_challenge=${generateCodeChallenge()}`;
}

function generateCodeChallenge(): string {
  // For simplicity, using a fixed code challenge. In production, this should be generated dynamically
  // and stored to verify the code verifier later
  return "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM";
}
