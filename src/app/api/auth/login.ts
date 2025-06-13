"use server";

import prisma from "@/lib/prisma";
import { updateUserTokenWithCleanedUser } from "@/lib/user";
import bcrypt from "bcryptjs";

export async function login(email: string, password: string) {
  try {
    if (!email || !password) {
      throw new Error("Missing required fields");
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        avatar: true,
      },
    });

    if (!user || !user.password) {
      throw new Error("Invalid credentials");
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }

    return updateUserTokenWithCleanedUser(user);
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    throw new Error("Internal Error");
  }
}
