import prisma from "@/lib/prisma";
import { updateUserTokenAndReturnNextResponse } from "@/lib/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

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
      include: {
        avatar: true,
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
