"use server";

export async function checkOAuthConfig() {
  const config = {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID: process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID,
    SOCIAL_MEDIA_INTEGRATION_X_CLIENT_SECRET: process.env.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_SECRET,
  };

  const issues = [];
  const redirectUri = `${config.NEXT_PUBLIC_API_URL}/oauth2-redirect/x`;

  if (!config.NEXT_PUBLIC_API_URL) {
    issues.push("Missing NEXT_PUBLIC_API_URL environment variable");
  }

  if (!config.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID) {
    issues.push("Missing SOCIAL_MEDIA_INTEGRATION_X_CLIENT_ID environment variable");
  }

  if (!config.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_SECRET) {
    issues.push("Missing SOCIAL_MEDIA_INTEGRATION_X_CLIENT_SECRET environment variable");
  }

  return {
    config: {
      ...config,
      SOCIAL_MEDIA_INTEGRATION_X_CLIENT_SECRET: config.SOCIAL_MEDIA_INTEGRATION_X_CLIENT_SECRET ? "***HIDDEN***" : undefined,
      redirectUri,
    },
    issues,
    isValid: issues.length === 0,
  };
}