"use server";

import { AccountInfo } from "../social-media-api-functions";
import { tumblrApiUrl } from ".";

export async function fetchAccountInfoByAccessToken(
  accessToken: string
): Promise<AccountInfo> {
  const response = await fetch(`${tumblrApiUrl}/user/info`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    console.error("Failed to fetch account info", error);
    throw new Error("Failed to fetch account info");
  }

  const data = await response.json();

  const blog = data.response.user.blogs?.[0];
  const accountAvatarUrl = blog.avatar?.[0]?.url;

  return {
    accountId: blog.name,
    accountName: blog.name,
    accountUsername: undefined,
    accountAvatarUrl,
  };
}
