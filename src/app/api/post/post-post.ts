"use server";

import { postSocialMediaPost } from "./post-social-media-post";
import { PostWithRelations } from "./types";

export async function postPost(post: PostWithRelations) {
  console.info("Posting post", post.id);

  await Promise.all(
    post.socialMediaPosts.map(async (socialMediaPost) =>
      postSocialMediaPost(post, socialMediaPost)
    )
  );
}
