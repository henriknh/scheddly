import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getTokenData } from "@/lib/jwt";

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getTokenData(request);
    if (!payload || !payload.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, email, currentPassword, newPassword, image } = body;

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        email: true,
        password: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if email is being changed and if it&apos;s already taken
    if (email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return new NextResponse("Email already taken", { status: 400 });
      }
    }

    // Handle password change
    let hashedPassword: string | undefined;
    if (newPassword && currentPassword) {
      if (!user.password) {
        return new NextResponse("Cannot update password", { status: 400 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return new NextResponse("Current password is incorrect", {
          status: 400,
        });
      }

      hashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: payload.id as string },
      data: {
        name,
        email,
        ...(hashedPassword && { password: hashedPassword }),
        ...(image && { image }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
