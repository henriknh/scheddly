import prisma from "@/lib/prisma";

if (!process.env.CRON_SECRET) {
  throw new Error("CRON_SECRET is not set");
}

export async function GET(request: Request) {
  const params = new URLSearchParams(request.url.split("?")[1]);
  const secret = params.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.info("[CRON] Archive old posts");

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          scheduledAt: {
            lt: thirtyDaysAgo,
          },
        },
        {
          scheduledAt: null,
          updatedAt: {
            lt: thirtyDaysAgo,
          },
        },
      ],
      archived: false,
    },
  });

  console.info(`[CRON] Found ${posts.length} posts to archive`);

  await Promise.all(
    posts.map(async (post) =>
      prisma.post.update({
        where: { id: post.id },
        data: { archived: true, archivedAt: new Date() },
      })
    )
  );

  return Response.json({ message: `${posts.length} posts archived` });
}
