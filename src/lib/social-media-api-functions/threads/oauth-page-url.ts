"use server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) throw new Error("Missing API URL");

const redirect_uri = `${apiUrl}/oauth2-redirect/threads`;
const scope = "instagram_basic,instagram_content_publish,pages_show_list";

export async function oauthPageUrl(brandId?: string | null): Promise<string> {
  const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_ID;
  if (!client_id) throw new Error("Missing Instagram client ID");
  
  // Generate state parameter for CSRF protection
  const state = brandId || crypto.randomUUID();
  
  return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&response_type=code&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(state)}`;
}