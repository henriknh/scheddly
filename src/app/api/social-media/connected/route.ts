import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const connectedPlatforms = await db.socialMediaCredentials.findMany({
      where: {
        userId: userId,
      },
      select: {
        platform: true,
      },
    });

    return NextResponse.json({
      platforms: connectedPlatforms.map(
        (p: { platform: string }) => p.platform
      ),
    });
  } catch (error) {
    console.error("Failed to fetch connected platforms:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
