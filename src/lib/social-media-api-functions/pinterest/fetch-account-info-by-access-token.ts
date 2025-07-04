"use server";

import { AccountInfo } from "../social-media-api-functions";

const pinterestApiUrl = "https://api-sandbox.pinterest.com/v5";

export async function fetchAccountInfoByAccessToken(
  accessToken: string
): Promise<AccountInfo> {
  const response = await fetch(`${pinterestApiUrl}/user_account`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch account info");
  const data = await response.json();
  return {
    accountId: data.id,
    accountName: data.business_name,
    accountUsername: data.username,
    accountAvatarUrl: data.profile_image,
  };
}
