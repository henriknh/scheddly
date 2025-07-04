import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { SocialMedia, SocialMediaIntegration } from "@/generated/prisma";
import { instagram } from "./instagram/index";
import { pinterest } from "./pinterest/index";
import { tumblr } from "./tumblr/index";
import { x } from "./x/index";
import prisma from "@/lib/prisma";

export const SocialMediaApiErrors = {
  INVALID_TOKEN: "Invalid token",
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
    | ((brandId: string) => string)
    | ((brandId: string) => Promise<string>);
  consumeAuthorizationCode: (code: string) => Promise<Tokens>;
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
  deletePost: (
    post: PostWithRelations,
    socialMediaPost: SocialMediaPostWithRelations
  ) => Promise<void>;
  externalAccountUrl: (
    socialMediaIntegration: SocialMediaIntegration
  ) => string;
  externalPostUrl: (socialMediaPost: SocialMediaPostWithRelations) => string;
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
  }

  throw new Error(`Social media ${socialMedia} not supported`);
};

export const getValidAccessToken = async (
  integrationId: string
): Promise<string> => {
  const integration = await prisma.socialMediaIntegration.findFirst({
    where: {
      id: integrationId,
    },
  });

  if (!integration?.accessToken) {
    throw new Error("Integration not found or missing access token");
  }

  if (integration.accessTokenExpiresAt < new Date()) {
    switch (integration.socialMedia) {
      case SocialMedia.INSTAGRAM:
        return (
          await instagram.refreshAccessTokenAndUpdateSocialMediaIntegration(
            integrationId
          )
        ).accessToken;
      case SocialMedia.PINTEREST:
        return (
          await pinterest.refreshAccessTokenAndUpdateSocialMediaIntegration(
            integrationId
          )
        ).accessToken;
      case SocialMedia.TUMBLR:
        return (
          await tumblr.refreshAccessTokenAndUpdateSocialMediaIntegration(
            integrationId
          )
        ).accessToken;
      case SocialMedia.X:
        return (
          await x.refreshAccessTokenAndUpdateSocialMediaIntegration(
            integrationId
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
