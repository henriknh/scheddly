import prisma from "@/lib/prisma";
import { postPost } from "../../post/post-post";

if (!process.env.CRON_SECRET) {
  throw new Error("CRON_SECRET is not set");
}

export async function GET(request: Request) {
  const params = new URLSearchParams(request.url.split("?")[1]);
  const secret = params.get("secret");

  if (secret !== process.env.CRON_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  console.info("CRON: Post posts");

  const posts = await prisma.post.findMany({
    where: {
      OR: [
        {
          scheduledAt: {
            lte: new Date(),
          },
        },
        {
          scheduledAt: null,
        },
      ],
      socialMediaPosts: {
        some: {
          postedAt: null,
        },
      },
      archived: false,
    },
    include: {
      socialMediaPosts: {
        include: {
          socialMediaIntegration: {
            include: {
              brand: true,
            },
          },
        },
      },
      images: true,
      video: true,
      videoCover: true,
    },
  });

  console.info(`CRON: Found ${posts.length} posts to post`);

  await Promise.all(posts.map(postPost));

  return Response.json({ message: `${posts.length} posts posted` });
}
