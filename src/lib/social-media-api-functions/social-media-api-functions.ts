import { PostWithRelations } from "@/app/api/post/types";
import { SocialMedia, SocialMediaIntegration } from "@/generated/prisma";
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
  oauthPageUrl: () => string;
  consumeAuthorizationCode: (code: string) => Promise<Tokens>;
  refreshAccessToken: (id: string) => Promise<Tokens>;
  revokeTokens: (id: string) => Promise<void>;
  getValidAccessToken: (id: string) => Promise<string>;

  fetchAccountInfoByAccessToken: (accessToken: string) => Promise<AccountInfo>;
  updateAccountInfo: (id: string) => Promise<void>;
  postText: (post: PostWithRelations) => Promise<void>;
  postImage: (post: PostWithRelations) => Promise<void>;
  postVideo: (post: PostWithRelations) => Promise<void>;
  deletePost: (post: PostWithRelations) => Promise<void>;
}

export const getAccessTokenFromPost = async (
  post: PostWithRelations,
  socialMedia: SocialMedia
): Promise<string> => {
  const socialMediaIntegration: SocialMediaIntegration | undefined =
    post.socialMediaPosts.find(
      (socialMediaPost) =>
        socialMediaPost.socialMediaIntegration.socialMedia === socialMedia
    )?.socialMediaIntegration;

  if (!socialMediaIntegration) {
    throw new Error("Social media integration not found");
  }

  return await pinterest.getValidAccessToken(socialMediaIntegration.id);
};

export const getSocialMediaApiFunctions = (socialMedia: SocialMedia) => {
  switch (socialMedia) {
    case SocialMedia.PINTEREST:
      return pinterest;
    case SocialMedia.TUMBLR:
      return tumblr;
  }

  return null;
};
