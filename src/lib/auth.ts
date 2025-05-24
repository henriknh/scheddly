import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function verifyCredentials(email: string, password: string) {
  if (!email || !password) {
    throw new Error("Missing credentials");
  }

  const user = await db.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user || !user.password) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}
