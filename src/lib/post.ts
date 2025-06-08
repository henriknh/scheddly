import { PostWithRelations } from "@/app/api/post/types";

export function postIsEditable(post: PostWithRelations) {
  const noSocialMediaPostsPostedOrFailed = post.socialMediaPosts.every(
    (smp) => !smp.postedAt && !smp.failedAt
  );

  const scheduledInFuture = post?.scheduledAt
    ? post?.scheduledAt > new Date()
    : false;

  return noSocialMediaPostsPostedOrFailed && scheduledInFuture;
}
