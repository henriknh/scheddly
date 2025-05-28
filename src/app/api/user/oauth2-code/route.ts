import { SocialMedia } from "@/generated/prisma";
import { getTokenData } from "@/lib/jwt";
import prisma from "@/lib/prisma";
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

    const body: Oauth2CodeBody = await request.json();
    const { platform, code } = body;

    if (!platform || !code) {
      return new NextResponse("Platform and code are required", {
        status: 400,
      });
    }

    // Create social media integration
    await prisma.socialMediaIntegration.create({
      data: {
        socialMedia: platform,
        code,
        createdById: payload.id,
      },
    });

    return new NextResponse("Integration created successfully");
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

    const { searchParams } = new URL(request.url);
    const platform = searchParams.get("platform") as SocialMedia;

    if (!platform) {
      return new NextResponse("Platform is required", {
        status: 400,
      });
    }

    // Delete the integration
    await prisma.socialMediaIntegration.deleteMany({
      where: {
        socialMedia: platform,
        createdById: payload.id,
      },
    });

    return new NextResponse("Integration deleted successfully");
  } catch (error) {
    console.error("[OAUTH2_CODE_REMOVAL_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
