"use server";

import { File, User, Team } from "@/generated/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createToken, setTokenCookie, verifyToken } from "./jwt";
import prisma from "./prisma";

export interface UserWithRelations extends User {
  avatar?: File | null;
  team?: Team | null;
}

export type CleanedUser = Omit<UserWithRelations, "password"> & {
  password?: undefined;
};

export const cleanUserData = async (
  user: UserWithRelations
): Promise<CleanedUser> => {
  return { ...user, password: undefined };
};

export const updateUserTokenWithCleanedUser = async (
  user: UserWithRelations
): Promise<CleanedUser> => {
  const cleanedUser = await cleanUserData(user);

  const token = await createToken(cleanedUser);
  await setTokenCookie(token);

  return cleanedUser;
};

export const updateUserTokenAndReturnNextResponse = async (
  user: UserWithRelations
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
    include: {
      avatar: true,
      team: true,
    },
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
    include: {
      avatar: true,
      team: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }
  const cleanedUser = await updateUserTokenWithCleanedUser(user);

  return cleanedUser;
}
