import { cookies } from "next/headers";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function getTeamId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: token, // Using email as token for now
      },
      select: {
        teamId: true,
      },
    });

    return user?.teamId || null;
  } catch (error) {
    console.error("Error getting team ID:", error);
    return null;
  }
}
