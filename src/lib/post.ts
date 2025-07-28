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

export function canUnarchivePost(post?: PostWithRelations) {
  if (!post?.archivedAt) return false;
  const archivedDate = new Date(post.archivedAt);
  const now = new Date();
  const diff = (now.getTime() - archivedDate.getTime()) / (1000 * 60 * 60 * 24);
  return diff <= 30;
}
