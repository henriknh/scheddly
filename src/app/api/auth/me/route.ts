import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/lib/jwt";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const payload = await getTokenData(request);
    if (!payload || !payload.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: payload.id as string,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("GET_USER_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
