"use server";

import { NextResponse } from "next/server";
import { createToken, setTokenCookie } from "@/lib/jwt";
import { CleanedUser, UserWithRelations } from "./types";

export const cleanUserData = async (
  user: UserWithRelations | CleanedUser
): Promise<CleanedUser> => {
  return { ...user, password: undefined };
};

export const updateUserTokenWithCleanedUser = async (
  user: UserWithRelations | CleanedUser
): Promise<CleanedUser> => {
  const cleanedUser = await cleanUserData(user);

  const token = await createToken(cleanedUser);
  await setTokenCookie(token);

  return cleanedUser;
};

export const updateUserTokenAndReturnNextResponse = async (
  user: UserWithRelations | CleanedUser
): Promise<NextResponse<{ user: CleanedUser }>> => {
  const cleanedUser = await updateUserTokenWithCleanedUser(user);

  return NextResponse.json({
    user: cleanedUser,
  });
};
