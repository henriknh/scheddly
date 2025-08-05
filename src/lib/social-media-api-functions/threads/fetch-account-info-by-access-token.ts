"use server";

import { AccountInfo } from "../social-media-api-functions";

export async function fetchAccountInfoByAccessToken(
  accessToken: string
): Promise<AccountInfo> {
  // First, get the Instagram business account ID
  const accountsResponse = await fetch(
    `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
  );

  if (!accountsResponse.ok) {
    throw new Error("Failed to fetch Facebook pages");
  }

  const accountsData = await accountsResponse.json();
  const pages = accountsData.data;

  if (!pages || pages.length === 0) {
    throw new Error("No Facebook pages found");
  }

  // Get the first page's Instagram business account
  const pageId = pages[0].id;
  const instagramResponse = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
  );

  if (!instagramResponse.ok) {
    throw new Error("Failed to fetch Instagram business account");
  }

  const instagramData = await instagramResponse.json();
  const instagramBusinessAccountId = instagramData.instagram_business_account?.id;

  if (!instagramBusinessAccountId) {
    throw new Error("No Instagram business account found");
  }

  // Get the Instagram account details
  const accountResponse = await fetch(
    `https://graph.facebook.com/v18.0/${instagramBusinessAccountId}?fields=id,username,name,profile_picture_url&access_token=${accessToken}`
  );

  if (!accountResponse.ok) {
    throw new Error("Failed to fetch Instagram account details");
  }

  const accountData = await accountResponse.json();

  return {
    accountId: accountData.id,
    accountName: accountData.name,
    accountUsername: accountData.username,
    accountAvatarUrl: accountData.profile_picture_url,
  };
}