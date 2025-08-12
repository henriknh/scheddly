"use server";

import prisma from "@/lib/prisma";
import { updateUserTokenWithCleanedUser } from "@/lib/user";
import bcrypt from "bcryptjs";

export async function login(email: string, password: string) {
  // Pre-computed once per cold start to mitigate timing attacks
  const DUMMY_PASSWORD_HASH = bcrypt.hashSync("invalid_password", 10);

  if (!email || !password) {
    // Constant-time-ish response between unknown and known users
    await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
    throw new Error("Invalid email or password.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    include: {
      avatar: true,
    },
  });

  if (!user || !user.password) {
    // Constant-time-ish response between unknown and known users
    await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
    throw new Error("Invalid email or password.");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid email or password.");
  }

  return updateUserTokenWithCleanedUser(user);
}
