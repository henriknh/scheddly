"use server";

import { AccountInfo } from "../social-media-api-functions";
import { instagramGraphUrl } from ".";

export async function fetchAccountInfoByAccessToken(
  accessToken: string
): Promise<AccountInfo> {
  const response = await fetch(
    `${instagramGraphUrl}/me?fields=id,username,name,profile_picture_url&access_token=${accessToken}`,
    { method: "GET" }
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
}
