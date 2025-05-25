import { User } from "@/generated/prisma";
import { NextResponse } from "next/server";
import { createToken, setTokenCookie } from "./jwt";
import { USER_SECRET_REPLACEMENT } from "./user-secret-replacement";

export const cleanUserData = async (user: User) => {
  return {
    ...user,
    password: undefined,
    tumblrClientSecret: user.tumblrClientSecret
      ? USER_SECRET_REPLACEMENT
      : null,
    pinterestClientSecret: user.pinterestClientSecret
      ? USER_SECRET_REPLACEMENT
      : null,
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
