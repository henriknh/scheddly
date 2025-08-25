import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { SocialMedia, SocialMediaIntegration } from "@/generated/prisma";
import { instagram } from "./instagram/index";
import { pinterest } from "./pinterest/index";
import { tumblr } from "./tumblr/index";
import { x } from "./x/index";
import { tiktok } from "./tiktok/index";
import prisma from "@/lib/prisma";

export const SocialMediaApiErrors = {
  INVALID_TOKEN: "Invalid token",
  MEDIA_PROCESSING_FAILED: "Media processing failed",
  MEDIA_PROCESSING_TIMEOUT: "Media processing timeout",
};

export interface Tokens {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt?: Date;
}

export interface AccountInfo {
  accountId: string;
  accountName: string;
  accountUsername?: string;
  accountAvatarUrl?: string;
}

export interface Auth {
  id?: string;
  validAccessToken?: string;
}

export interface SocialMediaApiFunctions {
  oauthPageUrl:
    | ((brandId?: string | null) => string)
    | ((brandId?: string | null) => Promise<string>);
  consumeAuthorizationCode: (code: string, state?: string) => Promise<Tokens>;
  refreshAccessTokenAndUpdateSocialMediaIntegration: (
    id: string
  ) => Promise<Tokens>;
  revokeTokens: (id: string) => Promise<void>;

  fetchAccountInfoByAccessToken: (accessToken: string) => Promise<AccountInfo>;
  postText: (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => Promise<void>;
  postImage: (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => Promise<void>;
  postVideo: (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => Promise<void>;
  deletePost: (socialMediaPost: SocialMediaPostWithRelations) => Promise<void>;
  externalAccountUrl: (
    socialMediaIntegration: SocialMediaIntegration
  ) => string;
  externalPostUrl: (
    socialMediaPost: SocialMediaPostWithRelations
  ) => Promise<string>;
}

export const getSocialMediaApiFunctions = (
  socialMedia: SocialMedia
): SocialMediaApiFunctions => {
  switch (socialMedia) {
    case SocialMedia.INSTAGRAM:
      return instagram;
    case SocialMedia.PINTEREST:
      return pinterest;
    case SocialMedia.TUMBLR:
      return tumblr;
    case SocialMedia.X:
      return x;
    case SocialMedia.TIKTOK:
      return tiktok;
  }

  throw new Error(`Social media ${socialMedia} not supported`);
};

export const getValidAccessToken = async (
  socialMedia: SocialMedia,
  socialMediaIntegrationId: string
): Promise<string> => {
  const integration = await prisma.socialMediaIntegration.findUnique({
    where: {
      id: socialMediaIntegrationId,
    },
  });

  if (!integration?.accessToken) {
    throw new Error(
      `No active ${socialMedia} integration found with id ${socialMediaIntegrationId}`
    );
  }

  if (integration.accessTokenExpiresAt < new Date()) {
    switch (integration.socialMedia) {
      case SocialMedia.INSTAGRAM:
        return (
          await instagram.refreshAccessTokenAndUpdateSocialMediaIntegration(
            integration.id
          )
        ).accessToken;
      case SocialMedia.PINTEREST:
        return (
          await pinterest.refreshAccessTokenAndUpdateSocialMediaIntegration(
            integration.id
          )
        ).accessToken;
      case SocialMedia.TUMBLR:
        return (
          await tumblr.refreshAccessTokenAndUpdateSocialMediaIntegration(
            integration.id
          )
        ).accessToken;
      case SocialMedia.X:
        return (
          await x.refreshAccessTokenAndUpdateSocialMediaIntegration(
            integration.id
          )
        ).accessToken;
      case SocialMedia.TIKTOK:
        return (
          await tiktok.refreshAccessTokenAndUpdateSocialMediaIntegration(
            integration.id
          )
        ).accessToken;
      default:
        throw new Error(
          `Social media ${integration.socialMedia} not supported`
        );
    }
  } else {
    return integration.accessToken;
  }
};
