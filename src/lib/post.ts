import { PostWithRelations } from "@/app/api/post/types";

export function postIsEditable(post: PostWithRelations) {
  const noSocialMediaPostsPosted = post.socialMediaPosts.every(
    (post) => !post.socialMediaPostId
  );

  const scheduledInFuture = post?.scheduledAt
    ? post?.scheduledAt > new Date()
    : false;

  return (
    !post.postedAt &&
    !post.failedAt &&
    noSocialMediaPostsPosted &&
    scheduledInFuture
  );
}
