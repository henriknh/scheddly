"use server";

import { User } from "@/generated/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createToken, setTokenCookie, verifyToken } from "./jwt";
import prisma from "./prisma";

export type CleanedUser = Omit<User, "password"> & {
  password?: undefined;
};

export const cleanUserData = async (user: User): Promise<CleanedUser> => {
  return { ...user, password: undefined };
};

export const updateUserTokenWithCleanedUser = async (
  user: User
): Promise<CleanedUser> => {
  const cleanedUser = await cleanUserData(user);

  const token = await createToken(cleanedUser);
  await setTokenCookie(token);

  return cleanedUser;
};

export const updateUserTokenAndReturnNextResponse = async (
  user: User
): Promise<NextResponse<{ user: CleanedUser }>> => {
  const cleanedUser = await updateUserTokenWithCleanedUser(user);

  return NextResponse.json({
    user: cleanedUser,
  });
};

export const getUserFromToken = async () => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || !payload.id) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id as string },
  });

  if (!user) {
    return null;
  }

  return cleanUserData(user);
};

export async function getUser(): Promise<CleanedUser | null> {
  const payload = await getUserFromToken();
  if (!payload || !payload.id) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.id as string,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  const cleanedUser = await updateUserTokenWithCleanedUser(user);

  return cleanedUser;
}
