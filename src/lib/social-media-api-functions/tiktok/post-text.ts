import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";

export const postText = async (
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
): Promise<void> => {
  throw new Error("Not implemented");
};
