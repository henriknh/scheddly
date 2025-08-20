import { getTokenData } from "@/lib/jwt";
import { deleteFromMinio, uploadAvatar } from "@/lib/minio";
import prisma from "@/lib/prisma";
import { updateUserTokenAndReturnNextResponse } from "@/app/api/user/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getTokenData(request);
    if (!payload || !payload.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let name: string | undefined;
    let email: string | undefined;
    let avatarFile: File | null = null;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = (formData.get("name") as string) || undefined;
      email = (formData.get("email") as string) || undefined;
      avatarFile = formData.get("avatar") as File | null;
    } else {
      const body = await request.json();
      ({ name, email } = body);
    }

    // Get the current user
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return new NextResponse("Email already taken", { status: 400 });
      }
    }

    // Handle file upload
    if (avatarFile) {
      try {
        // Delete old avatar
        const existingFile = await prisma.file.findMany({
          where: {
            user: {
              id: payload.id as string,
            },
          },
        });

        await Promise.all(
          existingFile.map((file) => {
            return deleteFromMinio(file).then(() => {
              return prisma.file.delete({
                where: {
                  id: file.id,
                },
              });
            });
          })
        );

        // Add new avatar
        const { path, mimeType, size } = await uploadAvatar(
          avatarFile,
          payload.id as string
        );

        await prisma.file.create({
          data: {
            path,
            mimeType,
            size,
            user: {
              connect: {
                id: payload.id as string,
              },
            },
          },
        });
      } catch (error) {
        console.error("FILE_UPLOAD_ERROR", error);
        return new NextResponse("Error uploading file", { status: 500 });
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: payload.id as string },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
      include: {
        avatar: true,
      },
    });

    return updateUserTokenAndReturnNextResponse(updatedUser);
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
