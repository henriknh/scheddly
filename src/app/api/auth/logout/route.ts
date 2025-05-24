import { NextResponse } from "next/server";
import { removeTokenCookie } from "@/lib/jwt";

export async function POST() {
  try {
    await removeTokenCookie();
    return new NextResponse("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    return new NextResponse("Error during logout", { status: 500 });
  }
}
