"use server";

import { AccountInfo } from "../social-media-api-functions";
import { xApiUrl } from "./index";

export async function fetchAccountInfoByAccessToken(
  accessToken: string
): Promise<AccountInfo> {
  const response = await fetch(
    `${xApiUrl}/2/users/me?user.fields=profile_image_url`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Failed to fetch X account info:", error);
    throw new Error("Failed to fetch X account info");
  }

  const data = await response.json();
  const user = data.data;

  console.log("user", user);

  if (!user) {
    throw new Error("No user data received from X");
  }

  return {
    accountId: user.id,
    accountName: user.name,
    accountUsername: user.username,
    accountAvatarUrl: user.profile_image_url,
  };
}
