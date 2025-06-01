import { PostWithRelations } from "@/app/api/post/types";

export function postIsEditable(post: PostWithRelations) {
  const noSocialMediaPostsPosted = post.socialMediaPosts.every(
    (p) => !p.postedAt && !p.failedAt && !p.failedReason && !p.socialMediaPostId
  );

  const scheduledInFuture = post?.scheduledAt
    ? post?.scheduledAt > new Date()
    : false;

  return noSocialMediaPostsPosted && scheduledInFuture;
}
