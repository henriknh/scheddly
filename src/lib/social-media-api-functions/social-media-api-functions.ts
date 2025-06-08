import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";
import {
  SocialMedia,
  SocialMediaIntegration,
  SocialMediaPost,
} from "@/generated/prisma";
import { pinterest } from "./pinterest";
import { tumblr } from "./tumblr";

export interface Tokens {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt?: Date;
}

export interface AccountInfo {
  accountId: string;
  name: string;
  avatarUrl: string;
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
  updateAccountInfo: (id: string) => Promise<void>;
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
}

export const getSocialMediaApiFunctions = (socialMedia: SocialMedia) => {
  switch (socialMedia) {
    case SocialMedia.PINTEREST:
      return pinterest;
    case SocialMedia.TUMBLR:
      return tumblr;
  }

  return null;
};
