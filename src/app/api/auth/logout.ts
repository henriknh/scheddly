"use server";

import { removeTokenCookie } from "@/lib/jwt";

export async function logout() {
  try {
    await removeTokenCookie();
  } catch (error) {
    console.error("Logout error:", error);
    throw new Error("Could not log you out. Please try again.");
  }
}
