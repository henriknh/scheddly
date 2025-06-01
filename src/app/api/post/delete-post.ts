import prisma from "@/lib/prisma";
import { getUserFromToken } from "@/lib/user";

export async function deletePost(postId: string) {
  const user = await getUserFromToken();

  if (!user || !user.id || !user.teamId) {
    throw new Error("Unauthorized");
  }

  const post = await prisma.post.findUnique({
    where: { id: postId, teamId: user.teamId },
    include: {
      socialMediaPosts: true,
    },
  });

  if (!post) {
    throw new Error("Post not found");
  }

  const someSocialMediaPostsPosted = post.socialMediaPosts.some(
    (socialMediaPost) =>
      socialMediaPost.postedAt ||
      socialMediaPost.socialMediaIntegrationId ||
      socialMediaPost.failedAt ||
      socialMediaPost.failedReason
  );

  if (someSocialMediaPostsPosted) {
    throw new Error("Post has already been posted");
  }

  await prisma.post.delete({
    where: { id: post.id },
    include: {
      socialMediaPosts: true,
    },
  });
}
