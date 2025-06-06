import { Post } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import {
  AccountInfo,
  SocialMediaApiFunctions,
  Tokens,
} from "./social-media-api-functions";

const client_id =
  process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_ID;

if (!client_id) {
  throw new Error("Missing Pinterest client ID");
}

const redirect_uri =
  process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_PINTEREST_REDIRECT_URI;

if (!redirect_uri) {
  throw new Error("Missing Pinterest redirect URI");
}

const pinterestApiUrl = "https://api.pinterest.com/v5";
const scope =
  "boards:read,pins:read,user_accounts:read,boards:read,boards:write,pins:read,pins:write";

export const pinterest: SocialMediaApiFunctions = {
  oauthPageUrl: () => {
    return `https://www.pinterest.com/oauth/?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`;
  },
  consumeAuthorizationCode: async (code: string): Promise<Tokens> => {
    const client_secret =
      process.env.SOCIAL_MEDIA_INTEGRATION_PINTEREST_CLIENT_SECRET;

    if (!client_id || !client_secret) {
      throw new Error("Missing Pinterest client credentials");
    }

    const response = await fetch(`${pinterestApiUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${client_id}:${client_secret}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri,
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
    const integration = await prisma.socialMediaIntegration.findFirst({
      where: {
        id,
      },
    });

    if (!integration?.refreshToken) {
      throw new Error("Integration not found or missing refresh token");
    }

    const response = await fetch(`${pinterestApiUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: integration.refreshToken,
        scope,
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

    await prisma.socialMediaIntegration.update({
      where: {
        id,
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
    const integration = await prisma.socialMediaIntegration.findFirst({
      where: {
        id,
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

  revokeTokens: async (id: string): Promise<void> => {
    const integration = await prisma.socialMediaIntegration.findFirst({
      where: {
        id,
      },
    });

    if (!integration) {
      throw new Error("Integration not found or missing access token");
    }

    await fetch(`${pinterestApiUrl}/oauth/token/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        token: integration.accessToken,
        token_type_hint: "access_token",
      }),
    });

    await fetch(`${pinterestApiUrl}/oauth/token/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        token: integration.refreshToken,
        token_type_hint: "refresh_token",
      }),
    });
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
        accountId: accountInfo.accountId,
        name: accountInfo.name,
        avatarUrl: accountInfo.avatarUrl,
      },
    });
  },

  postText: async (post: Post) => {
    console.log("postText", post);
  },

  postImage: async (post: Post) => {
    console.log("postImage", post);
  },

  postVideo: async (post: Post) => {
    console.log("postVideo", post);
  },

  deletePost: async (post: Post) => {
    console.log("deletePost", post);
  },
};
