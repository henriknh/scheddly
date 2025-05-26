import { User } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { createToken, setTokenCookie } from "./jwt";

export const cleanUserData = async (user: User) => {
  return {
    ...user,
    password: undefined,
    oauth2PinterestCode: !!user.oauth2PinterestCode,
    oauth2TumblrCode: !!user.oauth2TumblrCode,
  };
};

export const updateUserTokenWithCleanedUser = async (user: User) => {
  const cleanedUser = await cleanUserData(user);

  const token = await createToken(cleanedUser);
  await setTokenCookie(token);

  return cleanedUser;
};

export const updateUserTokenAndReturnNextResponse = async (user: User) => {
  const cleanedUser = await updateUserTokenWithCleanedUser(user);

  return NextResponse.json({
    user: cleanedUser,
  });
};
