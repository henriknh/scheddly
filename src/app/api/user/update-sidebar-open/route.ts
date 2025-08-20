import { getTokenData } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { updateUserTokenAndReturnNextResponse } from "@/app/api/user/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getTokenData(request);
    if (!payload || !payload.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { sidebarOpen } = body;

    if (typeof sidebarOpen !== "boolean") {
      return new NextResponse("Invalid sidebarOpen value", { status: 400 });
    }

    // Update user's sidebar state
    const updatedUser = await prisma.user.update({
      where: { id: payload.id as string },
      data: { sidebarOpen },
      include: {
        avatar: true,
      },
    });

    // Update the token cookie with the new user data
    return updateUserTokenAndReturnNextResponse(updatedUser);
  } catch (error) {
    console.error("SIDEBAR_UPDATE_ERROR", error);
    return new NextResponse("Failed to update sidebar state", { status: 500 });
  }
}
