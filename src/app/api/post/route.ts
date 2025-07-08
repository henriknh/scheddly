import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";
import { postPost } from "./post-post";

export async function GET() {
  const user = await getUserFromToken();

  if (!user || !user.id || !user.teamId) {
    throw new Error("Unauthorized");
  }

  const posts = await prisma.post.findMany({
    where: {
      teamId: user.teamId,
      OR: [
        {
          scheduledAt: {
            not: {
              gt: new Date(),
            },
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
          brand: true,
        },
      },
      images: true,
      video: true,
      videoCover: true,
    },
  });

  console.info(`Found ${posts.length} posts to post`);

  await Promise.all(posts.map(postPost));

  return new Response("OK!");
}
