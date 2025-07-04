"use server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Missing API URL");
}

const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_TUMBLR_CLIENT_ID;

if (!client_id) {
  throw new Error("Missing Tumblr client ID");
}

const redirect_uri = `${apiUrl}/oauth2-redirect/tumblr`;

const scope = "basic write offline_access";

export async function oauthPageUrl(brandId: string): Promise<string> {
  return `https://www.tumblr.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=${brandId}`;
}
