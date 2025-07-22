import { SocialMediaApiFunctions } from "../social-media-api-functions";
import { oauthPageUrl } from "./oauth-page-url";
import { consumeAuthorizationCode } from "./consume-authorization-code";
import { refreshAccessTokenAndUpdateSocialMediaIntegration } from "./refresh-access-token-and-update-social-media-integration";
import { revokeTokens } from "./revoke-tokens";
import { fetchAccountInfoByAccessToken } from "./fetch-account-info-by-access-token";
import { postText } from "./post-text";
import { postImage } from "./post-image";
import { postVideo } from "./post-video";
import { deletePost } from "./delete-post";
import { externalAccountUrl } from "./external-account-url";
import { externalPostUrl } from "./external-post-url";

export const tiktok: SocialMediaApiFunctions = {
  oauthPageUrl,
  consumeAuthorizationCode,
  refreshAccessTokenAndUpdateSocialMediaIntegration,
  revokeTokens,
  fetchAccountInfoByAccessToken,
  postText,
  postImage,
  postVideo,
  deletePost,
  externalAccountUrl,
  externalPostUrl,
};
