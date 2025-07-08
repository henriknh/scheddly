"use server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error("Missing API URL");
const redirect_uri = `${apiUrl}/oauth2-redirect/pinterest`;
const scope =
  "boards:read,pins:read,user_accounts:read,boards:read,boards:write,pins:read,pins:write";

export async function oauthPageUrl(brandId: string): Promise<string> {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_ID;
  if (!client_id) throw new Error("Missing Pinterest client ID");
  return `https://www.pinterest.com/oauth/?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=${brandId}`;
}
