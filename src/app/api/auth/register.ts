"use server";

import prisma from "@/lib/prisma";
import { updateUserTokenWithCleanedUser } from "@/app/api/user/helpers";
import bcrypt from "bcryptjs";

export async function register(email: string, name: string, password: string) {
  try {
    if (!email || !name || !password) {
      throw new Error("Please provide name, email, and password.");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // Basic client-like validations on the server for better messages
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error("Please enter a valid email address.");
    }
    if (trimmedName.length < 2) {
      throw new Error("Name must be at least 2 characters long.");
    }
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long.");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
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
          email: normalizedEmail,
          name: trimmedName,
          password: hashedPassword,
        },
        include: {
          avatar: true,
          subscription: true,
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

      // Link any pending invitations for this email to the newly created user
      await tx.invitation.updateMany({
        where: {
          email: normalizedEmail,
          status: "pending",
        },
        data: {
          invitedUserId: user.id,
        },
      });

      return user;
    });

    return updateUserTokenWithCleanedUser(result);
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Something went wrong while creating your account.");
  }
}
