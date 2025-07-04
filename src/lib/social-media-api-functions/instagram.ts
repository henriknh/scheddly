import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import prisma from "@/lib/prisma";
import {
  AccountInfo,
  SocialMediaApiFunctions,
  Tokens,
} from "./social-media-api-functions";
import { SocialMediaIntegration } from "@/generated/prisma";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("Missing API URL");
}

const redirect_uri = `${apiUrl}/oauth2-redirect/instagram`;

// Instagram API endpoints
const instagramApiUrl = "https://api.instagram.com";
const instagramGraphUrl = "https://graph.instagram.com";

// Instagram Business Login scopes
const scope =
  "instagram_business_basic,instagram_business_content_publish,instagram_business_manage_messages,instagram_business_manage_comments";

export const instagram: SocialMediaApiFunctions = {
  oauthPageUrl: (brandId: string) => {
    const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_ID;

    if (!client_id) {
      throw new Error("Missing Instagram client ID");
    }

    return `${instagramApiUrl}/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=${brandId}`;
  },

  consumeAuthorizationCode: async (code: string): Promise<Tokens> => {
    const client_id = process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_ID;

    if (!client_id) {
      throw new Error("Missing Instagram client ID");
    }

    const client_secret =
      process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_SECRET;

    if (!client_secret) {
      throw new Error("Missing Instagram client secret");
    }

    // Step 1: Exchange authorization code for short-lived access token
    const tokenResponse = await fetch(`${instagramApiUrl}/oauth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id,
        client_secret,
        grant_type: "authorization_code",
        redirect_uri,
        code,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json().catch(() => null);
      console.error("Failed to exchange authorization code:", error);
      throw new Error("Failed to exchange authorization code");
    }

    const tokenData = await tokenResponse.json();

    // Instagram returns data in a nested structure
    const shortLivedToken =
      tokenData.data?.[0]?.access_token || tokenData.access_token;
    const userId = tokenData.data?.[0]?.user_id || tokenData.user_id;

    if (!shortLivedToken) {
      throw new Error("No access token received from Instagram");
    }

    // Step 2: Exchange short-lived token for long-lived token
    const longLivedTokenResponse = await fetch(
      `${instagramGraphUrl}/access_token?grant_type=ig_exchange_token&client_secret=${client_secret}&access_token=${shortLivedToken}`,
      {
        method: "GET",
      }
    );

    if (!longLivedTokenResponse.ok) {
      const error = await longLivedTokenResponse.json().catch(() => null);
      console.error("Failed to get long-lived token:", error);
      throw new Error("Failed to get long-lived token");
    }

    const longLivedTokenData = await longLivedTokenResponse.json();

    const accessToken = longLivedTokenData.access_token;
    const accessTokenExpiresAt = new Date(
      Date.now() + longLivedTokenData.expires_in * 1000
    );

    // Instagram doesn't provide refresh tokens in the same way as other platforms
    // We'll use the access token as the refresh token for consistency
    const refreshToken = accessToken;
    const refreshTokenExpiresAt = accessTokenExpiresAt;

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

    const client_secret =
      process.env.SOCIAL_MEDIA_INTEGRATION_INSTAGRAM_CLIENT_SECRET;

    if (!client_secret) {
      throw new Error("Missing Instagram client secret");
    }

    // Refresh the long-lived access token
    const response = await fetch(
      `${instagramGraphUrl}/refresh_access_token?grant_type=ig_refresh_token&access_token=${integration.refreshToken}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      console.error("Failed to refresh Instagram token:", error);
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    const accessToken = data.access_token;
    const accessTokenExpiresAt = new Date(Date.now() + data.expires_in * 1000);

    // Update the integration with new tokens
    await prisma.socialMediaIntegration.update({
      where: {
        id,
      },
      data: {
        accessToken,
        accessTokenExpiresAt,
        refreshToken: accessToken, // Use the new access token as refresh token
        refreshTokenExpiresAt: accessTokenExpiresAt,
      },
    });

    return {
      accessToken,
      accessTokenExpiresAt,
      refreshToken: accessToken,
      refreshTokenExpiresAt: accessTokenExpiresAt,
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

    // Check if token is expired (with 5 minute buffer)
    const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
    if (integration.accessTokenExpiresAt.getTime() - bufferTime < Date.now()) {
      return (
        await instagram.refreshAccessTokenAndUpdateSocialMediaIntegration(id)
      ).accessToken;
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
      throw new Error("Integration not found");
    }

    // Instagram doesn't have a direct token revocation endpoint
    // We'll just remove the tokens from our database
    await prisma.socialMediaIntegration.update({
      where: {
        id,
      },
      data: {
        accessToken: "",
        refreshToken: "",
      },
    });
  },

  fetchAccountInfoByAccessToken: async (
    accessToken: string
  ): Promise<AccountInfo> => {
    // Get user's Instagram account information
    const response = await fetch(
      `${instagramGraphUrl}/me?fields=id,username,name,profile_picture_url&access_token=${accessToken}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      console.error("Failed to fetch Instagram account info:", error);
      throw new Error("Failed to fetch account info");
    }

    const data = await response.json();

    return {
      accountId: data.id,
      accountName: data.name,
      accountUsername: data.username,
      accountAvatarUrl: data.profile_picture_url,
    };
  },

  postText: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ): Promise<void> => {
    const accessToken = await instagram.getValidAccessToken(
      socialMediaPost.socialMediaIntegrationId
    );

    // Instagram doesn't support text-only posts via API
    // We'll need to create a media post with a caption
    throw new Error(
      "Instagram text-only posts are not supported. Please add an image or video."
    );
  },

  postImage: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ): Promise<void> => {
    const accessToken = await instagram.getValidAccessToken(
      socialMediaPost.socialMediaIntegrationId
    );

    if (!post.images || post.images.length === 0) {
      throw new Error("No images found in post");
    }

    // Instagram only supports single image posts via API
    const image = post.images[0];
    const imageUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/file/${image.id}`;

    // Step 1: Create media container
    const createMediaResponse = await fetch(
      `${instagramGraphUrl}/me/media?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          image_url: imageUrl,
          caption: post.description,
          access_token: accessToken,
        }).toString(),
      }
    );

    if (!createMediaResponse.ok) {
      const error = await createMediaResponse.json().catch(() => null);
      console.error("Failed to create Instagram media:", error);
      throw new Error("Failed to create Instagram media");
    }

    const mediaData = await createMediaResponse.json();
    const mediaId = mediaData.id;

    // Step 2: Publish the media
    const publishResponse = await fetch(
      `${instagramGraphUrl}/me/media_publish?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          creation_id: mediaId,
          access_token: accessToken,
        }).toString(),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json().catch(() => null);
      console.error("Failed to publish Instagram media:", error);
      throw new Error("Failed to publish Instagram media");
    }

    const publishData = await publishResponse.json();

    // Update the social media post with the published post ID
    await prisma.socialMediaPost.update({
      where: {
        id: socialMediaPost.id,
      },
      data: {
        socialMediaPostId: publishData.id,
        postedAt: new Date(),
      },
    });
  },

  postVideo: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ): Promise<void> => {
    const accessToken = await instagram.getValidAccessToken(
      socialMediaPost.socialMediaIntegrationId
    );

    if (!post.video) {
      throw new Error("No video found in post");
    }

    const videoUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/file/${post.video.id}`;
    const coverUrl = post.videoCover
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/file/${post.videoCover.id}`
      : undefined;

    // Step 1: Create media container for video
    const createMediaResponse = await fetch(
      `${instagramGraphUrl}/me/media?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          media_type: "VIDEO",
          video_url: videoUrl,
          caption: post.description,
          ...(coverUrl && { cover_url: coverUrl }),
          access_token: accessToken,
        }).toString(),
      }
    );

    if (!createMediaResponse.ok) {
      const error = await createMediaResponse.json().catch(() => null);
      console.error("Failed to create Instagram video media:", error);
      throw new Error("Failed to create Instagram video media");
    }

    const mediaData = await createMediaResponse.json();
    const mediaId = mediaData.id;

    // Step 2: Publish the video
    const publishResponse = await fetch(
      `${instagramGraphUrl}/me/media_publish?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          creation_id: mediaId,
          access_token: accessToken,
        }).toString(),
      }
    );

    if (!publishResponse.ok) {
      const error = await publishResponse.json().catch(() => null);
      console.error("Failed to publish Instagram video:", error);
      throw new Error("Failed to publish Instagram video");
    }

    const publishData = await publishResponse.json();

    // Update the social media post with the published post ID
    await prisma.socialMediaPost.update({
      where: {
        id: socialMediaPost.id,
      },
      data: {
        socialMediaPostId: publishData.id,
        postedAt: new Date(),
      },
    });
  },

  deletePost: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ): Promise<void> => {
    if (!socialMediaPost.socialMediaPostId) {
      throw new Error("No Instagram post ID found");
    }

    const accessToken = await instagram.getValidAccessToken(
      socialMediaPost.socialMediaIntegrationId
    );

    // Instagram doesn't support deleting posts via API
    // We'll mark it as failed in our database
    await prisma.socialMediaPost.update({
      where: {
        id: socialMediaPost.id,
      },
      data: {
        failedAt: new Date(),
        failedReason: "Instagram doesn't support post deletion via API",
      },
    });
  },

  externalAccountUrl: (
    socialMediaIntegration: SocialMediaIntegration
  ): string => {
    return `https://www.instagram.com/${
      socialMediaIntegration.accountUsername ||
      socialMediaIntegration.accountName
    }`;
  },

  externalPostUrl: (socialMediaPost: SocialMediaPostWithRelations): string => {
    if (!socialMediaPost.socialMediaPostId) {
      return "";
    }
    return `https://www.instagram.com/p/${socialMediaPost.socialMediaPostId}`;
  },
};
