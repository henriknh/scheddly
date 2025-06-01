import {
  AccountInfo,
  SocialMediaApiFunctions,
  Tokens,
} from "./social-media-api-functions";
import prisma from "@/lib/prisma";

const pinterestApiUrl = "https://api.pinterest.com/v5";

export const pinterest: SocialMediaApiFunctions = {
  oauthPageUrl: () => {
    const clientId =
      process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_ID;

    if (!clientId) {
      throw new Error("Missing Pinterest client ID");
    }

    const redirectUri =
      process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_REDIRECT_URI;

    if (!redirectUri) {
      throw new Error("Missing Pinterest redirect URI");
    }

    const scope = "boards:read,pins:read,user_accounts:read";

    return `https://www.pinterest.com/oauth/?client_id=${process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  },
  consumeAuthorizationCode: async (code: string): Promise<Tokens> => {
    const clientId =
      process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_ID;
    const clientSecret =
      process.env.SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing Pinterest client credentials");
    }

    const response = await fetch(`${pinterestApiUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri:
          process.env
            .NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_REDIRECT_URI || "",
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      console.error("Failed to consume authorization code:", error);
      throw new Error("Failed to consume authorization code");
    }

    const data = await response.json();

    const accessToken = data.access_token;
    const accessTokenExpiresAt = new Date(Date.now() + data.expires_in * 1000);
    const refreshToken = data.refresh_token;
    const refreshTokenExpiresAt = new Date(
      Date.now() + data.refresh_token_expires_in * 1000
    );

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    };
  },
  refreshAccessToken: async (id: string): Promise<Tokens> => {
    const token = await prisma.token.findFirst({
      where: {
        socialMediaIntegration: {
          id,
        },
      },
    });

    if (!token?.refreshToken) {
      throw new Error("Integration not found or missing refresh token");
    }

    const response = await fetch(`${pinterestApiUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: token.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    const accessToken = data.access_token;
    const accessTokenExpiresAt = new Date(Date.now() + data.expires_in * 1000);
    const refreshToken = data.refresh_token;
    const refreshTokenExpiresAt = new Date(
      Date.now() + data.refresh_token_expires_in * 1000
    );

    await prisma.token.update({
      where: {
        id: token.id,
      },
      data: {
        accessToken,
        accessTokenExpiresAt,
        refreshToken,
        refreshTokenExpiresAt,
      },
    });

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshTokenExpiresAt,
    };
  },

  getValidAccessToken: async (id: string): Promise<string> => {
    const integration = await prisma.token.findFirst({
      where: {
        socialMediaIntegration: {
          id,
        },
      },
    });

    if (!integration?.accessToken) {
      throw new Error("Integration not found or missing access token");
    }

    if (integration.accessTokenExpiresAt < new Date()) {
      return (await pinterest.refreshAccessToken(id)).accessToken;
    }

    return integration.accessToken;
  },

  revokeAccessToken: async (id: string): Promise<void> => {
    // TODO: Implement
  },

  revokeRefreshToken: async (id: string): Promise<void> => {
    // TODO: Implement
  },

  fetchAccountInfoByAccessToken: async (
    accessToken: string
  ): Promise<AccountInfo> => {
    const response = await fetch(`${pinterestApiUrl}/user_account`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch account info");
    }

    const {
      id: accountId,
      business_name: name,
      profile_image: avatarUrl,
    } = await response.json();

    return {
      accountId,
      name,
      avatarUrl,
    };
  },

  updateAccountInfo: async (id: string): Promise<void> => {
    const accessToken = await pinterest.getValidAccessToken(id);

    const accountInfo = await pinterest.fetchAccountInfoByAccessToken(
      accessToken
    );

    await prisma.socialMediaIntegration.update({
      where: { id },
      data: {
        socialMediaIntegrationAccountInfo: {
          update: accountInfo,
        },
      },
    });
  },
};
