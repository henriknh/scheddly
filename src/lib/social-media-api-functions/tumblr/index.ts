import { SocialMediaApiFunctions } from "../social-media-api-functions";
import { consumeAuthorizationCode } from "./consume-authorization-code";
import { deletePost } from "./delete-post";
import { externalAccountUrl } from "./external-account-url";
import { externalPostUrl } from "./external-post-url";
import { fetchAccountInfoByAccessToken } from "./fetch-account-info-by-access-token";
import { oauthPageUrl } from "./oauth-page-url";
import { postImage } from "./post-image";
import { postText } from "./post-text";
import { postVideo } from "./post-video";
import { refreshAccessTokenAndUpdateSocialMediaIntegration } from "./refresh-access-token-and-update-social-media-integration";
import { revokeTokens } from "./revoke-tokens";

export const tumblrApiUrl = "https://api.tumblr.com/v2";

export const tumblr: SocialMediaApiFunctions = {
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
