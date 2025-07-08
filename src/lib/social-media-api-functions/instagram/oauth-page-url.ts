"use server";

import { instagramApiUrl } from ".";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error("Missing API URL");
const redirect_uri = `${apiUrl}/oauth2-redirect/instagram`;
const scope =
  "instagram_business_basic,instagram_business_content_publish,instagram_business_manage_messages,instagram_business_manage_comments";

export async function oauthPageUrl(brandId: string): Promise<string> {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_ID;
  if (!client_id) throw new Error("Missing Instagram client ID");
  return `${instagramApiUrl}/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=${brandId}`;
}
