import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { createToken, setTokenCookie } from "@/lib/jwt";
import { User } from "@/generated/prisma";
import { updateUserTokenAndReturnNextResponse } from "@/lib/user";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user || !user.password) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return new NextResponse("Invalid credentials", { status: 401 });
    }

    return updateUserTokenAndReturnNextResponse(user);
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
