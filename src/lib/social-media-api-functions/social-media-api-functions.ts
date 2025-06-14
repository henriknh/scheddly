import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import { SocialMedia } from "@/generated/prisma";
import { pinterest } from "./pinterest";
import { tumblr } from "./tumblr";

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
  accountAvatarUrl: string;
}

export interface Auth {
  id?: string;
  validAccessToken?: string;
}

export interface SocialMediaApiFunctions {
  oauthPageUrl: (brandId: string) => string;
  consumeAuthorizationCode: (code: string) => Promise<Tokens>;
  refreshAccessTokenAndUpdateSocialMediaIntegration: (
    id: string
  ) => Promise<Tokens>;
  revokeTokens: (id: string) => Promise<void>;
  getValidAccessToken: (id: string) => Promise<string>;

  fetchAccountInfoByAccessToken: (accessToken: string) => Promise<AccountInfo>;
  updateAccountInfo: (socialMediaIntegrationId: string) => Promise<void>;
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
  externalPostUrl: (socialMediaPost: SocialMediaPostWithRelations) => string;
}

export const getSocialMediaApiFunctions = (
  socialMedia: SocialMedia
): SocialMediaApiFunctions => {
  switch (socialMedia) {
    case SocialMedia.PINTEREST:
      return pinterest;
    case SocialMedia.TUMBLR:
      return tumblr;
  }

  throw new Error(`Social media ${socialMedia} not supported`);
};
