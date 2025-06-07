import { PostType } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { getSocialMediaApiFunctions } from "@/lib/social-media-api-functions/social-media-api-functions";
import { getUserFromToken } from "@/lib/user";

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
    },
    include: {
      socialMediaPosts: {
        include: {
          socialMediaIntegration: true,
        },
      },
    },
  });

  console.log(`Found ${posts.length} posts to post`);

  for (const post of posts) {
    for (const socialMediaPost of post.socialMediaPosts) {
      const socialMediaApiFunctions = getSocialMediaApiFunctions(
        socialMediaPost.socialMediaIntegration.socialMedia
      );

      if (!socialMediaApiFunctions) {
        throw new Error(
          `Social media API functions not found for ${socialMediaPost.socialMediaIntegration.socialMedia}`
        );
      }

      if (post.postType === PostType.TEXT) {
        await socialMediaApiFunctions.postText(post);
      } else if (post.postType === PostType.IMAGE) {
        await socialMediaApiFunctions.postImage(post);
      } else if (post.postType === PostType.VIDEO) {
        await socialMediaApiFunctions.postVideo(post);
      }
    }
  }

  return new Response("OK!");
}
