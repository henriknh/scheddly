import { SocialMedia } from "@/generated/prisma";
import { getTokenData } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { updateUserTokenAndReturnNextResponse } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export interface Oauth2CodeBody {
  platform: SocialMedia;
  code: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getTokenData(request);
    if (!payload || !payload.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const body: Oauth2CodeBody = await request.json();
    const { platform, code } = body;

    if (!platform || !code) {
      return new NextResponse("Platform and code are required", {
        status: 400,
      });
    }

    // Update user based on platform
    const updateData: Record<string, string | null> = {};

    switch (platform) {
      case SocialMedia.TUMBLR:
        updateData.oauth2TumblrCode = code;
        break;
      case SocialMedia.PINTEREST:
        updateData.oauth2PinterestCode = code;
        break;
      default:
        return new NextResponse(`Oauth2 for ${platform} is not yet supported`, {
          status: 400,
        });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return updateUserTokenAndReturnNextResponse(updatedUser);
  } catch (error) {
    console.error("[OAUTH2_CODE_REGISTRATION_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getTokenData(request);
    if (!payload || !payload.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.id as string },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform") as SocialMedia;

    if (!platform) {
      return new NextResponse("Platform is required", {
        status: 400,
      });
    }

    // Update user based on platform
    const updateData: Record<string, string | null> = {};

    switch (platform) {
      case SocialMedia.TUMBLR:
        updateData.oauth2TumblrCode = null;
        break;
      case SocialMedia.PINTEREST:
        updateData.oauth2PinterestCode = null;
        break;
      default:
        return new NextResponse(`Oauth2 for ${platform} is not yet supported`, {
          status: 400,
        });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return updateUserTokenAndReturnNextResponse(updatedUser);
  } catch (error) {
    console.error("[OAUTH2_CODE_REMOVAL_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
