import { getTokenData } from "@/lib/jwt";
import { uploadToMinio } from "@/lib/minio";
import prisma from "@/lib/prisma";
import { updateUserTokenAndReturnNextResponse } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import sharp, { ResizeOptions } from "sharp";

export async function PATCH(request: NextRequest) {
  try {
    const payload = await getTokenData(request);
    if (!payload || !payload.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let name: string | undefined;
    let email: string | undefined;
    let avatarUrl: string | undefined;
    let file: File | null = null;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      name = (formData.get("name") as string) || undefined;
      email = (formData.get("email") as string) || undefined;
      file = formData.get("avatarUrl") as File | null;
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
    if (file) {
      try {
        // Resize image to 512x512

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const resizeOptions: ResizeOptions = {
          width: 512,
          height: 512,
          fit: "cover",
        };

        const resizedImage = await sharp(buffer)
          .resize(resizeOptions)
          .toBuffer();

        // Create a unique filename
        avatarUrl = `avatars/${payload.id}${path.extname(file.name)}`;

        await uploadToMinio(resizedImage, avatarUrl, file.type);
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
        ...(avatarUrl && { avatarUrl }),
      },
    });

    return updateUserTokenAndReturnNextResponse(updatedUser);
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
