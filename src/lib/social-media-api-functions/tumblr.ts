import { PostWithRelations } from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import {
  AccountInfo,
  SocialMediaApiFunctions,
  Tokens,
} from "./social-media-api-functions";

const client_id =
  process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_TUMBLR_CLIENT_ID;

if (!client_id) {
  throw new Error("Missing Tumblr client ID");
}

const redirect_uri =
  process.env.NEXT_PUBLIC_SOCIAL_MEDIA_INTEGRATION_TUMBLR_REDIRECT_URI;

if (!redirect_uri) {
  throw new Error("Missing Tumblr redirect URI");
}

const tumblrApiUrl = "https://api.tumblr.com/v2";
const scope = "basic write offline_access";

export const tumblr: SocialMediaApiFunctions = {
  oauthPageUrl: () => {
    const state = crypto.randomUUID();
    return `https://www.tumblr.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=${state}`;
  },
  consumeAuthorizationCode: async (code: string): Promise<Tokens> => {
    console.log("consumeAuthorizationCode", code);
    const client_secret =
      process.env.SOCIAL_MEDIA_INTEGRATION_TUMBLR_CLIENT_SECRET;

    if (!client_secret) {
      throw new Error("Missing Tumblr client secret");
    }

    const response = await fetch(`${tumblrApiUrl}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id,
        client_secret,
        code,
        grant_type: "authorization_code",
        redirect_uri,
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to exchange authorization code for tokens", error);
      throw new Error("Failed to exchange authorization code for tokens");
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      refreshToken: data.refresh_token,
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

    const response = await fetch(`${tumblrApiUrl}/oauth2/token`, {
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
      throw new Error("Failed to refresh access token");
    }

    const data = await response.json();

    return {
      accessToken: data.access_token,
      accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
      refreshToken: data.refresh_token,
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
      const tokens = await tumblr.refreshAccessToken(id);
      return tokens.accessToken;
    } else {
      return integration.accessToken;
    }
  },

  revokeTokens: async (id: string): Promise<void> => {
    const integration = await prisma.socialMediaIntegration.findFirst({
      where: {
        id,
      },
    });

    if (!integration?.refreshToken) {
      throw new Error("Integration not found or missing refresh token");
    }

    const response = await fetch(`${tumblrApiUrl}/oauth/token/revoke`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        token: integration.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to revoke tokens");
    }
  },

  fetchAccountInfoByAccessToken: async (
    accessToken: string
  ): Promise<AccountInfo> => {
    const response = await fetch(`${tumblrApiUrl}/user/info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch account info");
    }

    const data = await response.json();

    return {
      accountId: data.response.user.name,
      name: data.response.user.name,
      avatarUrl: data.response.user.avatar_url,
    };
  },

  updateAccountInfo: async (id: string): Promise<void> => {
    console.log("updateAccountInfo", id);
    const integration = await prisma.socialMediaIntegration.findFirst({
      where: {
        id,
      },
    });

    if (!integration?.accessToken) {
      throw new Error("Integration not found or missing access token");
    }

    const accountInfo = await tumblr.fetchAccountInfoByAccessToken(
      integration.accessToken
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

  postText: async (post: PostWithRelations) => {
    console.log("postText", post);
  },

  postImage: async (post: PostWithRelations) => {
    console.log("postImage", post);
  },

  postVideo: async (post: PostWithRelations) => {
    console.log("postVideo", post);
  },

  deletePost: async (post: PostWithRelations) => {
    console.log("deletePost", post);
  },
};
