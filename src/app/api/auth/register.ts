"use server";

import prisma from "@/lib/prisma";
import { updateUserTokenWithCleanedUser } from "@/lib/user";
import bcrypt from "bcryptjs";

export async function register(email: string, name: string, password: string) {
  try {
    if (!email || !name || !password) {
      throw new Error("Missing required fields");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and team in a transaction to ensure both operations succeed
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
        include: {
          avatar: true,
        },
      });

      // Create a team for the user
      await tx.team.create({
        data: {
          name: `${name}'s Team`,
          owner: {
            connect: {
              id: user.id,
            },
          },
          members: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return user;
    });

    return updateUserTokenWithCleanedUser(result);
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    throw new Error("Internal Error");
  }
}
