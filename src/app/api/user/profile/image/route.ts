import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createToken, getTokenData, setTokenCookie } from "@/lib/jwt";

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getTokenData(request);
    if (!payload || !payload.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { image } = body;

    if (!image) {
      return new NextResponse("Image URL is required", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: payload.id as string },
      data: { image },
    });

    const token = await createToken(updatedUser);
    await setTokenCookie(token);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PROFILE_IMAGE_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
