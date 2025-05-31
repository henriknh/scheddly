"use server";

import { User } from "@/generated/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createToken, setTokenCookie, verifyToken } from "./jwt";
import prisma from "./prisma";

export const cleanUserData = async (user: User) => {
  return {
    ...user,
    password: undefined,
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

export const getUserFromToken = async () => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  const payload = await verifyToken(token);
  if (!payload || !payload.id) {
    return null;
  }

  return prisma.user.findUnique({
    where: { id: payload.id as string },
  });
};

export async function getUser(): Promise<User | null> {
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

  return user;
}
