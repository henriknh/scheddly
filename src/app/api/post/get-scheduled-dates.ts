import { Post } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function getScheduledDates(): Promise<Date[]> {
  const user = await getUserFromToken();
  if (!user || !user.id || !user.teamId) {
    throw new Error("Unauthorized");
  }

  const scheduledDates = await prisma.post.findMany({
    where: {
      teamId: user.teamId,
      scheduledAt: {
        not: null,
      },
    },
  });

  return scheduledDates
    .map((post: Post) => new Date(post.scheduledAt!))
    .filter((date) => date.getTime() > new Date().getTime())
    .sort((a, b) => a.getTime() - b.getTime());
}
