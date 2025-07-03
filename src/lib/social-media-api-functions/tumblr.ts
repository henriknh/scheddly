import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { SocialMediaIntegration } from "@/generated/prisma";
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
  oauthPageUrl: (brandId: string) => {
    return `https://www.tumblr.com/oauth2/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&state=${brandId}`;
  },
  consumeAuthorizationCode: async (code: string): Promise<Tokens> => {
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
        grant_type: "refresh_token",
        refresh_token: integration.refreshToken,
        client_id,
        client_secret,
      }).toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to refresh access token", error);
      throw new Error("Failed to refresh access token");
    }

    const data = await response.json();

    await prisma.socialMediaIntegration.update({
      where: {
        id,
      },
      data: {
        accessToken: data.access_token,
        accessTokenExpiresAt: new Date(Date.now() + data.expires_in * 1000),
        refreshToken: data.refresh_token,
      },
    });

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
      return (
        await tumblr.refreshAccessTokenAndUpdateSocialMediaIntegration(id)
      ).accessToken;
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
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to fetch account info", error);
      throw new Error("Failed to fetch account info");
    }

    const data = await response.json();

    const blog = data.response.user.blogs?.[0];
    const accountAvatarUrl = blog.avatar?.[0]?.url;

    return {
      accountId: blog.name,
      accountName: blog.name,
      accountUsername: undefined,
      accountAvatarUrl,
    };
  },

  updateAccountInfo: async (
    socialMediaIntegrationId: string
  ): Promise<void> => {
    const accessToken = await tumblr.getValidAccessToken(
      socialMediaIntegrationId
    );

    const accountInfo = await tumblr.fetchAccountInfoByAccessToken(accessToken);

    await prisma.socialMediaIntegration.update({
      where: { id: socialMediaIntegrationId },
      data: accountInfo,
    });
  },

  postText: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => {
    const accessToken = await tumblr.getValidAccessToken(
      socialMediaPost.socialMediaIntegrationId
    );

    const response = await fetch(
      `${tumblrApiUrl}/blog/${socialMediaPost.socialMediaIntegration.accountId}/posts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blog_identifier: socialMediaPost.socialMediaIntegration.accountId,
          content: [
            {
              type: "text",
              text: post.description,
            },
          ],
          state: "published",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to post text to Tumblr", error);
      throw new Error("Failed to post text to Tumblr");
    }

    try {
      const data = await response.json();

      await prisma.socialMediaPost.update({
        where: {
          id: socialMediaPost.id,
        },
        data: {
          socialMediaPostId: data.response.id,
          postedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to update database  ", error);
      throw new Error("Post created but failed to update database");
    }
  },

  postImage: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => {
    if (!post.images?.length) {
      throw new Error("No images provided");
    }

    const accessToken = await tumblr.getValidAccessToken(
      socialMediaPost.socialMediaIntegrationId
    );

    // Create a FormData object for multipart/form-data
    const formData = new FormData();

    try {
      // For multiple images, we'll create a photoset
      const mediaIdentifiers = await Promise.all(
        post.images.map(async (image, index) => {
          const identifier = `image-${index}`;
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/file/${image.id}`
          );
          const blob = await response.blob();

          // Add the image file to formData
          formData.append(identifier, blob, `image-${index}.jpg`);

          return {
            type: "image/jpeg",
            identifier,
            width: 0, // We don't know the dimensions, Tumblr will handle this
            height: 0,
          };
        })
      );

      // Create the JSON payload
      const jsonPayload = {
        blog_identifier: socialMediaPost.socialMediaIntegration.accountId,
        content: [
          ...mediaIdentifiers.map((mediaIdentifier) => ({
            type: "image",
            media: mediaIdentifier,
          })),
          {
            type: "text",
            text: post.description,
          },
        ],
        state: "published",
      };

      // Add the JSON payload to formData
      formData.append("json", JSON.stringify(jsonPayload));
    } catch (error) {
      console.error("Failed to create form data", error);
      throw new Error("Failed to create form data");
    }

    const response = await fetch(
      `${tumblrApiUrl}/blog/${socialMediaPost.socialMediaIntegration.accountId}/posts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to post image to Tumblr", error);
      throw new Error("Failed to post image to Tumblr");
    }

    try {
      const data = await response.json();

      await prisma.socialMediaPost.update({
        where: {
          id: socialMediaPost.id,
        },
        data: {
          socialMediaPostId: data.response.id,
          postedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to update database  ", error);
      throw new Error("Post created but failed to update database");
    }
  },

  postVideo: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => {
    if (!post.video) {
      throw new Error("No video provided");
    }

    const accessToken = await tumblr.getValidAccessToken(
      socialMediaPost.socialMediaIntegrationId
    );

    // Create a FormData object for multipart/form-data
    const formData = new FormData();

    try {
      // Get the video data
      const videoResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/file/${post.video.id}`
      );
      const videoBlob = await videoResponse.blob();

      // Add the video file to formData
      const videoIdentifier = "video-0";
      formData.append(videoIdentifier, videoBlob, "video.mp4");

      // Create the JSON payload
      const jsonPayload = {
        blog_identifier: socialMediaPost.socialMediaIntegration.accountId,
        content: [
          {
            type: "video",
            media: {
              type: "video/mp4",
              identifier: videoIdentifier,
              width: 0, // We don't know the dimensions, Tumblr will handle this
              height: 0,
            },
          },
          {
            type: "text",
            text: post.description,
          },
        ],
        state: "published",
      };

      // Add the JSON payload to formData
      formData.append("json", JSON.stringify(jsonPayload));
    } catch (error) {
      console.error("Failed to create form data", error);
      throw new Error("Failed to create form data");
    }

    const response = await fetch(
      `${tumblrApiUrl}/blog/${socialMediaPost.socialMediaIntegration.accountId}/posts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to post video to Tumblr", error);
      throw new Error("Failed to post video to Tumblr");
    }

    try {
      const data = await response.json();

      await prisma.socialMediaPost.update({
        where: {
          id: socialMediaPost.id,
        },
        data: {
          socialMediaPostId: data.response.id,
          postedAt: new Date(),
        },
      });
    } catch (error) {
      console.error("Failed to update database  ", error);
      throw new Error("Post created but failed to update database");
    }
  },

  deletePost: async (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => {
    if (!socialMediaPost.socialMediaPostId) {
      throw new Error("Social media post ID is required");
    }

    const accessToken = await tumblr.getValidAccessToken(
      socialMediaPost.socialMediaIntegrationId
    );

    const response = await fetch(
      `${tumblrApiUrl}/blog/${socialMediaPost.socialMediaIntegration.accountId}/post/delete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          id: socialMediaPost.socialMediaPostId,
        }).toString(),
      }
    );

    if (!response.ok) {
      const data = await response.json();
      if (data.meta.status === 404) {
        console.error("Post not found, skipping delete");
      } else {
        console.error("Failed to delete post from Tumblr", data);
        throw new Error("Failed to delete post from Tumblr");
      }
    }
  },

  externalAccountUrl: (socialMediaIntegration: SocialMediaIntegration) => {
    return `https://www.tumblr.com/blog/${socialMediaIntegration.accountId}`;
  },

  externalPostUrl: (socialMediaPost: SocialMediaPostWithRelations) => {
    return `https://tumblr.com/${socialMediaPost.socialMediaIntegration.accountId}/${socialMediaPost.socialMediaPostId}`;
  },
};
