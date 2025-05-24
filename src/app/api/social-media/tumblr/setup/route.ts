import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { consumerKey, consumerSecret } = await request.json();

    if (!consumerKey || !consumerSecret) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        tumblrOAuthConsumerKey: consumerKey,
        tumblrOAuthConsumerSecret: consumerSecret,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save Tumblr configuration:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
