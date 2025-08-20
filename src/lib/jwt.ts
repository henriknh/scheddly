"use server";

import { CleanedUser } from "@/app/api/user/types";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const rawSecret = process.env.JWT_SECRET;
if (!rawSecret) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production environment");
  } else {
    console.warn(
      "JWT_SECRET is not set. Using a weak development secret. Do NOT use this in production."
    );
  }
}
const JWT_SECRET = new TextEncoder().encode(rawSecret || "insecure_dev_secret");

export async function createToken(user: CleanedUser) {
  return await new SignJWT(user)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export async function getTokenData(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;

    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    console.error("Failed to get token data:", error);
    return null;
  }
}

export async function setTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // strict in prod; allow local dev over http
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 30, // 30 days
    path: "/",
  });
}

export async function removeTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}
