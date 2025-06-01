"use server";

import { PostType, SocialMedia } from "@/generated/prisma";
import { pinterest } from "@/lib/social-media-api-functions/pinterest";
import { getPost } from "./get-post";

const getSocialMediaApiFunctions = (socialMedia: SocialMedia) => {
  switch (socialMedia) {
    case SocialMedia.PINTEREST:
      return pinterest;
  }

  return null;
};

export async function postPost(postId: string) {
  const post = await getPost(postId);

  post.socialMediaPosts.forEach(async (socialMediaPost) => {
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
  });
}
