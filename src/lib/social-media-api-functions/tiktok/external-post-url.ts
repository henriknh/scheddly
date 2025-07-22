import { SocialMediaPostWithRelations } from "@/app/api/post/types";

export const externalPostUrl = async (
  socialMediaPost: SocialMediaPostWithRelations
): Promise<string> => {
  throw new Error("Not implemented");
};
