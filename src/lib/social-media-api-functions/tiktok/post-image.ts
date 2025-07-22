import {
  PostWithRelations,
  SocialMediaPostWithRelations,
} from "@/app/api/post/types";

export const postImage = async (
  post: PostWithRelations,
  socialMediaPost: SocialMediaPostWithRelations
): Promise<void> => {
  throw new Error("Not implemented");
};
