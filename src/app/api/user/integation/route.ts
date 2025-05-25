import { SocialMedia } from "@/generated/prisma";
import { getTokenData } from "@/lib/jwt";
import prisma from "@/lib/prisma";
import { updateUserTokenAndReturnNextResponse } from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export interface SocialMediaIntegrationBody {
  platform: SocialMedia;
  clientId?: string;
  clientSecret?: string;
  accessToken?: string;
}

export async function PATCH(request: NextRequest) {
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

    const body: SocialMediaIntegrationBody = await request.json();
    const { platform, clientId, clientSecret, accessToken } = body;

    if (!platform) {
      return new NextResponse("Platform is required", { status: 400 });
    }

    // Validate that either clientId+clientSecret OR accessToken is provided
    if ((!clientId || !clientSecret) && !accessToken) {
      return new NextResponse(
        "Either clientId and clientSecret, or accessToken must be provided",
        { status: 400 }
      );
    }

    // Update user based on platform
    const updateData: Record<string, string> = {};

    switch (platform) {
      case SocialMedia.TUMBLR:
        if (clientId && clientSecret) {
          updateData.tumblrClientId = clientId;
          updateData.tumblrClientSecret = clientSecret;
        }
        break;
      case SocialMedia.PINTEREST:
        if (clientId && clientSecret) {
          updateData.pinterestClientId = clientId;
          updateData.pinterestClientSecret = clientSecret;
        }
        break;
      // Add cases for other platforms here as they are implemented
      default:
        return new NextResponse(
          `Integration for ${platform} is not yet supported`,
          { status: 400 }
        );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return updateUserTokenAndReturnNextResponse(updatedUser);
  } catch (error) {
    console.error("[SOCIAL_MEDIA_INTEGRATION_ERROR]", error);
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
      return new NextResponse("Platform is required", { status: 400 });
    }

    // Clear platform specific credentials
    const updateData: Record<string, null> = {};

    switch (platform) {
      case SocialMedia.TUMBLR:
        updateData.tumblrClientId = null;
        updateData.tumblrClientSecret = null;
        break;
      case SocialMedia.PINTEREST:
        updateData.pinterestClientId = null;
        updateData.pinterestClientSecret = null;
        break;
      // Add cases for other platforms here as they are implemented
      default:
        return new NextResponse(
          `Integration for ${platform} is not yet supported`,
          { status: 400 }
        );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    console.log("delete", updatedUser);

    return updateUserTokenAndReturnNextResponse(updatedUser);
  } catch (error) {
    console.error("[SOCIAL_MEDIA_INTEGRATION_DELETE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
