export interface Tokens {
  accessToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
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
  postText?: (text: string) => Promise<void>;
  postImage?: (image: string) => Promise<void>;
  postVideo?: (video: string) => Promise<void>;
}
