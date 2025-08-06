import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { startOfDay, endOfDay, addDays } from "date-fns";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    const tomorrow = addDays(today, 1);

    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const tomorrowStart = startOfDay(tomorrow);
    const tomorrowEnd = endOfDay(tomorrow);

    // Get today's posts count
    const todayPosts = await prisma.post.count({
      where: {
        userId: session.user.id,
        scheduledAt: {
          gte: todayStart,
          lte: todayEnd,
        },
        archived: false,
      },
    });

    // Get tomorrow's posts count
    const tomorrowPosts = await prisma.post.count({
      where: {
        userId: session.user.id,
        scheduledAt: {
          gte: tomorrowStart,
          lte: tomorrowEnd,
        },
        archived: false,
      },
    });

    return NextResponse.json({
      today: todayPosts,
      tomorrow: tomorrowPosts,
    });
  } catch (error) {
    console.error("Error fetching posts summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts summary" },
      { status: 500 }
    );
  }
}