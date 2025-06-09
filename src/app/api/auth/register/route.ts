import prisma from "@/lib/prisma";
import { updateUserTokenAndReturnNextResponse } from "@/lib/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return new NextResponse("User already exists", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and team in a transaction to ensure both operations succeed
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
        include: {
          avatar: true,
        },
      });

      // Create a team for the user
      await tx.team.create({
        data: {
          name: `${name}'s Team`,
          owner: {
            connect: {
              id: user.id,
            },
          },
          members: {
            connect: {
              id: user.id,
            },
          },
        },
      });

      return user;
    });

    return updateUserTokenAndReturnNextResponse(result);
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
