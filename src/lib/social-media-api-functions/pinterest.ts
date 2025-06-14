import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import config from "@/config";
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
  oauthPageUrl: (brandId: string) => {
    return `https://www.pinterest.com/oauth/?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=${brandId}`;
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
  refreshAccessTokenAndUpdateSocialMediaIntegration: async (
    id: string
  ): Promise<Tokens> => {
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
      return (
        await pinterest.refreshAccessTokenAndUpdateSocialMediaIntegration(id)
      ).accessToken;
    }

    if (!integration.accessToken) {
      throw new Error("Integration not found or missing access token");
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
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch account info");
    }

    const {
      id: accountId,
      business_name: accountName,
      profile_image: accountAvatarUrl,
    } = await response.json();

    return {
      accountId,
      accountName,
      accountAvatarUrl,
    };
  },

  updateAccountInfo: async (
    socialMediaIntegrationId: string
  ): Promise<void> => {
    const accessToken = await pinterest.getValidAccessToken(
      socialMediaIntegrationId
    );

    const accountInfo = await pinterest.fetchAccountInfoByAccessToken(
      accessToken
    );

    await prisma.socialMediaIntegration.update({
      where: { id: socialMediaIntegrationId },
      data: {
        accountId: accountInfo.accountId,
        accountName: accountInfo.accountName,
        accountAvatarUrl: accountInfo.accountAvatarUrl,
      },
    });
  },

  postText: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => {
    throw new Error("Not implemented");
  },

  postImage: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => {
    const accessToken = await pinterest.getValidAccessToken(
      socialMediaPost.socialMediaIntegrationId
    );

    const boards = await fetch(`${pinterestApiUrl}/boards`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    const boardsJson = await boards.json();

    const body = {
      link: "https://www.pinterest.com/",
      title: post.description,
      description: post.description,
      // dominant_color: "#6E7874",
      // alt_text: socialMediaPost?.altText,
      board_id: "1049972169315366740",
      // board_section_id: socialMediaPost?.boardSectionId,
      media_source: {
        source_type: "multiple_image_urls",
        // items: await Promise.all(post.images.map(async (image) => ({
        //   title: "string",
        //   description: "string",
        //   link: "string",
        //     url: await getPresignedUrl(image.path),
        //   })),
        // ),
        items: [
          {
            title: "string",
            description: "string",
            link: "string",
            // url: imageUrl,
            url: "https://commons.wikimedia.org/wiki/File:PNG_Test.png",
          },
          {
            title: "string",
            description: "string",
            link: "string",
            // url: imageUrl,
            url: "https://commons.wikimedia.org/wiki/File:PNG_Test.png",
          },
        ],
        index: 0,
      },
      note: `Created with ${config.appName}`,
      is_removable: true,
    };

    const response = await fetch(`${pinterestApiUrl}/pins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to post image", error);
      throw new Error("Failed to post image");
    }

    const json = await response.json();
  },

  postVideo: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => {
    throw new Error("Not implemented");
  },

  deletePost: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => {
    const accessToken = await pinterest.getValidAccessToken(
      socialMediaPost.socialMediaIntegrationId
    );

    const response = await fetch(`${pinterestApiUrl}/pins/${post.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
  },
  externalPostUrl: (socialMediaPost: SocialMediaPostWithRelations) => {
    throw new Error("Not implemented");
    // return `https://pinterest.com/pin/${socialMediaPost.socialMediaPostId}`;
  },
};
